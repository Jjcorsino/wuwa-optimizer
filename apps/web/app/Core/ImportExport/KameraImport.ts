import { EchoCost } from '../Enums/EchoCost'
import { Rarity } from '../Enums/Rarity'
import { StatType } from '../Enums/StatType'
import { TemplateEchoes } from '../Echoes'
import { TemplateSonatas } from '../Sonatas'
import {
  WUWA_OPTIMIZER_EXPORT_FORMAT,
  WUWA_OPTIMIZER_EXPORT_SCHEMA_VERSION,
  type EquippedLoadout,
  type ExportCharacter,
  type ExportEcho,
  type ExportStat,
  type ExportWeapon,
  type WuwaOptimizerExport,
} from './WuwaOptimizerExport'

// ─── Kamera JSON types ────────────────────────────────────────────────────────

export interface KameraSkills {
  Basic_Attack?: number
  Resonance_Skill?: number
  Forte_Circuit?: number
  Resonance_Liberation?: number
  Intro_Skill?: number
  Inherent_Skill_01?: boolean
  Inherent_Skill_02?: boolean
}

export interface KameraWeaponEntry {
  id: number
  level: number
  ascension: number
  rank: number
}

export interface KameraEchoData {
  level: number
  tuneLv: number
  sonata: string
  rarity: number
  stats: {
    main: Record<string, number>
    sub: Record<string, number>
  }
}

export interface KameraCharacterEntry {
  level: number
  ascension: number
  weapon?: KameraWeaponEntry
  echoes: Record<string, KameraEchoData>
  skills: KameraSkills
  chain: number
}

export type KameraCharactersJson = Record<string, KameraCharacterEntry>
export type KameraEchoesJson = Array<Record<string, KameraEchoData>>

// ─── Mappings ─────────────────────────────────────────────────────────────────

const STAT_MAP: Record<string, StatType> = {
  'hp': StatType.HP,
  'hp%': StatType.HP_PERCENTAGE,
  'atk': StatType.ATTACK,
  'atk%': StatType.ATTACK_PERCENTAGE,
  'def': StatType.DEF,
  'def%': StatType.DEF_PERCENTAGE,
  'cr%': StatType.CRIT_RATE,
  'cd%': StatType.CRIT_DMG,
  'er%': StatType.ENERGY_REGENERATION,
  'healingBonus%': StatType.HEALING_BONUS,
  'basicAttack%': StatType.BASIC_ATTACK_DMG_AMPLIFICATION,
  'heavyAttack%': StatType.HEAVY_ATTACK_DMG_AMPLIFICATION,
  'resonanceLiberation%': StatType.RESONANCE_LIBERATION_DMG_AMPLIFICATION,
  'resonanceSkill%': StatType.RESONANCE_SKILL_DMG_AMPLIFICATION,
  'aero%': StatType.AERO_DMG_BONUS,
  'electro%': StatType.ELECTRO_DMG_BONUS,
  'fusion%': StatType.FUSION_DMG_BONUS,
  'glacio%': StatType.GLACIO_DMG_BONUS,
  'havoc%': StatType.HAVOC_DMG_BONUS,
  'spectro%': StatType.SPECTRO_DMG_BONUS,
}

const RARITY_MAP: Record<number, Rarity> = {
  1: Rarity.ONE_STAR,
  2: Rarity.TWO_STARS,
  3: Rarity.THREE_STARS,
  4: Rarity.FOUR_STARS,
  5: Rarity.FIVE_STARS,
}

// The secondary stat key inside Kamera's `stats.main` object, per echo cost
const SECONDARY_KEY_BY_COST: Record<EchoCost, string> = {
  [EchoCost.FOUR_COST]: 'atk',
  [EchoCost.THREE_COST]: 'atk',
  [EchoCost.ONE_COST]: 'hp',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapStat(key: string): StatType | undefined {
  return STAT_MAP[key]
}

function mapRarity(n: number): Rarity {
  return RARITY_MAP[n] ?? Rarity.FIVE_STARS
}

// Kamera concatenates sonata names (e.g. "havoceclipse"). Match against our
// sonata list by stripping spaces and lowercasing both sides.
function mapSonataName(kameraName: string): string {
  const normalized = kameraName.trim().toLowerCase().replace(/\s+/g, '')
  const match = TemplateSonatas.find(
    s => s.Name.toLowerCase().replace(/\s+/g, '') === normalized,
  )
  return match?.Name ?? kameraName
}

let _echoIdCounter = 0
function generateEchoId(gameId: number): string {
  return `kamera-${gameId}-${++_echoIdCounter}-${Math.random().toString(36).slice(2, 7)}`
}

function generateWeaponId(gameId: number, suffix: string): string {
  return `kamera-w-${gameId}-${suffix}`
}

// ─── Echo converter ───────────────────────────────────────────────────────────

function convertEcho(
  echoIdStr: string,
  echoData: KameraEchoData,
  equippedBy?: number,
): ExportEcho | null {
  const gameId = Number.parseInt(echoIdStr, 10)
  if (!Number.isFinite(gameId)) return null

  const template = TemplateEchoes.find(e => e.GameId === gameId)
  if (!template) return null

  const cost = template.Cost
  const secondaryKey = SECONDARY_KEY_BY_COST[cost]

  let mainStat: ExportStat | undefined
  let secondaryStat: ExportStat | undefined

  for (const [key, value] of Object.entries(echoData.stats.main)) {
    const type = mapStat(key)
    if (!type) continue
    if (key === secondaryKey && secondaryStat === undefined) {
      secondaryStat = { type, value }
    }
    else if (mainStat === undefined) {
      mainStat = { type, value }
    }
  }

  const subStats: ExportStat[] = Object.entries(echoData.stats.sub)
    .map(([key, value]) => {
      const type = mapStat(key)
      return type ? ({ type, value } satisfies ExportStat) : null
    })
    .filter((s): s is ExportStat => s !== null)
    .slice(0, 5)

  return {
    id: generateEchoId(gameId),
    gameId,
    level: echoData.level,
    rarity: mapRarity(echoData.rarity),
    cost,
    sonataName: mapSonataName(echoData.sonata),
    mainStat,
    secondaryStat,
    subStats,
    locked: false,
    equippedBy,
  }
}

// ─── Character converter ──────────────────────────────────────────────────────

function convertSkills(kameraSkills: KameraSkills): ExportCharacter['skills'] {
  return {
    basicAttack: typeof kameraSkills.Basic_Attack === 'number' ? kameraSkills.Basic_Attack : undefined,
    resonanceSkill: typeof kameraSkills.Resonance_Skill === 'number' ? kameraSkills.Resonance_Skill : undefined,
    forteCircuit: typeof kameraSkills.Forte_Circuit === 'number' ? kameraSkills.Forte_Circuit : undefined,
    resonanceLiberation: typeof kameraSkills.Resonance_Liberation === 'number' ? kameraSkills.Resonance_Liberation : undefined,
    introSkill: typeof kameraSkills.Intro_Skill === 'number' ? kameraSkills.Intro_Skill : undefined,
    inherentSkill1: typeof kameraSkills.Inherent_Skill_01 === 'boolean' ? kameraSkills.Inherent_Skill_01 : undefined,
    inherentSkill2: typeof kameraSkills.Inherent_Skill_02 === 'boolean' ? kameraSkills.Inherent_Skill_02 : undefined,
  }
}

// ─── Main conversion ──────────────────────────────────────────────────────────

export interface KameraConversionResult {
  export: WuwaOptimizerExport
  skippedEchoes: number
  skippedCharacters: number
}

export function ConvertKameraToWuwaOptimizerExport(
  characters?: KameraCharactersJson,
  globalEchoes?: KameraEchoesJson,
): KameraConversionResult {
  const exportCharacters: ExportCharacter[] = []
  const exportWeapons: ExportWeapon[] = []
  const exportEchoes: ExportEcho[] = []
  const equipped: EquippedLoadout[] = []
  let skippedEchoes = 0
  let skippedCharacters = 0

  const seenWeaponIds = new Set<string>()

  if (characters) {
    for (const [charIdStr, charData] of Object.entries(characters)) {
      const characterId = Number.parseInt(charIdStr, 10)
      if (!Number.isFinite(characterId)) {
        skippedCharacters++
        continue
      }

      exportCharacters.push({
        id: characterId,
        level: charData.level,
        ascension: charData.ascension,
        sequence: charData.chain,
        skills: convertSkills(charData.skills),
      })

      // Equipped weapon
      let weaponInventoryId: string | undefined
      if (charData.weapon) {
        weaponInventoryId = generateWeaponId(charData.weapon.id, charIdStr)
        if (!seenWeaponIds.has(weaponInventoryId)) {
          seenWeaponIds.add(weaponInventoryId)
          exportWeapons.push({
            id: weaponInventoryId,
            gameId: charData.weapon.id,
            level: charData.weapon.level,
            ascension: charData.weapon.ascension,
            rank: charData.weapon.rank,
            locked: false,
          })
        }
      }

      // Echoes equipped on this character
      const charEchoIds: string[] = []
      for (const [echoId, echoData] of Object.entries(charData.echoes)) {
        const echo = convertEcho(echoId, echoData, characterId)
        if (echo) {
          exportEchoes.push(echo)
          charEchoIds.push(echo.id)
        }
        else {
          skippedEchoes++
        }
      }

      if (weaponInventoryId !== undefined || charEchoIds.length > 0) {
        equipped.push({
          characterId,
          weaponId: weaponInventoryId,
          echoIds: charEchoIds.slice(0, 5),
        })
      }
    }
  }

  // Global echo inventory (unequipped echoes from echoes.json)
  if (globalEchoes) {
    for (const echoObj of globalEchoes) {
      for (const [echoId, echoData] of Object.entries(echoObj)) {
        const echo = convertEcho(echoId, echoData)
        if (echo) {
          exportEchoes.push(echo)
        }
        else {
          skippedEchoes++
        }
      }
    }
  }

  return {
    export: {
      format: WUWA_OPTIMIZER_EXPORT_FORMAT,
      schemaVersion: WUWA_OPTIMIZER_EXPORT_SCHEMA_VERSION,
      gameVersion: 'unknown',
      metadata: {
        exportedAt: new Date().toISOString(),
        source: {
          type: 'wuwa_inventory_kamera',
          name: 'WuWa Inventory Kamera',
        },
        issues: [],
      },
      characters: exportCharacters,
      weapons: exportWeapons,
      echoes: exportEchoes,
      equipped,
    },
    skippedEchoes,
    skippedCharacters,
  }
}
