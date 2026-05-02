import type { PartialCharacter } from "../Interfaces/Character"
import type Echo from "../Interfaces/Echo"
import type Skill from "../Interfaces/Skill"
import type { PartialWeapon } from "../Interfaces/Weapon"
import type { ImportIssueSeverity, WuwaOptimizerExport } from "./WuwaOptimizerExport"
import { BaseCharacters } from "../Characters"
import { TemplateEchoes } from "../Echoes"
import { TemplateSonatas } from "../Sonatas"
import { BaseWeapons } from "../Weapons"

export interface WuwaOptimizerImportPreviewIssue {
  severity: ImportIssueSeverity
  code: string
  message: string
  path?: string
}

export interface WuwaOptimizerImportPreview {
  gameVersion: string
  sourceType: WuwaOptimizerExport["metadata"]["source"]["type"]
  counts: {
    characters: number
    weapons: number
    echoes: number
    equipped: number
  }
  issues: WuwaOptimizerImportPreviewIssue[]
  canImport: boolean
}

export interface WuwaOptimizerImportLoadout {
  characterId: number
  weaponId?: string
  echoIds: string[]
  name: string
}

export interface WuwaOptimizerImportPlan {
  characters: PartialCharacter[]
  weapons: PartialWeapon[]
  echoes: Echo[]
  loadouts: WuwaOptimizerImportLoadout[]
}

const SkillIdByExportKey: Record<keyof WuwaOptimizerExport["characters"][number]["skills"], string> = {
  basicAttack: "Basic_Attack",
  resonanceSkill: "Resonance_Skill",
  forteCircuit: "Forte_Circuit",
  resonanceLiberation: "Resonance_Liberation",
  introSkill: "Intro_Skill",
  inherentSkill1: "Inherent_Skill_01",
  inherentSkill2: "Inherent_Skill_02",
}

export function CreateWuwaOptimizerImportPreview(data: WuwaOptimizerExport): WuwaOptimizerImportPreview {
  const issues: WuwaOptimizerImportPreviewIssue[] = []
  const characterIds = new Set(data.characters.map(character => character.id))
  const weaponIds = new Set(data.weapons.map(weapon => weapon.id))
  const echoIds = new Set(data.echoes.map(echo => echo.id))

  addDuplicateIssues(issues, data.characters.map(character => String(character.id)), "DUPLICATE_CHARACTER", "characters")
  addDuplicateIssues(issues, data.weapons.map(weapon => weapon.id), "DUPLICATE_WEAPON", "weapons")
  addDuplicateIssues(issues, data.echoes.map(echo => echo.id), "DUPLICATE_ECHO", "echoes")

  data.metadata.issues.forEach((issue, index) => {
    issues.push({
      severity: issue.severity,
      code: issue.code,
      message: issue.message,
      path: issue.path ?? `metadata.issues[${index}]`,
    })
  })

  if (data.metadata.confidence !== undefined && data.metadata.confidence < 0.8) {
    issues.push({
      severity: "warning",
      code: "LOW_EXPORT_CONFIDENCE",
      message: "Export confidence is below 80%. Review the preview before importing.",
      path: "metadata.confidence",
    })
  }

  data.characters.forEach((character, index) => {
    if (!BaseCharacters.some(baseCharacter => baseCharacter.Id === character.id)) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_CHARACTER",
        message: `Character ${character.id} is not available in local game data.`,
        path: `characters[${index}].id`,
      })
    }

    addImportInfoIssues(issues, character.importInfo, `characters[${index}].importInfo`)
  })

  data.weapons.forEach((weapon, index) => {
    if (!BaseWeapons.some(baseWeapon => baseWeapon.GameId === weapon.gameId)) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_WEAPON",
        message: `Weapon ${weapon.gameId} is not available in local game data.`,
        path: `weapons[${index}].gameId`,
      })
    }

    addImportInfoIssues(issues, weapon.importInfo, `weapons[${index}].importInfo`)
  })

  data.echoes.forEach((echo, index) => {
    const templateEcho = TemplateEchoes.find(baseEcho => baseEcho.GameId === echo.gameId)
    if (!templateEcho) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_ECHO",
        message: `Echo ${echo.gameId} is not available in local game data.`,
        path: `echoes[${index}].gameId`,
      })
    }

    if (!TemplateSonatas.some(sonata => sameName(sonata.Name, echo.sonataName))) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_SONATA",
        message: `Sonata "${echo.sonataName}" is not available in local game data.`,
        path: `echoes[${index}].sonataName`,
      })
    }

    if (echo.equippedBy !== undefined && !characterIds.has(echo.equippedBy)) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_ECHO_EQUIPPED_BY",
        message: `Echo ${echo.id} references missing character ${echo.equippedBy}.`,
        path: `echoes[${index}].equippedBy`,
      })
    }

    addImportInfoIssues(issues, echo.importInfo, `echoes[${index}].importInfo`)
  })

  data.equipped.forEach((loadout, index) => {
    if (!characterIds.has(loadout.characterId)) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_LOADOUT_CHARACTER",
        message: `Equipped loadout references missing character ${loadout.characterId}.`,
        path: `equipped[${index}].characterId`,
      })
    }

    if (loadout.weaponId !== undefined && !weaponIds.has(loadout.weaponId)) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_LOADOUT_WEAPON",
        message: `Equipped loadout references missing weapon ${loadout.weaponId}.`,
        path: `equipped[${index}].weaponId`,
      })
    }

    addDuplicateIssues(issues, loadout.echoIds, "DUPLICATE_LOADOUT_ECHO", `equipped[${index}].echoIds`)

    loadout.echoIds.forEach((echoId, echoIndex) => {
      if (!echoIds.has(echoId)) {
        issues.push({
          severity: "error",
          code: "UNKNOWN_LOADOUT_ECHO",
          message: `Equipped loadout references missing echo ${echoId}.`,
          path: `equipped[${index}].echoIds[${echoIndex}]`,
        })
      }
    })
  })

  return {
    gameVersion: data.gameVersion,
    sourceType: data.metadata.source.type,
    counts: {
      characters: data.characters.length,
      weapons: data.weapons.length,
      echoes: data.echoes.length,
      equipped: data.equipped.length,
    },
    issues,
    canImport: !issues.some(issue => issue.severity === "error"),
  }
}

export function CreateWuwaOptimizerImportPlan(data: WuwaOptimizerExport): WuwaOptimizerImportPlan {
  const preview = CreateWuwaOptimizerImportPreview(data)

  if (!preview.canImport) {
    throw new Error("Cannot create import plan for an export with blocking issues.")
  }

  return {
    characters: data.characters.map(character => toPartialCharacter(character)),
    weapons: data.weapons.map(weapon => ({
      Id: weapon.id,
      GameId: weapon.gameId,
      Level: weapon.level,
      Rank: weapon.rank,
    })),
    echoes: data.echoes.map(echo => toEcho(echo)),
    loadouts: data.equipped.map(loadout => ({
      characterId: loadout.characterId,
      weaponId: loadout.weaponId,
      echoIds: loadout.echoIds,
      name: "Imported Build",
    })),
  }
}

function toPartialCharacter(character: WuwaOptimizerExport["characters"][number]): PartialCharacter {
  const baseCharacter = BaseCharacters.find(base => base.Id === character.id)!

  return {
    Id: character.id,
    Level: character.level,
    Stats: [],
    Sequences: baseCharacter.BaseSequences.map((sequence, index) => ({
      ...sequence,
      Unlocked: index < character.sequence,
    })),
    Skills: baseCharacter.BaseSkills.map(skill => applyImportedSkill(skill, character.skills)),
    StatsWeights: {},
  }
}

function applyImportedSkill(
  skill: Skill,
  importedSkills: WuwaOptimizerExport["characters"][number]["skills"],
): Skill {
  const importKey = Object.entries(SkillIdByExportKey)
    .find(([, skillId]) => skillId === skill.Id)?.[0] as keyof typeof SkillIdByExportKey | undefined

  if (importKey === undefined) {
    return { ...skill }
  }

  const importedValue = importedSkills[importKey]

  if (typeof importedValue === "number") {
    return {
      ...skill,
      Level: importedValue,
    }
  }

  if (typeof importedValue === "boolean") {
    return {
      ...skill,
      Unlocked: importedValue,
    }
  }

  return { ...skill }
}

function toEcho(echo: WuwaOptimizerExport["echoes"][number]): Echo {
  const templateEcho = TemplateEchoes.find(baseEcho => baseEcho.GameId === echo.gameId)!

  return {
    ...templateEcho,
    Id: echo.id,
    GameId: echo.gameId,
    Rarity: echo.rarity,
    Cost: echo.cost,
    Level: echo.level,
    Sonata: TemplateSonatas
      .filter(sonata => templateEcho.Sonata.some(templateSonata => sameName(templateSonata.Name, sonata.Name)))
      .map(sonata => ({
        ...sonata,
        ExtraStats: sonata.ExtraStats?.map(stat => ({ ...stat })),
        IsSelected: sameName(sonata.Name, echo.sonataName),
      })),
    MainStatistic: echo.mainStat ? { Type: echo.mainStat.type, Value: echo.mainStat.value } : undefined,
    SecondaryStatistic: echo.secondaryStat ? { Type: echo.secondaryStat.type, Value: echo.secondaryStat.value } : undefined,
    Statistics: echo.subStats.map(stat => ({ Type: stat.type, Value: stat.value })),
    EquipedBy: echo.equippedBy,
  }
}

function addImportInfoIssues(
  issues: WuwaOptimizerImportPreviewIssue[],
  importInfo: WuwaOptimizerExport["characters"][number]["importInfo"],
  path: string,
) {
  if (!importInfo) {
    return
  }

  if (importInfo.confidence !== undefined && importInfo.confidence < 0.8) {
    issues.push({
      severity: "warning",
      code: "LOW_ITEM_CONFIDENCE",
      message: "Item confidence is below 80%. Review this item before importing.",
      path: `${path}.confidence`,
    })
  }

  importInfo.issues.forEach((issue, index) => {
    issues.push({
      severity: issue.severity,
      code: issue.code,
      message: issue.message,
      path: issue.path ?? `${path}.issues[${index}]`,
    })
  })
}

function addDuplicateIssues(
  issues: WuwaOptimizerImportPreviewIssue[],
  values: string[],
  code: string,
  path: string,
) {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  values.forEach((value) => {
    if (seen.has(value)) {
      duplicates.add(value)
    }

    seen.add(value)
  })

  duplicates.forEach((value) => {
    issues.push({
      severity: "error",
      code,
      message: `Duplicate value "${value}" found.`,
      path,
    })
  })
}

function sameName(left: string, right: string): boolean {
  return normalizeName(left) === normalizeName(right)
}

function normalizeName(value: string): string {
  return value.trim().toLocaleLowerCase("en-US")
}
