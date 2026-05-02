import { StatType } from './Enums/StatType'
import type Skill from './Interfaces/Skill'

// Minor forte = the 8 circular passive stat nodes in each character's skill tree.
// Four branches × 2 nodes each: Basic Attack, Resonance Skill, Resonance Liberation, Intro Skill.
// Data sourced from game8.co character build pages.

type MinorForteEntry = Pick<Skill, 'Id' | 'Level' | 'Icon' | 'Unlocked' | 'Stat'>

function makeCritRate(id: string): MinorForteEntry[] {
  return [
    { Id: `${id}_Bonus_Stat_01`, Level: 10, Icon: 'Icon_Attribute_Crit_Rate.webp', Unlocked: true, Stat: { Type: StatType.CRIT_RATE, Value: 1.2 } },
    { Id: `${id}_Bonus_Stat_02`, Level: 10, Icon: 'Icon_Attribute_Crit_Rate.webp', Unlocked: true, Stat: { Type: StatType.CRIT_RATE, Value: 2.8 } },
  ]
}

function makeCritDmg(id: string): MinorForteEntry[] {
  return [
    { Id: `${id}_Bonus_Stat_01`, Level: 10, Icon: 'Icon_Attribute_Crit_DMG.webp', Unlocked: true, Stat: { Type: StatType.CRIT_DMG, Value: 2.4 } },
    { Id: `${id}_Bonus_Stat_02`, Level: 10, Icon: 'Icon_Attribute_Crit_DMG.webp', Unlocked: true, Stat: { Type: StatType.CRIT_DMG, Value: 5.6 } },
  ]
}

function makeAtk(id: string): MinorForteEntry[] {
  return [
    { Id: `${id}_Bonus_Stat_01`, Level: 10, Icon: 'Icon_Attribute_Attack.webp', Unlocked: true, Stat: { Type: StatType.ATTACK_PERCENTAGE, Value: 1.8 } },
    { Id: `${id}_Bonus_Stat_02`, Level: 10, Icon: 'Icon_Attribute_Attack.webp', Unlocked: true, Stat: { Type: StatType.ATTACK_PERCENTAGE, Value: 4.2 } },
  ]
}

function makeHealingBonus(id: string): MinorForteEntry[] {
  return [
    { Id: `${id}_Bonus_Stat_01`, Level: 10, Icon: 'Icon_Attribute_Healing.webp', Unlocked: true, Stat: { Type: StatType.HEALING_BONUS, Value: 1.8 } },
    { Id: `${id}_Bonus_Stat_02`, Level: 10, Icon: 'Icon_Attribute_Healing.webp', Unlocked: true, Stat: { Type: StatType.HEALING_BONUS, Value: 4.2 } },
  ]
}

function makeDef(id: string): MinorForteEntry[] {
  return [
    { Id: `${id}_Bonus_Stat_01`, Level: 10, Icon: 'Icon_Attribute_Defense.webp', Unlocked: true, Stat: { Type: StatType.DEF_PERCENTAGE, Value: 2.28 } },
    { Id: `${id}_Bonus_Stat_02`, Level: 10, Icon: 'Icon_Attribute_Defense.webp', Unlocked: true, Stat: { Type: StatType.DEF_PERCENTAGE, Value: 5.32 } },
  ]
}

// Standard DPS pattern: Basic Attack + Intro Skill → Crit Rate | Resonance Skill + Liberation → ATK%
function standardDps(): MinorForteEntry[] {
  return [
    ...makeCritRate('Basic_Attack'),
    ...makeAtk('Resonance_Skill'),
    ...makeAtk('Resonance_Liberation'),
    ...makeCritRate('Intro_Skill'),
  ]
}

export const MinorForteSkills: Record<number, MinorForteEntry[]> = {
  // Augusta — Electro Broadblade DPS
  9901: standardDps(),

  // Iuno — Aero Gauntlets DPS
  9902: standardDps(),

  // Galbrena — Fusion Pistols DPS (Crit DMG instead of Crit Rate on Basic Attack / Intro Skill)
  9903: [
    ...makeCritDmg('Basic_Attack'),
    ...makeAtk('Resonance_Skill'),
    ...makeAtk('Resonance_Liberation'),
    ...makeCritDmg('Intro_Skill'),
  ],

  // Qiuyuan — Aero Sword DPS
  9904: standardDps(),

  // Chisa — Havoc Broadblade DPS
  9905: standardDps(),

  // Hiyuki — Glacio Sword DPS
  9906: standardDps(),

  // Denia — Fusion Rectifier DPS (data not yet published, will be filled when available)
  // 9907: not added yet

  // Mornye — Fusion Broadblade healer (Healing Bonus on Basic Attack / Intro Skill, DEF% on Skill / Liberation)
  9908: [
    ...makeHealingBonus('Basic_Attack'),
    ...makeDef('Resonance_Skill'),
    ...makeDef('Resonance_Liberation'),
    ...makeHealingBonus('Intro_Skill'),
  ],

  // Aemeath — Fusion Sword DPS
  9909: standardDps(),

  // Buling — Electro Rectifier healer/support (Healing Bonus on Basic Attack / Intro Skill, ATK% on Skill / Liberation)
  9910: [
    ...makeHealingBonus('Basic_Attack'),
    ...makeAtk('Resonance_Skill'),
    ...makeAtk('Resonance_Liberation'),
    ...makeHealingBonus('Intro_Skill'),
  ],

  // Sigrika — Aero Gauntlets DPS
  9911: standardDps(),

  // Lynae — Spectro Pistols DPS
  9912: standardDps(),

  // Luuk Herssen — Spectro Gauntlets DPS
  9913: standardDps(),
}
