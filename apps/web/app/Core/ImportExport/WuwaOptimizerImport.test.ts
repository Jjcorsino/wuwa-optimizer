import { describe, expect, it } from "vitest"
import { EchoCost } from "../Enums/EchoCost"
import { Rarity } from "../Enums/Rarity"
import { StatType } from "../Enums/StatType"
import { WeaponType } from "../Enums/WeaponType"
import {
  ParseWuwaOptimizerExport,
  WUWA_OPTIMIZER_EXPORT_FORMAT,
  WUWA_OPTIMIZER_EXPORT_SCHEMA_VERSION,
} from "./WuwaOptimizerExport"
import {
  CreateWuwaOptimizerImportPlan,
  CreateWuwaOptimizerImportPreview,
} from "./WuwaOptimizerImport"

function createValidExport() {
  return {
    format: WUWA_OPTIMIZER_EXPORT_FORMAT,
    schemaVersion: WUWA_OPTIMIZER_EXPORT_SCHEMA_VERSION,
    gameVersion: "3.3",
    metadata: {
      exportedAt: "2026-05-01T00:00:00.000Z",
      source: {
        type: "manual",
      },
    },
    characters: [
      {
        id: 1102,
        level: 80,
        sequence: 2,
        skills: {
          basicAttack: 6,
          resonanceSkill: 8,
          inherentSkill1: true,
        },
      },
    ],
    weapons: [
      {
        id: "weapon-1",
        gameId: 21010011,
        type: WeaponType.BROADBLADE,
        level: 70,
        rank: 2,
      },
    ],
    echoes: [
      {
        id: "echo-1",
        gameId: 6000045,
        level: 25,
        rarity: Rarity.FIVE_STARS,
        cost: EchoCost.FOUR_COST,
        sonataName: "Celestial Light",
        mainStat: {
          type: StatType.CRIT_RATE,
          value: 22,
        },
        secondaryStat: {
          type: StatType.ATTACK,
          value: 150,
        },
        subStats: [
          {
            type: StatType.CRIT_DMG,
            value: 21,
          },
        ],
        equippedBy: 1102,
      },
    ],
    equipped: [
      {
        characterId: 1102,
        weaponId: "weapon-1",
        echoIds: ["echo-1"],
      },
    ],
  }
}

describe("wuwa optimizer import", () => {
  it("creates a clean preview for known local content", () => {
    const parsed = ParseWuwaOptimizerExport(createValidExport())
    const preview = CreateWuwaOptimizerImportPreview(parsed)

    expect(preview.canImport).toBe(true)
    expect(preview.counts).toEqual({
      characters: 1,
      weapons: 1,
      echoes: 1,
      equipped: 1,
    })
    expect(preview.issues).toEqual([])
  })

  it("blocks imports with content missing from local game data", () => {
    const payload = createValidExport()
    payload.echoes[0]!.gameId = 999999

    const parsed = ParseWuwaOptimizerExport(payload)
    const preview = CreateWuwaOptimizerImportPreview(parsed)

    expect(preview.canImport).toBe(false)
    expect(preview.issues.some(issue => issue.code === "UNKNOWN_ECHO")).toBe(true)
    expect(() => CreateWuwaOptimizerImportPlan(parsed)).toThrow("Cannot create import plan")
  })

  it("maps export data into store-shaped import payloads", () => {
    const parsed = ParseWuwaOptimizerExport(createValidExport())
    const plan = CreateWuwaOptimizerImportPlan(parsed)

    expect(plan.characters[0]?.Level).toBe(80)
    expect(plan.characters[0]?.Sequences[0]?.Unlocked).toBe(true)
    expect(plan.characters[0]?.Sequences[1]?.Unlocked).toBe(true)
    expect(plan.characters[0]?.Sequences[2]?.Unlocked).toBe(false)
    expect(plan.characters[0]?.Skills.find(skill => skill.Id === "Basic_Attack")?.Level).toBe(6)
    expect(plan.characters[0]?.Skills.find(skill => skill.Id === "Resonance_Skill")?.Level).toBe(8)
    expect(plan.characters[0]?.Skills.find(skill => skill.Id === "Inherent_Skill_01")?.Unlocked).toBe(true)

    expect(plan.weapons[0]).toEqual({
      Id: "weapon-1",
      GameId: 21010011,
      Level: 70,
      Rank: 2,
    })

    expect(plan.echoes[0]?.Id).toBe("echo-1")
    expect(plan.echoes[0]?.MainStatistic).toEqual({ Type: StatType.CRIT_RATE, Value: 22 })
    expect(plan.echoes[0]?.Statistics).toEqual([{ Type: StatType.CRIT_DMG, Value: 21 }])
    expect(plan.echoes[0]?.Sonata.some(sonata => sonata.Name === "Celestial Light" && sonata.IsSelected)).toBe(true)
    expect(plan.loadouts[0]).toEqual({
      characterId: 1102,
      weaponId: "weapon-1",
      echoIds: ["echo-1"],
      name: "Imported Build",
    })
  })
})
