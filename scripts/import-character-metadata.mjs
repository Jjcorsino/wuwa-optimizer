#!/usr/bin/env node
// Genera metadata de personajes desde el dataset localizado de wuthering.gg.
//
// Salidas:
// - apps/web/app/Core/Generated/ImportedCharacterMetadata.ts
// - apps/web/i18n/generated/character-metadata/<locale>.ts
//
// Uso:
//   node scripts/import-character-metadata.mjs
//   node scripts/import-character-metadata.mjs --all
//   node scripts/import-character-metadata.mjs --id 9912 --id 9913
//   node scripts/import-character-metadata.mjs --locales en-US,fr-FR,ja-JP
//   node scripts/import-character-metadata.mjs --dry-run

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, "..")
const CHARACTERS_TS = join(REPO_ROOT, "apps/web/app/Core/Characters.ts")
const GENERATED_METADATA_TS = join(REPO_ROOT, "apps/web/app/Core/Generated/ImportedCharacterMetadata.ts")
const GENERATED_LOCALE_DIR = join(REPO_ROOT, "apps/web/i18n/generated/character-metadata")

const WEB_HEADERS = {
  "User-Agent": "wuwa-optimizer/import-character-metadata (local script)",
}

const PROJECT_LOCALES = {
  "en-US": "en",
  "fr-FR": "fr",
  "ja-JP": "ja",
}

const WEAPON_ICONS = {
  BROADBLADE: "Skill_Broadblade.webp",
  SWORD: "Skill_Sword.webp",
  PISTOLS: "Skill_Pistols.webp",
  GAUNTLETS: "Skill_Gauntlets.webp",
  RECTIFIER: "Skill_Rectifier.webp",
}

const SKILL_DEFINITIONS = [
  {
    id: "Basic_Attack",
    localeKey: "basic_attack",
    icon: character => WEAPON_ICONS[character.weaponType] ?? "Skill_Sword.webp",
  },
  {
    id: "Forte_Circuit",
    localeKey: "forte_circuit",
    icon: character => `${character.name}_Forte_Circuit.webp`,
  },
  {
    id: "Inherent_Skill_01",
    localeKey: "inherent_skill_01",
    icon: character => `${character.name}_Inherent_Skill_01.webp`,
  },
  {
    id: "Inherent_Skill_02",
    localeKey: "inherent_skill_02",
    icon: character => `${character.name}_Inherent_Skill_02.webp`,
  },
  {
    id: "Intro_Skill",
    localeKey: "intro_skill",
    icon: character => `${character.name}_Intro_Skill.webp`,
  },
  {
    id: "Outro_Skill",
    localeKey: "outro_skill",
    icon: character => `${character.name}_Outro_Skill.webp`,
  },
  {
    id: "Resonance_Liberation",
    localeKey: "resonance_liberation",
    icon: character => `${character.name}_Resonance_Liberation.webp`,
  },
  {
    id: "Resonance_Skill",
    localeKey: "resonance_skill",
    icon: character => `${character.name}_Resonance_Skill.webp`,
  },
]

const SEQUENCE_COUNT = 6
const ARGS = parseArgs(process.argv.slice(2))

let localeModuleUrlCache = null
const characterDatasetCache = new Map()

async function main() {
  const repoCharacters = await parseCharacters(CHARACTERS_TS)
  const selectedCharacters = selectCharacters(repoCharacters)

  if (!selectedCharacters.length) {
    fail("No se encontraron personajes para importar con los filtros indicados.")
  }

  console.log(`Objetivo: ${selectedCharacters.length} personaje(s).`)

  const englishDataset = await getCharacterDataset("en-US")
  const englishIndex = buildRemoteIndex(englishDataset)
  const targets = selectedCharacters.map((character) => {
    const remote = matchRemoteCharacter(character, englishIndex)
    if (!remote) {
      fail(`No se pudo mapear ${character.id} (${character.name}) contra el dataset de wuthering.gg.`)
    }

    return {
      ...character,
      remoteId: remote.Id,
      remoteEnglish: remote,
    }
  })

  const localeEntriesByLocale = {}
  for (const projectLocale of ARGS.locales) {
    const localeDataset = await getCharacterDataset(projectLocale)
    const localeIndex = buildRemoteIndex(localeDataset)
    localeEntriesByLocale[projectLocale] = buildLocaleEntries(targets, localeIndex)
  }

  const importedSkills = {}
  const importedSequences = {}

  for (const target of targets) {
    importedSkills[target.id] = buildImportedSkills(target)
    importedSequences[target.id] = buildImportedSequences(target)
  }

  if (ARGS.dryRun) {
    console.log("Dry run:")
    console.log(`- Metadata: ${Object.keys(importedSkills).length} personajes.`)
    for (const projectLocale of ARGS.locales) {
      console.log(`- Locale ${projectLocale}: ${Object.keys(localeEntriesByLocale[projectLocale]).length} entradas.`)
    }
    return
  }

  await writeGeneratedMetadata(importedSkills, importedSequences)
  for (const projectLocale of ARGS.locales) {
    await writeGeneratedLocale(projectLocale, localeEntriesByLocale[projectLocale])
  }

  console.log(`Metadata generada en ${rel(GENERATED_METADATA_TS)}`)
  for (const projectLocale of ARGS.locales) {
    console.log(`Locale generado: ${rel(join(GENERATED_LOCALE_DIR, `${projectLocale}.ts`))}`)
  }
}

function selectCharacters(repoCharacters) {
  let selected = repoCharacters

  if (ARGS.ids.length) {
    const ids = new Set(ARGS.ids)
    selected = selected.filter(character => ids.has(character.id))
  }
  else if (!ARGS.all) {
    selected = selected.filter(character => character.usesImportedMetadataHelpers)
  }

  return selected.sort((left, right) => left.id - right.id)
}

async function parseCharacters(filePath) {
  const source = await readFile(filePath, "utf8")
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const characters = []

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || !hasExportModifier(statement)) {
      continue
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
        continue
      }

      const objectLiteral = declaration.initializer
      const id = getNumberProperty(objectLiteral, "Id")
      const icon = getStringProperty(objectLiteral, "Icon")
      const weaponType = getEnumMemberName(objectLiteral, "WeaponType")
      if (!id || !icon || !weaponType) {
        continue
      }

      characters.push({
        id,
        name: icon.replace(/_Icon\.webp$/u, ""),
        weaponType,
        usesImportedMetadataHelpers:
          getCallIdentifierName(objectLiteral, "BaseSkills") === "CreateMinimalBaseSkillsFromName"
          || getCallIdentifierName(objectLiteral, "BaseSequences") === "CreateBaseSequencesFromName",
      })
    }
  }

  return characters
}

function buildImportedSkills(character) {
  const skillMap = getRemoteSkillMap(character.remoteEnglish.Skills)

  return SKILL_DEFINITIONS.map((definition) => {
    const remoteSkill = skillMap.get(definition.id)
    if (!remoteSkill) {
      return {
        Id: definition.id,
        Level: 10,
        Icon: definition.icon(character),
        Unlocked: true,
      }
    }

    const description = formatSkillDescription(remoteSkill.SkillDescribe, remoteSkill.SkillDetailNum)
    const skill = {
      Id: definition.id,
      Name: remoteSkill.SkillName,
      Level: 10,
      Icon: definition.icon(character),
      Unlocked: true,
    }

    if (description) {
      skill.Description = description
    }

    return skill
  })
}

function buildImportedSequences(character) {
  const remoteSequences = Array.isArray(character.remoteEnglish.ResonantChainGroup)
    ? character.remoteEnglish.ResonantChainGroup
    : []

  return Array.from({ length: SEQUENCE_COUNT }, (_, index) => {
    const sequence = remoteSequences[index]
    return {
      Name: sequence?.NodeName ?? "",
      Icon: `${character.name}_Sequence_Node_${String(index + 1).padStart(2, "0")}.webp`,
      Unlocked: false,
    }
  })
}

function buildLocaleEntries(targets, localeIndex) {
  const entries = {}
  const sampleRemote = targets
    .map(target => localeIndex.byId.get(target.remoteId) ?? target.remoteEnglish)
    .find(item => Array.isArray(item?.Skills) && item.Skills.length)
    ?? null

  if (sampleRemote) {
    const sampleSkillMap = getRemoteSkillMap(sampleRemote.Skills)
    entries.skill_basic_attack = sampleSkillMap.get("Basic_Attack")?.TypeName ?? "Normal Attack"
    entries.skill_resonance_skill = sampleSkillMap.get("Resonance_Skill")?.TypeName ?? "Resonance Skill"
    entries.skill_resonance_liberation = sampleSkillMap.get("Resonance_Liberation")?.TypeName ?? "Resonance Liberation"
    entries.skill_forte_circuit = sampleSkillMap.get("Forte_Circuit")?.TypeName ?? "Forte Circuit"
    entries.skill_inherent_skill_1 = sampleSkillMap.get("Inherent_Skill_01")?.TypeName ?? "Inherent Skill"
    entries.skill_inherent_skill_2 = sampleSkillMap.get("Inherent_Skill_02")?.TypeName ?? "Inherent Skill"
    entries.skill_inherent_skill_01 = entries.skill_inherent_skill_1
    entries.skill_inherent_skill_02 = entries.skill_inherent_skill_2
    entries.skill_intro_skill = sampleSkillMap.get("Intro_Skill")?.TypeName ?? "Intro Skill"
    entries.skill_outro_skill = sampleSkillMap.get("Outro_Skill")?.TypeName ?? "Outro Skill"
  }

  for (const target of targets) {
    const localizedCharacter = localeIndex.byId.get(target.remoteId) ?? target.remoteEnglish
    entries[`${target.id}_name`] = localizedCharacter.Name ?? localizedCharacter.NameEn ?? target.name.replaceAll("_", " ")

    const localizedSkillMap = getRemoteSkillMap(localizedCharacter.Skills)
    for (const definition of SKILL_DEFINITIONS) {
      const remoteSkill = localizedSkillMap.get(definition.id)
      if (!remoteSkill) {
        continue
      }

      entries[`${target.id}_${definition.localeKey}`] = remoteSkill.SkillName

      const description = formatSkillDescription(remoteSkill.SkillDescribe, remoteSkill.SkillDetailNum)
      if (description) {
        entries[`${target.id}_${definition.localeKey}_description`] = description
      }
    }
  }

  return entries
}

async function writeGeneratedMetadata(importedSkills, importedSequences) {
  await mkdir(dirname(GENERATED_METADATA_TS), { recursive: true })

  const source = [
    "import type Sequence from \"../Interfaces/Sequence\"",
    "import type Skill from \"../Interfaces/Skill\"",
    "",
    "// Generated by scripts/import-character-metadata.mjs",
    "// Source: https://wuthering.gg/characters",
    "// Do not edit manually.",
    "",
    `export const ImportedCharacterSequences: Record<number, Sequence[]> = ${toTsValue(importedSequences)}`,
    "",
    `export const ImportedCharacterSkills: Record<number, Skill[]> = ${toTsValue(importedSkills)}`,
    "",
  ].join("\n")

  await writeFile(GENERATED_METADATA_TS, source, "utf8")
}

async function writeGeneratedLocale(projectLocale, entries) {
  await mkdir(GENERATED_LOCALE_DIR, { recursive: true })

  const source = [
    "// Generated by scripts/import-character-metadata.mjs",
    "// Source: https://wuthering.gg/characters",
    "// Do not edit manually.",
    "",
    `export default ${toTsValue(entries, 0, { quoteAllKeys: true })}`,
    "",
  ].join("\n")

  await writeFile(join(GENERATED_LOCALE_DIR, `${projectLocale}.ts`), source, "utf8")
}

function buildRemoteIndex(dataset) {
  const byId = new Map()
  const byName = new Map()

  for (const item of dataset) {
    if (!item || typeof item !== "object" || typeof item.Id !== "number") {
      continue
    }

    byId.set(item.Id, item)

    const candidates = [
      item.NameEn,
      item.Name,
    ].filter(Boolean)

    for (const candidate of candidates) {
      byName.set(normalizeName(candidate), item)
    }
  }

  return { byId, byName }
}

function matchRemoteCharacter(character, remoteIndex) {
  return remoteIndex.byId.get(character.id)
    ?? remoteIndex.byName.get(normalizeName(character.name))
    ?? remoteIndex.byName.get(normalizeName(character.name.replaceAll("_", " ")))
    ?? null
}

function getRemoteSkillMap(skills) {
  const list = Array.isArray(skills) ? skills : []
  const inherentSkills = list.filter(skill => skill?.SkillType === 4)

  return new Map([
    ["Basic_Attack", list.find(skill => skill?.SkillType === 1) ?? null],
    ["Resonance_Skill", list.find(skill => skill?.SkillType === 2) ?? null],
    ["Resonance_Liberation", list.find(skill => skill?.SkillType === 3) ?? null],
    ["Inherent_Skill_01", inherentSkills[0] ?? null],
    ["Inherent_Skill_02", inherentSkills[1] ?? null],
    ["Intro_Skill", list.find(skill => skill?.SkillType === 5) ?? null],
    ["Forte_Circuit", list.find(skill => skill?.SkillType === 6) ?? null],
    ["Outro_Skill", list.find(skill => skill?.SkillType === 11) ?? null],
  ])
}

function formatSkillDescription(template, detailNumbers = []) {
  if (!template) {
    return ""
  }

  let text = String(template)
  for (const [index, detail] of detailNumbers.entries()) {
    text = text.replaceAll(`{${index}}`, String(detail))
  }

  return decodeHtml(text)
    .replace(/\r/gu, "")
    .replace(/<br\s*\/?>/giu, "\n")
    .replace(/\{Cus[^}]*\}/gu, "")
    .replace(/<[^>]+>/gu, "")
    .replace(/[ \t]+\n/gu, "\n")
    .replace(/\n{3,}/gu, "\n\n")
    .replace(/[ \t]{2,}/gu, " ")
    .trim()
}

async function getCharacterDataset(projectLocale) {
  const ggLocale = PROJECT_LOCALES[projectLocale]
  if (!ggLocale) {
    fail(`Locale no soportado: ${projectLocale}.`)
  }

  if (!characterDatasetCache.has(ggLocale)) {
    characterDatasetCache.set(ggLocale, fetchCharacterDataset(ggLocale))
  }

  return characterDatasetCache.get(ggLocale)
}

async function fetchCharacterDataset(ggLocale) {
  const moduleUrls = await getLocaleModuleUrls()
  const moduleUrl = moduleUrls.get(ggLocale)
  if (!moduleUrl) {
    throw new Error(`No se encontro el modulo remoto de characters.json para locale ${ggLocale}.`)
  }

  const source = await fetchText(moduleUrl, WEB_HEADERS)
  const module = await import(`data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`)
  return Array.isArray(module.default) ? module.default : []
}

async function getLocaleModuleUrls() {
  if (!localeModuleUrlCache) {
    localeModuleUrlCache = discoverLocaleModuleUrls()
  }
  return localeModuleUrlCache
}

async function discoverLocaleModuleUrls() {
  const html = await fetchText("https://wuthering.gg/characters/lynae", WEB_HEADERS)
  const bundleRefs = [...new Set([...html.matchAll(/\/_nuxt\/[^"']+\.js/gu)].map(match => match[0]))]

  for (const bundleRef of bundleRefs) {
    const bundleUrl = new URL(bundleRef, "https://wuthering.gg").toString()

    try {
      const source = await fetchText(bundleUrl, WEB_HEADERS)
      if (!source.includes("../data/en/characters.json")) {
        continue
      }

      const map = new Map()
      for (const match of source.matchAll(/\.\.\/data\/([^/]+)\/characters\.json":\(\)=>t\(\(\)=>import\("([^"]+)"\)/gu)) {
        map.set(match[1], new URL(match[2], bundleUrl).toString())
      }

      if (map.size) {
        return map
      }
    }
    catch {
      // Seguimos con el siguiente bundle.
    }
  }

  throw new Error("No se pudo descubrir el modulo remoto de characters.json en wuthering.gg.")
}

async function fetchText(url, headers) {
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.text()
}

function getProperty(objectLiteral, propertyName) {
  return objectLiteral.properties.find(property =>
    ts.isPropertyAssignment(property)
    && ts.isIdentifier(property.name)
    && property.name.text === propertyName,
  )
}

function getStringProperty(objectLiteral, propertyName) {
  const property = getProperty(objectLiteral, propertyName)
  if (!property) {
    return null
  }

  const initializer = property.initializer
  if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
    return initializer.text
  }

  return null
}

function getNumberProperty(objectLiteral, propertyName) {
  const property = getProperty(objectLiteral, propertyName)
  if (!property) {
    return null
  }

  const initializer = property.initializer
  if (ts.isNumericLiteral(initializer)) {
    return Number(initializer.text)
  }

  return null
}

function getEnumMemberName(objectLiteral, propertyName) {
  const property = getProperty(objectLiteral, propertyName)
  if (!property) {
    return null
  }

  const initializer = property.initializer
  if (ts.isPropertyAccessExpression(initializer)) {
    return initializer.name.text
  }

  if (ts.isIdentifier(initializer)) {
    return initializer.text
  }

  return null
}

function getCallIdentifierName(objectLiteral, propertyName) {
  const property = getProperty(objectLiteral, propertyName)
  if (!property || !ts.isCallExpression(property.initializer)) {
    return null
  }

  const expression = property.initializer.expression
  if (ts.isIdentifier(expression)) {
    return expression.text
  }

  return null
}

function hasExportModifier(statement) {
  return statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

function parseArgs(argv) {
  const args = {
    all: false,
    dryRun: false,
    ids: [],
    locales: Object.keys(PROJECT_LOCALES),
  }

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg === "--all") {
      args.all = true
    }
    else if (arg === "--dry-run") {
      args.dryRun = true
    }
    else if (arg === "--id") {
      args.ids.push(Number(argv[++index]))
    }
    else if (arg === "--locales" || arg === "--locale") {
      args.locales = String(argv[++index]).split(",").map(value => value.trim()).filter(Boolean)
    }
    else if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    }
    else {
      fail(`Argumento desconocido: ${arg}`)
    }
  }

  const invalidLocales = args.locales.filter(locale => !(locale in PROJECT_LOCALES))
  if (invalidLocales.length) {
    fail(`Locales no soportados: ${invalidLocales.join(", ")}. Validos: ${Object.keys(PROJECT_LOCALES).join(", ")}`)
  }

  const invalidIds = args.ids.filter(id => !Number.isFinite(id))
  if (invalidIds.length) {
    fail(`IDs invalidos: ${invalidIds.join(", ")}`)
  }

  return args
}

function printHelp() {
  console.log(`Uso: node scripts/import-character-metadata.mjs [opciones]

Opciones:
  --all                    Importa todos los personajes del repo que existan en el dataset remoto
  --id <id>                Importa un personaje puntual por ID del repo (repetible)
  --locales <csv>          Locales del proyecto a generar: ${Object.keys(PROJECT_LOCALES).join(", ")}
  --dry-run                No escribe archivos; solo muestra un resumen
  -h, --help               Imprime esta ayuda
`)
}

function decodeHtml(value) {
  return value
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
}

function toTsValue(value, indentLevel = 0, options = {}) {
  const indent = "  ".repeat(indentLevel)
  const childIndent = "  ".repeat(indentLevel + 1)

  if (Array.isArray(value)) {
    if (!value.length) {
      return "[]"
    }

    const items = value.map(item => `${childIndent}${toTsValue(item, indentLevel + 1, options)},`)
    return `[\n${items.join("\n")}\n${indent}]`
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
    if (!entries.length) {
      return "{}"
    }

    const properties = entries.map(([key, entryValue]) =>
      `${childIndent}${toTsPropertyKey(key, options)}: ${toTsValue(entryValue, indentLevel + 1, options)},`,
    )

    return `{\n${properties.join("\n")}\n${indent}}`
  }

  if (typeof value === "string") {
    return JSON.stringify(value)
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (value === null) {
    return "null"
  }

  throw new Error(`Valor no soportado en serializacion TS: ${typeof value}`)
}

function toTsPropertyKey(key, options = {}) {
  if (!options.quoteAllKeys && (/^\d+$/u.test(key) || /^[$A-Z_a-z][$\w]*$/u.test(key))) {
    return key
  }

  return JSON.stringify(key)
}

function normalizeName(value) {
  return decodeHtml(value)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "")
}

function rel(filePath) {
  return filePath.replace(REPO_ROOT, "").replace(/\\/gu, "/")
}

function fail(message) {
  console.error(`error: ${message}`)
  process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
