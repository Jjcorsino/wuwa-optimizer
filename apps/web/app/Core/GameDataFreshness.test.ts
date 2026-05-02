import { describe, expect, it } from "vitest"
import enUS from "../../i18n/locales/en-US"
import frFR from "../../i18n/locales/fr-FR"
import jaJP from "../../i18n/locales/ja-JP"
import { BaseCharacters, Denia, Hiyuki } from "./Characters"
import { CharacterType } from "./Enums/CharacterType"
import { StatType } from "./Enums/StatType"
import { WeaponType } from "./Enums/WeaponType"
import { GameVersion, ScorerGameVersion, UpcomingGameVersion } from "./Versions"
import { BaseWeapons } from "./Weapons"

function getStatValue(character: { BaseStats: { Type: StatType, Value: number }[] }, statType: StatType) {
  return character.BaseStats.find(statistic => statistic.Type === statType)?.Value
}

describe("current game data", () => {
  it("tracks the current supported game/scorer versions", () => {
    expect(GameVersion).toBe("3.3")
    expect(ScorerGameVersion).toBe("3.3")
    expect(UpcomingGameVersion).toBe("3.4")
  })

  it("contains the expected 3.3 resonator roster baseline", () => {
    expect(BaseCharacters).toHaveLength(50)

    const ids = new Set(BaseCharacters.map(character => character.Id))
    expect(ids.size).toBe(BaseCharacters.length)
  })

  it("does not ship placeholder typing or empty stat weights for playable resonators", () => {
    const incompleteCharacters = BaseCharacters.filter((character) => {
      return character.Type === CharacterType.NONE
        || character.WeaponType === WeaponType.NONE
        || character.BaseStats.length === 0
        || Object.keys(character.BaseStatsWeights).length === 0
    })

    expect(incompleteCharacters).toEqual([])
  })

  it("includes verified base stats and typing for the latest 3.3/3.4 resonators", () => {
    expect(Hiyuki.Type).toBe(CharacterType.GLACIO)
    expect(Hiyuki.WeaponType).toBe(WeaponType.SWORD)
    expect(getStatValue(Hiyuki, StatType.HP)).toBe(10300)
    expect(getStatValue(Hiyuki, StatType.ATTACK)).toBe(462)
    expect(getStatValue(Hiyuki, StatType.DEF)).toBe(1112)

    expect(Denia.Type).toBe(CharacterType.FUSION)
    expect(Denia.WeaponType).toBe(WeaponType.RECTIFIER)
    expect(getStatValue(Denia, StatType.HP)).toBe(11025)
    expect(getStatValue(Denia, StatType.ATTACK)).toBe(425)
    expect(getStatValue(Denia, StatType.DEF)).toBe(1148)
  })

  it("includes the current signature weapon stat blocks", () => {
    expect(BaseWeapons).toEqual(expect.arrayContaining([
      expect.objectContaining({ Name: "Thunderflare Dominion", Type: WeaponType.BROADBLADE }),
      expect.objectContaining({ Name: "Frostburn", Type: WeaponType.SWORD }),
      expect.objectContaining({ Name: "Daybreaker's Spine", Type: WeaponType.GAUNTLETS }),
      expect.objectContaining({ Name: "Forged Dwarf Star", Type: WeaponType.RECTIFIER }),
    ]))
  })

  it("has localized display names for recent resonators", () => {
    const locales = [enUS, frFR, jaJP] as Record<string, string>[]

    for (const locale of locales) {
      expect(locale["9906_name"]).toBeTruthy()
      expect(locale["9906_name"]).not.toBe("9906_name")
      expect(locale["9907_name"]).toBeTruthy()
      expect(locale["9907_name"]).not.toBe("9907_name")
      expect(locale["9913_name"]).toBeTruthy()
      expect(locale["9913_name"]).not.toBe("9913_name")
    }
  })
})
