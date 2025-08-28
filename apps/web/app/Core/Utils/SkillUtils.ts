import type Skill from "../Interfaces/Skill"
import { SkillType } from "../Enums/SkillType"

export function GetSkillIcon(skill: Skill)
{
  switch (skill.Type) {
    case SkillType.BONUS:
      return GetBonusSkillIcon(skill)
    default:
      return
  }

  return ""
}

export function GetBonusSkillIcon(skill: Skill){
  if (!skill.Stat) {
    return undefined
  }
}
