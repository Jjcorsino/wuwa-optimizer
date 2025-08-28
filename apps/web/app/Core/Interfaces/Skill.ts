import type { SkillType } from "../Enums/SkillType"
import type Statistic from "./Statistic"

export default interface Skill {
  Type: SkillType
  Level: number
  Unlocked: boolean
  CanLevelUp?: boolean
  Stat?: Statistic
}
