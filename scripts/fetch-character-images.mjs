#!/usr/bin/env node
// Descarga assets faltantes de personajes, armas y echoes.
//
// Fuentes:
// - Personajes: Kuro Guide (icon/portrait) + Fandom / wuthering.gg (fallback para skills/sequences)
// - Armas: wuthering.gg/weapons
// - Echoes: wuthering.gg/echos
//
// Uso:
//   node scripts/fetch-character-images.mjs
//   node scripts/fetch-character-images.mjs --entity weapons,echoes
//   node scripts/fetch-character-images.mjs --id 9906 --id 21010105 --id 6000111
//   node scripts/fetch-character-images.mjs --dry-run
//   node scripts/fetch-character-images.mjs --only icon,portrait
//   node scripts/fetch-character-images.mjs --include-fallback

import { access, mkdir, readFile, writeFile } from "node:fs/promises"
import { constants as FS } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, "..")
const CHARACTERS_TS = join(REPO_ROOT, "apps/web/app/Core/Characters.ts")
const WEAPONS_TS = join(REPO_ROOT, "apps/web/app/Core/Weapons.ts")
const ECHOES_TS = join(REPO_ROOT, "apps/web/app/Core/Echoes.ts")
const PUBLIC_CHARACTERS = join(REPO_ROOT, "apps/web/public/characters")
const PUBLIC_WEAPONS = join(REPO_ROOT, "apps/web/public/weapons")
const PUBLIC_ECHOES = join(REPO_ROOT, "apps/web/public/images/echoes")

const GUIDE_HEADERS = {
  "User-Agent": "wuwa-optimizer/fetch-character-images (local script)",
  Origin: "https://wuwaguide.kurogames.com",
  Referer: "https://wuwaguide.kurogames.com/",
}

const WEB_HEADERS = {
  "User-Agent": "wuwa-optimizer/fetch-character-images (local script)",
}

const VALID_ENTITIES = ["characters", "weapons", "echoes"]

// Cada kind tiene:
//   target: como se guarda en el repo (sin extension)
//   fandom: lista de nombres candidatos a buscar en la wiki (sin extension; el script prueba .webp y .png)
const ASSET_KINDS = {
  icon: {
    target: n => `${n}_Icon`,
    fandom: n => [`${n}_Icon`, `${n}_Card`, `${n}_Profile_Header`],
  },
  portrait: {
    target: n => `${n}_Portrait`,
    fandom: n => [`${n}_Portrait`, `${n}_Splash_Art`, `${n}_Convene_Still`, `${n}_Full_Sprite`],
  },
  forte: {
    target: n => `${n}_Forte_Circuit`,
    fandom: n => [`${n}_Forte_Circuit`, `${n}_Forte_Gauge`],
  },
  intro: {
    target: n => `${n}_Intro_Skill`,
    fandom: n => [`${n}_Intro_Skill`],
  },
  outro: {
    target: n => `${n}_Outro_Skill`,
    fandom: n => [`${n}_Outro_Skill`],
  },
  liberation: {
    target: n => `${n}_Resonance_Liberation`,
    fandom: n => [`${n}_Resonance_Liberation`],
  },
  skill: {
    target: n => `${n}_Resonance_Skill`,
    fandom: n => [`${n}_Resonance_Skill`],
  },
  inherent1: {
    target: n => `${n}_Inherent_Skill_01`,
    fandom: n => [`${n}_Inherent_Skill_01`],
  },
  inherent2: {
    target: n => `${n}_Inherent_Skill_02`,
    fandom: n => [`${n}_Inherent_Skill_02`],
  },
  seq1: { target: n => `${n}_Sequence_Node_01`, fandom: n => [`${n}_Sequence_Node_01`, `${n}_Resonance_Chain_1`] },
  seq2: { target: n => `${n}_Sequence_Node_02`, fandom: n => [`${n}_Sequence_Node_02`, `${n}_Resonance_Chain_2`] },
  seq3: { target: n => `${n}_Sequence_Node_03`, fandom: n => [`${n}_Sequence_Node_03`, `${n}_Resonance_Chain_3`] },
  seq4: { target: n => `${n}_Sequence_Node_04`, fandom: n => [`${n}_Sequence_Node_04`, `${n}_Resonance_Chain_4`] },
  seq5: { target: n => `${n}_Sequence_Node_05`, fandom: n => [`${n}_Sequence_Node_05`, `${n}_Resonance_Chain_5`] },
  seq6: { target: n => `${n}_Sequence_Node_06`, fandom: n => [`${n}_Sequence_Node_06`, `${n}_Resonance_Chain_6`] },
}

// Maps repo placeholder IDs (9901-9913) to official Kuro roleGbId values.
const KURO_ROLE_ID = {
  9901: "1306",
  9902: "1410",
  9903: "1208",
  9904: "1411",
  9905: "1508",
  9906: "1108",
  9907: "1211",
  9908: "1209",
  9909: "1210",
  9910: "1307",
  9911: "1412",
  9912: "1509",
  9913: "1510",
}

const KURO_API_BASE = "https://guide-server.aki-game.net"

const GG_INTERNAL = {
  9901: { pile: "aogusita", device: "Aogusita" },
  9902: { pile: "younuo", device: "Younuo" },
  9903: { pile: "jiabeilina", device: "JiaBeiLiNa" },
  9904: { pile: "qiuyuan", device: "Qiuyuan" },
  9905: { pile: "Qianxiao", device: "Qianxiao" },
  9906: { pile: "Feixue", device: "Feixue" },
  9907: { pile: "daniya", device: "Daniya" },
  9908: { pile: "Moning", device: "MoNing" },
  9909: { pile: "Aimisi", device: "Aimisi" },
  9910: { pile: "Buling", device: "Buling" },
  9911: { pile: "Xigelika", device: "Xigelika" },
  9912: { pile: "Linnai", device: "Linnai" },
  9913: { pile: "Luhesi", device: "Luhesi" },
}

const ARGS = parseArgs(process.argv.slice(2))

let sharp = null
let usedSourceExtensionFallback = false
let kuroCharactersCache = null
let wutheringGgCharactersCache = null
let wutheringGgCharactersModuleUrlCache = null
let wutheringGgWeaponsCache = null
let wutheringGgEchoesCache = null

try {
  ({ default: sharp } = await import("sharp"))
}
catch {
  // Sharp es opcional, pero sin el no podremos convertir PNG/JPG a WebP.
}

async function main() {
  const summaries = []

  if (ARGS.entities.includes("characters")) {
    summaries.push(await processCharacters())
  }

  if (ARGS.entities.includes("weapons")) {
    summaries.push(await processWeapons())
  }

  if (ARGS.entities.includes("echoes")) {
    summaries.push(await processEchoes())
  }

  console.log("")

  const totals = summaries.reduce((acc, summary) => {
    acc.downloaded += summary.downloaded
    acc.skipped += summary.skipped
    acc.failed += summary.failed
    return acc
  }, { downloaded: 0, skipped: 0, failed: 0 })

  for (const summary of summaries) {
    console.log(`[${summary.entity}] ${summary.downloaded} descargadas, ${summary.skipped} omitidas, ${summary.failed} no encontradas.`)
  }

  console.log(`Resumen total: ${totals.downloaded} descargadas, ${totals.skipped} omitidas, ${totals.failed} no encontradas.`)

  if (usedSourceExtensionFallback) {
    console.log("Aviso: sharp no esta instalado y algunos archivos se guardaron con su extension original.")
    console.log("Instala con: pnpm add -D -w sharp")
  }
}

async function processCharacters() {
  const characters = await parseCharacters(CHARACTERS_TS)
  const filtered = ARGS.ids.length
    ? characters.filter(character => ARGS.ids.includes(character.id))
    : characters

  const onlyKinds = ARGS.only.length ? ARGS.only : Object.keys(ASSET_KINDS)
  const unknownKinds = onlyKinds.filter(kind => !(kind in ASSET_KINDS))
  if (unknownKinds.length) {
    fail(`Tipos desconocidos en --only: ${unknownKinds.join(", ")}. Validos: ${Object.keys(ASSET_KINDS).join(", ")}`)
  }

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const character of filtered) {
    const dir = join(PUBLIC_CHARACTERS, String(character.id), "images")
    await mkdir(dir, { recursive: true })

    const missing = []
    for (const kind of onlyKinds) {
      const def = ASSET_KINDS[kind]
      const targetName = def.target(character.name)
      const targetWebp = join(dir, `${targetName}.webp`)
      if (await exists(targetWebp)) {
        continue
      }

      missing.push({
        kind,
        targetName,
        targetWebp,
        candidates: def.fandom(character.name),
      })
    }

    if (!missing.length) {
      console.log(`[characters][${character.id}] ${character.name}: OK`)
      continue
    }

    console.log(`[characters][${character.id}] ${character.name}: faltan ${missing.length} archivos (${missing.map(item => item.kind).join(", ")})`)

    if (ARGS.dryRun) {
      skipped += missing.length
      continue
    }

    for (const item of missing) {
      const status = await tryDownloadCharacterAsset(character, item)
      if (status === "downloaded") downloaded++
      else if (status === "exists") skipped++
      else failed++
    }
  }

  return {
    entity: "characters",
    downloaded,
    skipped,
    failed,
  }
}

async function processWeapons() {
  const weapons = await parseWeapons(WEAPONS_TS)
  const filtered = ARGS.ids.length
    ? weapons.filter(weapon => ARGS.ids.includes(weapon.gameId))
    : weapons

  const onlyKinds = ARGS.only.length ? ARGS.only : ["icon"]
  const wantsIcons = onlyKinds.includes("icon")

  let downloaded = 0
  let skipped = 0
  let failed = 0

  if (!wantsIcons) {
    return { entity: "weapons", downloaded, skipped: filtered.length, failed }
  }

  const weaponIndex = await getWutheringGgWeapons()

  for (const weapon of filtered) {
    const dir = join(PUBLIC_WEAPONS, String(weapon.gameId), "images")
    const targetWebp = join(dir, `${weapon.gameId}_Icon.webp`)

    if (await exists(targetWebp)) {
      console.log(`[weapons][${weapon.gameId}] ${weapon.name}: OK`)
      continue
    }

    console.log(`[weapons][${weapon.gameId}] ${weapon.name}: falta icono`)

    if (ARGS.dryRun) {
      skipped++
      continue
    }

    await mkdir(dir, { recursive: true })

    const candidate = getWeaponCandidate(weaponIndex, weapon) ?? await getWeaponDetailCandidate(weapon)
    if (!candidate) {
      console.log(`  [MISS] icon: no se encontro ${weapon.name} en wuthering.gg/weapons.`)
      failed++
      continue
    }

    try {
      const buffer = await fetchBuffer(candidate.url, WEB_HEADERS)
      const savedPath = await saveAssetBuffer(buffer, candidate.url, targetWebp)
      console.log(`  [wuthering.gg] icon: ${candidate.name} -> ${rel(savedPath)}`)
      downloaded++
    }
    catch (error) {
      console.log(`  [wuthering.gg] icon: error descargando ${candidate.url} (${error.message})`)
      failed++
    }
  }

  return {
    entity: "weapons",
    downloaded,
    skipped,
    failed,
  }
}

async function processEchoes() {
  const echoes = await parseEchoes(ECHOES_TS)
  const filtered = ARGS.ids.length
    ? echoes.filter(echo => ARGS.ids.includes(echo.gameId))
    : echoes

  const onlyKinds = ARGS.only.length ? ARGS.only : ["icon"]
  const wantsIcons = onlyKinds.includes("icon")

  let downloaded = 0
  let skipped = 0
  let failed = 0

  if (!wantsIcons) {
    return { entity: "echoes", downloaded, skipped: filtered.length, failed }
  }

  const echoIndex = await getWutheringGgEchoes()

  for (const echo of filtered) {
    const targetWebp = join(PUBLIC_ECHOES, echo.icon)

    if (await exists(targetWebp)) {
      console.log(`[echoes][${echo.gameId}] ${echo.displayName}: OK`)
      continue
    }

    console.log(`[echoes][${echo.gameId}] ${echo.displayName}: falta icono`)

    if (ARGS.dryRun) {
      skipped++
      continue
    }

    const key = normalizeName(echo.displayName)
    const candidate = echoIndex.get(key)
    if (!candidate) {
      console.log(`  [MISS] icon: no se encontro ${echo.displayName} en wuthering.gg/echos.`)
      failed++
      continue
    }

    try {
      const buffer = await fetchBuffer(candidate.url, WEB_HEADERS)
      const savedPath = await saveAssetBuffer(buffer, candidate.url, targetWebp)
      console.log(`  [wuthering.gg] icon: ${candidate.name} -> ${rel(savedPath)}`)
      downloaded++
    }
    catch (error) {
      console.log(`  [wuthering.gg] icon: error descargando ${candidate.url} (${error.message})`)
      failed++
    }
  }

  return {
    entity: "echoes",
    downloaded,
    skipped,
    failed,
  }
}

async function tryDownloadCharacterAsset(character, item) {
  if (item.kind === "icon" || item.kind === "portrait") {
    const kuroStatus = await tryDownloadCharacterAssetFromKuro(character, item)
    if (kuroStatus) {
      return kuroStatus
    }
  }

  for (const candidate of item.candidates) {
    for (const ext of ["png", "webp"]) {
      const url = await fandomFileUrl(`${candidate}.${ext}`)
      if (!url) {
        continue
      }

      try {
        const buffer = await fetchBuffer(url, WEB_HEADERS)
        const savedPath = await saveAssetBuffer(buffer, url, item.targetWebp)
        console.log(`  [fandom] ${item.kind}: ${candidate}.${ext} -> ${rel(savedPath)}`)
        return "downloaded"
      }
      catch (error) {
        console.log(`  [fandom] ${item.kind}: error descargando ${url} (${error.message})`)
      }
    }
  }

  if (ARGS.includeFallback) {
    for (const url of await wutheringGgCharacterCandidates(character, item.kind)) {
      try {
        const buffer = await fetchBuffer(url, WEB_HEADERS)
        const savedPath = await saveAssetBuffer(buffer, url, item.targetWebp)
        console.log(`  [wuthering.gg] ${item.kind}: ${url} -> ${rel(savedPath)}`)
        return "downloaded"
      }
      catch (error) {
        if (!error.message.includes("HTTP 404")) {
          console.log(`  [wuthering.gg] ${item.kind}: error en ${url} (${error.message})`)
        }
      }
    }
  }

  console.log(`  [MISS] ${item.kind}: no se encontro ninguno de [${item.candidates.join(", ")}].`)
  return "failed"
}

async function tryDownloadCharacterAssetFromKuro(character, item) {
  const roleGbId = KURO_ROLE_ID[character.id]
  if (!roleGbId) {
    return null
  }

  const kuroCharacter = await getKuroCharacter(roleGbId)
  if (!kuroCharacter) {
    return null
  }

  const url = item.kind === "icon"
    ? kuroCharacter.cardPictureUrl
    : kuroCharacter.illustrationPictureUrl

  if (!url) {
    return null
  }

  try {
    const buffer = await fetchBuffer(url, GUIDE_HEADERS)
    const savedPath = await saveAssetBuffer(buffer, url, item.targetWebp)
    console.log(`  [kuro] ${item.kind}: ${kuroCharacter.name} -> ${rel(savedPath)}`)
    return "downloaded"
  }
  catch (error) {
    console.log(`  [kuro] ${item.kind}: error descargando ${url} (${error.message})`)
    return null
  }
}

async function getKuroCharacter(roleGbId) {
  if (!kuroCharactersCache) {
    kuroCharactersCache = fetchKuroCharacters()
  }

  const index = await kuroCharactersCache
  return index.get(roleGbId) ?? null
}

async function fetchKuroCharacters() {
  const url = `${KURO_API_BASE}/role/avatar/list`
  const response = await fetch(url, { headers: GUIDE_HEADERS })
  if (!response.ok) {
    throw new Error(`Kuro API devolvio HTTP ${response.status}`)
  }

  const json = await response.json()
  const map = new Map()

  for (const item of json.data ?? []) {
    const name = item.texts?.find(text => text.language === "en")?.name
      ?? item.texts?.[0]?.name
      ?? item.roleGbId

    map.set(item.roleGbId, {
      roleGbId: item.roleGbId,
      name,
      cardPictureUrl: item.cardPictureUrl,
      illustrationPictureUrl: item.illustrationPictureUrl,
    })
  }

  return map
}

async function getWutheringGgCharacters() {
  if (!wutheringGgCharactersCache) {
    wutheringGgCharactersCache = fetchWutheringGgCharacters()
  }
  return wutheringGgCharactersCache
}

async function fetchWutheringGgCharacters() {
  const moduleUrl = await getWutheringGgCharactersModuleUrl()
  const source = await fetchText(moduleUrl, WEB_HEADERS)
  const module = await import(`data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`)
  const byId = new Map()
  const byName = new Map()

  for (const item of module.default ?? []) {
    if (!item || typeof item !== "object") {
      continue
    }

    if (typeof item.Id === "number") {
      byId.set(item.Id, item)
    }

    const name = item.NameEn ?? item.Name
    if (name) {
      byName.set(normalizeName(name), item)
    }
  }

  return {
    byId,
    byName,
  }
}

async function getWutheringGgCharactersModuleUrl() {
  if (!wutheringGgCharactersModuleUrlCache) {
    wutheringGgCharactersModuleUrlCache = discoverWutheringGgCharactersModuleUrl()
  }
  return wutheringGgCharactersModuleUrlCache
}

async function discoverWutheringGgCharactersModuleUrl() {
  const html = await fetchText("https://wuthering.gg/characters/lynae", WEB_HEADERS)
  const marker = "../data/en/characters.json"
  const bundleRefs = [...new Set([...html.matchAll(/\/_nuxt\/[^"']+\.js/g)].map(match => match[0]))]

  for (const ref of bundleRefs) {
    const bundleUrl = new URL(ref, "https://wuthering.gg").toString()

    try {
      const source = await fetchText(bundleUrl, WEB_HEADERS)
      if (!source.includes(marker)) {
        continue
      }

      const moduleRef = extractWutheringGgDataModuleRef(source, marker)
      if (moduleRef) {
        return new URL(moduleRef, bundleUrl).toString()
      }
    }
    catch {
      // Seguimos con el siguiente bundle.
    }
  }

  throw new Error("No se pudo descubrir el modulo de characters.json de wuthering.gg.")
}

function extractWutheringGgDataModuleRef(source, marker) {
  const escaped = escapeRegex(marker)
  const regex = new RegExp(`${escaped}\":\\(\\)=>t\\(\\(\\)=>import\\(\"([^\"]+)\"\\)`)
  return source.match(regex)?.[1] ?? null
}

async function getWutheringGgWeapons() {
  if (!wutheringGgWeaponsCache) {
    wutheringGgWeaponsCache = fetchWutheringGgWeapons()
  }
  return wutheringGgWeaponsCache
}

async function fetchWutheringGgWeapons() {
  const html = await fetchText("https://wuthering.gg/weapons", WEB_HEADERS)
  const byGameId = new Map()
  const byName = new Map()
  const regex = /<a href="\/weapons\/[^"]+" class="weapon[^"]*">[\s\S]*?<img[^>]+src="([^"]*T_IconWeapon(\d+)_UI\.png)"[^>]+alt="([^"]+)"[\s\S]*?<div class="name">([^<]+)<\/div>/g

  let match
  while ((match = regex.exec(html)) !== null) {
    const gameId = Number(match[2])
    const name = decodeHtml(match[4] || match[3])
    const url = resolveWutheringGgImageUrl(match[1])
    if (!gameId || !url) {
      continue
    }

    const candidate = { gameId, name, url }
    byGameId.set(gameId, candidate)
    byName.set(normalizeName(name), candidate)
  }

  return {
    byGameId,
    byName,
  }
}

async function getWutheringGgEchoes() {
  if (!wutheringGgEchoesCache) {
    wutheringGgEchoesCache = fetchWutheringGgEchoes()
  }
  return wutheringGgEchoesCache
}

async function fetchWutheringGgEchoes() {
  const html = await fetchText("https://wuthering.gg/echos", WEB_HEADERS)
  const map = new Map()
  const regex = /<a href="\/echos\/[^"]+" class="[^"]*">[\s\S]*?<img[^>]+src="([^"]*T_IconMonsterGoods160_[^"]+\.png)"[^>]+alt="([^"]+)"[\s\S]*?<div class="name">([^<]+)<\/div>/g

  let match
  while ((match = regex.exec(html)) !== null) {
    const name = decodeHtml(match[3] || match[2])
    const url = resolveWutheringGgImageUrl(match[1])
    if (!name || !url) {
      continue
    }

    map.set(normalizeName(name), { name, url })
  }

  return map
}

async function fandomFileUrl(filename) {
  const url = `https://wutheringwaves.fandom.com/api.php?action=query&titles=${encodeURIComponent(`File:${filename}`)}&prop=imageinfo&iiprop=url&format=json&origin=*`

  try {
    const response = await fetch(url, { headers: WEB_HEADERS })
    if (!response.ok) {
      return null
    }

    const json = await response.json()
    const pages = json?.query?.pages
    if (!pages) {
      return null
    }

    const page = Object.values(pages)[0]
    if (!page || page.missing !== undefined) {
      return null
    }

    return page.imageinfo?.[0]?.url ?? null
  }
  catch {
    return null
  }
}

async function wutheringGgCharacterCandidates(character, kind) {
  const dataCandidates = await getWutheringGgCharacterDataCandidates(character, kind)
  if (dataCandidates.length) {
    return dataCandidates
  }

  return legacyWutheringGgCharacterCandidates(character, kind)
}

async function getWutheringGgCharacterDataCandidates(character, kind) {
  const data = await getWutheringGgCharacterData(character)
  if (!data) {
    return []
  }

  const skills = Array.isArray(data.Skills) ? data.Skills : []
  const sequences = Array.isArray(data.ResonantChainGroup) ? data.ResonantChainGroup : []
  const skill = getWutheringGgSkillForKind(skills, kind)

  if (kind === "portrait" && data.FormationRoleCard) {
    return [`https://wuthering.gg/images/iconrolepile/${data.FormationRoleCard}`]
  }

  if (kind.startsWith("seq")) {
    const index = Number(kind.replace("seq", "")) - 1
    const sequence = sequences[index]
    return sequence?.NodeIcon
      ? [`https://wuthering.gg/images/icondevice/${sequence.NodeIcon}`]
      : []
  }

  return skill?.Icon
    ? [`https://wuthering.gg/images/iconskill/${skill.Icon}`]
    : []
}

async function getWutheringGgCharacterData(character) {
  const officialId = Number(KURO_ROLE_ID[character.id] ?? character.id)
  const index = await getWutheringGgCharacters()

  return index.byId.get(officialId)
    ?? index.byName.get(normalizeName(character.name))
    ?? null
}

function getWutheringGgSkillForKind(skills, kind) {
  switch (kind) {
    case "forte":
      return skills.find(skill => skill.SkillType === 6 || skill.TypeName === "Forte Circuit") ?? null
    case "intro":
      return skills.find(skill => skill.SkillType === 5 || skill.TypeName === "Intro Skill") ?? null
    case "outro":
      return skills.find(skill => skill.TypeName === "Outro Skill" || skill.SkillType === 11) ?? null
    case "liberation":
      return skills.find(skill => skill.SkillType === 3 || skill.TypeName === "Resonance Liberation") ?? null
    case "skill":
      return skills.find(skill => skill.SkillType === 2 || skill.TypeName === "Resonance Skill") ?? null
    case "inherent1":
      return skills.filter(skill => skill.SkillType === 4).at(0) ?? null
    case "inherent2":
      return skills.filter(skill => skill.SkillType === 4).at(1) ?? null
    default:
      return null
  }
}

function legacyWutheringGgCharacterCandidates(character, kind) {
  const gg = GG_INTERNAL[character.id]
  if (!gg) {
    return []
  }

  const { pile, device } = gg
  const base = "https://wuthering.gg/images"

  switch (kind) {
    case "portrait":
      return [`${base}/iconrolepile/T_IconRole_Pile_${pile}_UI.png`]
    case "seq1":
    case "seq2":
    case "seq3":
    case "seq4":
    case "seq5":
    case "seq6": {
      const sequence = kind.replace("seq", "")
      return [`${base}/icondevice/T_IconDevice_${device}M${sequence}_UI.png`]
    }
    case "liberation":
      return [`${base}/iconskill/SP_Icon${device}Y.png`]
    case "intro":
      return [`${base}/iconskill/SP_Icon${device}QTE.png`]
    case "forte":
      return [`${base}/iconskill/SP_Icon${device}T.png`]
    case "skill":
      return ["B1", "B2", "B3"].map(suffix => `${base}/iconskill/SP_Icon${device}${suffix}.png`)
    case "inherent1":
      return [`${base}/iconskill/SP_Icon${device}D1.png`, `${base}/iconskill/SP_Icon${device}1D1.png`]
    case "inherent2":
      return [`${base}/iconskill/SP_Icon${device}D2.png`, `${base}/iconskill/SP_Icon${device}2D2.png`]
    default:
      return []
  }
}

async function parseCharacters(filePath) {
  const sourceFile = await parseTypeScriptFile(filePath)
  const characters = []

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || !hasExportModifier(statement)) {
      continue
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
        continue
      }

      const id = getNumberProperty(declaration.initializer, "Id")
      const icon = getStringProperty(declaration.initializer, "Icon")
      if (!id || !icon) {
        continue
      }

      characters.push({
        id,
        icon,
        name: icon.replace(/_Icon\.webp$/, ""),
      })
    }
  }

  characters.sort((left, right) => left.id - right.id)
  return characters
}

async function parseWeapons(filePath) {
  const sourceFile = await parseTypeScriptFile(filePath)
  const array = getExportedArrayLiteral(sourceFile, "Weapons")
  if (!array) {
    fail("No se pudo encontrar el array exportado Weapons.")
  }

  const weapons = []
  for (const element of array.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      continue
    }

    const gameId = getNumberProperty(element, "GameId")
    const name = getStringProperty(element, "Name")
    if (!gameId || !name) {
      continue
    }

    weapons.push({ gameId, name })
  }

  weapons.sort((left, right) => left.gameId - right.gameId)
  return weapons
}

async function parseEchoes(filePath) {
  const sourceFile = await parseTypeScriptFile(filePath)
  const array = getExportedArrayLiteral(sourceFile, "Echoes")
  if (!array) {
    fail("No se pudo encontrar el array exportado Echoes.")
  }

  const echoes = []
  for (const element of array.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      continue
    }

    const gameId = getNumberProperty(element, "GameId")
    const icon = getStringProperty(element, "Icon")
    if (!gameId || !icon) {
      continue
    }

    echoes.push({
      gameId,
      icon,
      displayName: icon.replace(/_Icon\.webp$/, "").replace(/_/g, " "),
    })
  }

  echoes.sort((left, right) => left.gameId - right.gameId)
  return echoes
}

async function parseTypeScriptFile(filePath) {
  const source = await readFile(filePath, "utf8")
  return ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
}

function getExportedArrayLiteral(sourceFile, exportName) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || !hasExportModifier(statement)) {
      continue
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== exportName) {
        continue
      }

      if (declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
        return declaration.initializer
      }
    }
  }

  return null
}

function hasExportModifier(statement) {
  return statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false
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
  if (!property || !ts.isPropertyAssignment(property)) {
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
  if (!property || !ts.isPropertyAssignment(property)) {
    return null
  }

  const initializer = property.initializer
  if (ts.isNumericLiteral(initializer)) {
    return Number(initializer.text)
  }

  if (initializer.kind === ts.SyntaxKind.PrefixUnaryExpression) {
    const text = initializer.getText()
    const value = Number(text)
    return Number.isFinite(value) ? value : null
  }

  return null
}

async function fetchText(url, headers) {
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.text()
}

async function fetchBuffer(url, headers) {
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function saveAssetBuffer(buffer, sourceUrl, targetWebp) {
  const sourceExtension = guessExtFromUrl(sourceUrl)

  if (sourceExtension === "webp") {
    await writeFile(targetWebp, buffer)
    return targetWebp
  }

  if (sharp) {
    const converted = await sharp(buffer).webp({ quality: 92 }).toBuffer()
    await writeFile(targetWebp, converted)
    return targetWebp
  }

  const fallbackTarget = targetWebp.replace(/\.webp$/i, `.${sourceExtension}`)
  await writeFile(fallbackTarget, buffer)
  usedSourceExtensionFallback = true
  return fallbackTarget
}

function resolveWutheringGgImageUrl(rawUrl) {
  const decoded = decodeHtml(rawUrl).trim().split(/\s+/)[0]
  if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
    return decoded
  }

  return new URL(decoded, "https://wuthering.gg").toString()
}

function decodeHtml(value) {
  return value
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function normalizeName(value) {
  return decodeHtml(value)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

function getWeaponCandidate(index, weapon) {
  return index.byGameId.get(weapon.gameId)
    ?? index.byName.get(normalizeName(weapon.name))
    ?? null
}

async function getWeaponDetailCandidate(weapon) {
  for (const slug of weaponSlugCandidates(weapon.name)) {
    const url = `https://wuthering.gg/weapons/${slug}`

    try {
      const html = await fetchText(url, WEB_HEADERS)
      const match = html.match(/(?:srcset|src)="([^"]*T_IconWeapon[^"]+\.png[^"]*)"/)
      if (!match) {
        continue
      }

      return {
        gameId: weapon.gameId,
        name: weapon.name,
        url: resolveWutheringGgImageUrl(match[1]),
      }
    }
    catch (error) {
      if (!error.message.includes("HTTP 404")) {
        console.log(`  [wuthering.gg] icon: error cargando detalle ${url} (${error.message})`)
      }
    }
  }

  return null
}

function weaponSlugCandidates(name) {
  const base = name
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .trim()

  const encodedAmpersand = base
    .replace(/\s*&\s*/g, "-%26-")
    .replace(/[^a-z0-9%]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

  const plain = base
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

  const withAnd = base
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

  return [...new Set([encodedAmpersand, plain, withAnd].filter(Boolean))]
}

async function exists(filePath) {
  try {
    await access(filePath, FS.F_OK)
    return true
  }
  catch {
    return false
  }
}

function rel(filePath) {
  return filePath.replace(REPO_ROOT, "").replace(/\\/g, "/")
}

function guessExtFromUrl(url) {
  const match = url.toLowerCase().match(/\.([a-z0-9]{2,5})(?:\?|$)/)
  return match ? match[1] : "png"
}

function parseArgs(argv) {
  const args = {
    ids: [],
    only: [],
    dryRun: false,
    includeFallback: false,
    entities: ["characters"],
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === "--id") {
      args.ids.push(Number(argv[++i]))
    }
    else if (arg === "--only") {
      args.only.push(...String(argv[++i]).split(",").map(value => value.trim()).filter(Boolean))
    }
    else if (arg === "--entity" || arg === "--entities") {
      args.entities = String(argv[++i]).split(",").map(value => value.trim()).filter(Boolean)
    }
    else if (arg === "--dry-run") {
      args.dryRun = true
    }
    else if (arg === "--include-fallback") {
      args.includeFallback = true
    }
    else if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    }
    else {
      fail(`Argumento desconocido: ${arg}`)
    }
  }

  if (args.entities.includes("all")) {
    args.entities = [...VALID_ENTITIES]
  }

  const unknownEntities = args.entities.filter(entity => !VALID_ENTITIES.includes(entity))
  if (unknownEntities.length) {
    fail(`Entidades desconocidas en --entity: ${unknownEntities.join(", ")}. Validas: ${VALID_ENTITIES.join(", ")}, all`)
  }

  return args
}

function printHelp() {
  console.log(`Uso: node scripts/fetch-character-images.mjs [opciones]

Opciones:
  --entity <entidades>   CSV: characters, weapons, echoes, all
  --id <id>              Filtra por IDs/GameIds de las entidades seleccionadas (repetible)
  --only <kinds>         CSV de tipos a descargar para personajes: ${Object.keys(ASSET_KINDS).join(", ")}
  --dry-run              Reporta faltantes sin descargar
  --include-fallback     Intenta wuthering.gg para assets de personajes cuando Fandom no tenga el archivo
  -h, --help             Imprime esta ayuda
`)
}

function fail(message) {
  console.error(`error: ${message}`)
  process.exit(1)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
