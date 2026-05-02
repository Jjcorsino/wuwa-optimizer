import { z } from "zod"
import { EchoCost } from "../Enums/EchoCost"
import { Rarity } from "../Enums/Rarity"
import { StatType } from "../Enums/StatType"
import { WeaponType } from "../Enums/WeaponType"

export const WUWA_OPTIMIZER_EXPORT_FORMAT = "WUWA_OPTIMIZER_EXPORT"
export const WUWA_OPTIMIZER_EXPORT_SCHEMA_VERSION = 1

export const ImportSourceTypeSchema = z.enum([
  "manual",
  "wuwa_optimizer",
  "scanner",
  "wuwa_inventory_kamera",
  "external",
])

export const ImportIssueSeveritySchema = z.enum(["info", "warning", "error"])

const NormalizedStringSchema = z.string().trim().min(1)
const InventoryIdSchema = NormalizedStringSchema.max(128)
const ConfidenceValueSchema = z.number().min(0).max(1)
const PositiveGameIdSchema = z.number().int().positive()
const CharacterLevelSchema = z.number().int().min(1).max(90)
const EchoLevelSchema = z.number().int().min(0).max(25)
const AscensionSchema = z.number().int().min(0).max(6)
const SequenceSchema = z.number().int().min(0).max(6)
const SkillLevelSchema = z.number().int().min(1).max(10)

const DateTimeStringSchema = NormalizedStringSchema.refine(
  value => !Number.isNaN(Date.parse(value)),
  "Expected a valid date-time string.",
)

export const ImportIssueSchema = z.object({
  severity: ImportIssueSeveritySchema.default("warning"),
  code: NormalizedStringSchema,
  message: NormalizedStringSchema,
  path: NormalizedStringSchema.optional(),
}).strict()

export const ImportInfoSchema = z.object({
  confidence: ConfidenceValueSchema.optional(),
  fieldConfidence: z.record(NormalizedStringSchema, ConfidenceValueSchema).optional(),
  issues: z.array(ImportIssueSchema).default([]),
  raw: z.unknown().optional(),
}).strict()

export const ExportMetadataSchema = z.object({
  exportedAt: DateTimeStringSchema,
  appVersion: NormalizedStringSchema.optional(),
  source: z.object({
    type: ImportSourceTypeSchema,
    name: NormalizedStringSchema.optional(),
    version: NormalizedStringSchema.optional(),
  }).strict(),
  confidence: ConfidenceValueSchema.optional(),
  issues: z.array(ImportIssueSchema).default([]),
  notes: NormalizedStringSchema.optional(),
}).strict()

export const ExportStatSchema = z.object({
  type: z.enum(StatType).refine(value => value !== StatType.NONE, "Stat type cannot be NONE."),
  value: z.number().finite(),
}).strict()

export const ExportCharacterSkillsSchema = z.object({
  basicAttack: SkillLevelSchema.optional(),
  resonanceSkill: SkillLevelSchema.optional(),
  forteCircuit: SkillLevelSchema.optional(),
  resonanceLiberation: SkillLevelSchema.optional(),
  introSkill: SkillLevelSchema.optional(),
  inherentSkill1: z.boolean().optional(),
  inherentSkill2: z.boolean().optional(),
}).strict()

export const ExportCharacterSchema = z.object({
  id: PositiveGameIdSchema,
  name: NormalizedStringSchema.optional(),
  level: CharacterLevelSchema.default(1),
  ascension: AscensionSchema.optional(),
  sequence: SequenceSchema.default(0),
  skills: ExportCharacterSkillsSchema.default({}),
  importInfo: ImportInfoSchema.optional(),
}).strict()

export const ExportWeaponSchema = z.object({
  id: InventoryIdSchema,
  gameId: PositiveGameIdSchema,
  name: NormalizedStringSchema.optional(),
  type: z.enum(WeaponType)
    .refine(value => value !== WeaponType.ALL && value !== WeaponType.NONE, "Weapon type must be a real weapon type.")
    .optional(),
  level: CharacterLevelSchema.default(1),
  ascension: AscensionSchema.optional(),
  rank: z.number().int().min(1).max(5).default(1),
  locked: z.boolean().default(false),
  importInfo: ImportInfoSchema.optional(),
}).strict()

export const ExportEchoSchema = z.object({
  id: InventoryIdSchema,
  gameId: PositiveGameIdSchema,
  name: NormalizedStringSchema.optional(),
  level: EchoLevelSchema.default(0),
  rarity: z.enum(Rarity).refine(value => value !== Rarity.ALL, "Echo rarity must be concrete."),
  cost: z.enum(EchoCost),
  sonataName: NormalizedStringSchema,
  mainStat: ExportStatSchema.optional(),
  secondaryStat: ExportStatSchema.optional(),
  subStats: z.array(ExportStatSchema).max(5).default([]),
  locked: z.boolean().default(false),
  equippedBy: PositiveGameIdSchema.optional(),
  importInfo: ImportInfoSchema.optional(),
}).strict()

export const EquippedLoadoutSchema = z.object({
  characterId: PositiveGameIdSchema,
  weaponId: InventoryIdSchema.optional(),
  echoIds: z.array(InventoryIdSchema).max(5).default([]),
}).strict()

export const WuwaOptimizerExportSchema = z.object({
  format: z.literal(WUWA_OPTIMIZER_EXPORT_FORMAT),
  schemaVersion: z.literal(WUWA_OPTIMIZER_EXPORT_SCHEMA_VERSION),
  gameVersion: NormalizedStringSchema,
  metadata: ExportMetadataSchema,
  characters: z.array(ExportCharacterSchema),
  weapons: z.array(ExportWeaponSchema),
  echoes: z.array(ExportEchoSchema),
  equipped: z.array(EquippedLoadoutSchema),
}).strict()

export type ImportSourceType = z.infer<typeof ImportSourceTypeSchema>
export type ImportIssueSeverity = z.infer<typeof ImportIssueSeveritySchema>
export type ImportIssue = z.infer<typeof ImportIssueSchema>
export type ImportInfo = z.infer<typeof ImportInfoSchema>
export type ExportMetadata = z.infer<typeof ExportMetadataSchema>
export type ExportStat = z.infer<typeof ExportStatSchema>
export type ExportCharacterSkills = z.infer<typeof ExportCharacterSkillsSchema>
export type ExportCharacter = z.infer<typeof ExportCharacterSchema>
export type ExportWeapon = z.infer<typeof ExportWeaponSchema>
export type ExportEcho = z.infer<typeof ExportEchoSchema>
export type EquippedLoadout = z.infer<typeof EquippedLoadoutSchema>
export type WuwaOptimizerExport = z.infer<typeof WuwaOptimizerExportSchema>

export function ParseWuwaOptimizerExport(input: unknown): WuwaOptimizerExport {
  return WuwaOptimizerExportSchema.parse(input)
}

export function SafeParseWuwaOptimizerExport(input: unknown) {
  return WuwaOptimizerExportSchema.safeParse(input)
}

export function IsWuwaOptimizerExport(input: unknown): input is WuwaOptimizerExport {
  return SafeParseWuwaOptimizerExport(input).success
}
