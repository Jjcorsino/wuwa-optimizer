import type Statistic from "../Interfaces/Statistic"
import { EchoCost } from "../Enums/EchoCost"
import { StatType } from "../Enums/StatType"
import { FOUR_COST_SECONDARY_STATS_VALUES, ONE_COST_SECONDARY_STATS_VALUES, STAT_NAMES, THREE_COST_SECONDARY_STATS_VALUES } from "../Statistics"

export const STAT_ICONS: Record<StatType, string> = {
  [StatType.NONE]: "",
  [StatType.HP]: "Icon_Attribute_Health.webp",
  [StatType.CRIT_DMG]: "Icon_Attribute_Crit_DMG.webp",
  [StatType.CRIT_RATE]: "Icon_Attribute_Crit_Rate.webp",
  [StatType.ATTACK]: "Icon_Attribute_Attack.webp",
  [StatType.ATTACK_PERCENTAGE]: "Icon_Attribute_Attack.webp",
  [StatType.HP_PERCENTAGE]: "Icon_Attribute_Health.webp",
  [StatType.HEALING_BONUS]: "Icon_Attribute_Healing.webp",
  [StatType.DEF]: "Icon_Attribute_Defense.webp",
  [StatType.DEF_PERCENTAGE]: "Icon_Attribute_Defense.webp",
  [StatType.ENERGY_REGENERATION]: "Icon_Attribute_Energy_Regen.webp",
  [StatType.BASIC_ATTACK_DMG_AMPLIFICATION]: "Icon_Basic_Attack_DMG_Amplification.webp",
  [StatType.HEAVY_ATTACK_DMG_AMPLIFICATION]: "Icon_Heavy_Attack_DMG_Amplification.webp",
  [StatType.RESONANCE_LIBERATION_DMG_AMPLIFICATION]: "Icon_Resonance_Liberation_DMG_Amplification.webp",
  [StatType.RESONANCE_SKILL_DMG_AMPLIFICATION]: "Icon_Resonance_Skill_DMG_Amplification.webp",
  [StatType.ELECTRO_DMG_BONUS]: "Icon_Electro_DMG_Bonus.webp",
  [StatType.FUSION_DMG_BONUS]: "Icon_Fusion_DMG_Bonus.webp",
  [StatType.GLACIO_DMG_BONUS]: "Icon_Glacio_DMG_Bonus.webp",
  [StatType.HAVOC_DMG_BONUS]: "Icon_Havoc_DMG_Bonus.webp",
  [StatType.SPECTRO_DMG_BONUS]: "Icon_Spectro_DMG_Bonus.webp",
  [StatType.AERO_DMG_BONUS]: "Icon_Aero_DMG_Bonus.webp",
}

export function GetSecondaryStat(echoCost: EchoCost): Statistic {
  switch (echoCost) {
    case EchoCost.FOUR_COST:
      return {
        Type: StatType.ATTACK,
        Value: FOUR_COST_SECONDARY_STATS_VALUES[StatType.ATTACK],
      }
    case EchoCost.THREE_COST:
      return {
        Type: StatType.ATTACK,
        Value: THREE_COST_SECONDARY_STATS_VALUES[StatType.ATTACK],
      }
    case EchoCost.ONE_COST:
      return {
        Type: StatType.HP,
        Value: ONE_COST_SECONDARY_STATS_VALUES[StatType.HP],
      }
  }
}

export function GetStatTypeFromName(name: string) {
  for (const [key, value] of Object.entries(STAT_NAMES)) {
    if (value.toLowerCase() === name.toLowerCase()) {
      return key as StatType
    }
  }
  return StatType.NONE
}

export function GetStatIcon(statType: StatType) {
  return STAT_ICONS[statType]
}
