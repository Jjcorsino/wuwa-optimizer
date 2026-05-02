import { describe, expect, it } from "vitest"
import { EchoCost } from "../Enums/EchoCost"
import { Rarity } from "../Enums/Rarity"
import { StatType } from "../Enums/StatType"
import { WeaponType } from "../Enums/WeaponType"
import {
  ParseWuwaOptimizerExport,
  SafeParseWuwaOptimizerExport,
  WUWA_OPTIMIZER_EXPORT_FORMAT,
  WUWA_OPTIMIZER_EXPORT_SCHEMA_VERSION,
} from "./WuwaOptimizerExport"

function createValidExport() {
  return {
    format: WUWA_OPTIMIZER_EXPORT_FORMAT,
    schemaVersion: WUWA_OPTIMIZER_EXPORT_SCHEMA_VERSION,
    gameVersion: " 3.3 ",
    metadata: {
      exportedAt: "2026-05-01T00:00:00.000Z",
      source: {
        type: "manual",
        name: " unit-test ",
      },
    },
    characters: [
      {
        id: 1503,
        level: 90,
        sequence: 0,
        skills: {
          resonanceSkill: 10,
        },
      },
    ],
    weapons: [
      {
        id: " weapon-1 ",
        gameId: 21050015,
        type: WeaponType.RECTIFIER,
        level: 90,
        rank: 1,
      },
    ],
    echoes: [
      {
        id: " echo-1 ",
        gameId: 6000045,
        level: 25,
        rarity: Rarity.FIVE_STARS,
        cost: EchoCost.FOUR_COST,
        sonataName: " Celestial Light ",
        mainStat: {
          type: StatType.CRIT_RATE,
          value: 22,
        },
        secondaryStat: {
          type: StatType.ATTACK,
          value: 150,
        },
      },
    ],
    equipped: [
      {
        characterId: 1503,
        weaponId: " weapon-1 ",
        echoIds: [" echo-1 "],
      },
    ],
  }
}

describe("wuwa optimizer export schema", () => {
  it("parses a valid export and normalizes simple string fields", () => {
    const parsed = ParseWuwaOptimizerExport(createValidExport())

    expect(parsed.gameVersion).toBe("3.3")
    expect(parsed.metadata.source.name).toBe("unit-test")
    expect(parsed.metadata.issues).toEqual([])
    expect(parsed.weapons[0]?.id).toBe("weapon-1")
    expect(parsed.weapons[0]?.locked).toBe(false)
    expect(parsed.echoes[0]?.id).toBe("echo-1")
    expect(parsed.echoes[0]?.sonataName).toBe("Celestial Light")
    expect(parsed.echoes[0]?.subStats).toEqual([])
    expect(parsed.equipped[0]?.weaponId).toBe("weapon-1")
    expect(parsed.equipped[0]?.echoIds).toEqual(["echo-1"])
  })

  it("rejects unknown top-level fields", () => {
    const result = SafeParseWuwaOptimizerExport({
      ...createValidExport(),
      unexpected: true,
    })

    expect(result.success).toBe(false)
  })

  it("rejects invalid OCR confidence values", () => {
    const validExport = createValidExport()
    const payload = {
      ...validExport,
      metadata: {
        ...validExport.metadata,
        confidence: 1.1,
      },
    }

    const result = SafeParseWuwaOptimizerExport(payload)

    expect(result.success).toBe(false)
  })

  it("rejects sentinel enum values in inventory stats", () => {
    const payload = createValidExport()
    payload.echoes[0]!.mainStat = {
      type: StatType.NONE,
      value: 22,
    }

    const result = SafeParseWuwaOptimizerExport(payload)

    expect(result.success).toBe(false)
  })

  it("rejects payloads with the wrong format marker", () => {
    const result = SafeParseWuwaOptimizerExport({
      ...createValidExport(),
      format: "GOOD",
    })

    expect(result.success).toBe(false)
  })
})
