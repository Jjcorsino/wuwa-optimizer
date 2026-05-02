# WUWA_OPTIMIZER_EXPORT v1

`WUWA_OPTIMIZER_EXPORT` is the native import/export format for this project. It is inspired by the GOOD-style workflow, but it is not a copy of any external schema or scanner implementation.

Goals:

- Keep player data portable and reviewable before saving it into local stores.
- Preserve scanner/OCR confidence and warnings without treating uncertain values as confirmed inventory.
- Decouple external scanner formats from the app's internal Pinia models.
- Version the schema so future Wuthering Waves content updates can migrate safely.

## Top-level shape

```json
{
  "format": "WUWA_OPTIMIZER_EXPORT",
  "schemaVersion": 1,
  "gameVersion": "3.3",
  "metadata": {
    "exportedAt": "2026-05-01T00:00:00.000Z",
    "appVersion": "0.0.0",
    "source": {
      "type": "manual",
      "name": "wuwa-optimizer"
    },
    "confidence": 1,
    "issues": []
  },
  "characters": [],
  "weapons": [],
  "echoes": [],
  "equipped": []
}
```

Required source types for v1:

- `manual`
- `wuwa_optimizer`
- `scanner`
- `wuwa_inventory_kamera`
- `external`

## Inventory IDs

Character IDs are game content IDs. Weapons and echoes use an inventory `id` string plus a `gameId` field:

- `id` identifies a specific player-owned item.
- `gameId` identifies the base weapon or echo in game data.

This keeps duplicate weapons and duplicate echoes representable.

## Confidence and issues

Scanner and OCR pipelines should write uncertainty to `metadata` or item-level `importInfo`:

```json
{
  "confidence": 0.82,
  "fieldConfidence": {
    "mainStat.value": 0.74
  },
  "issues": [
    {
      "severity": "warning",
      "code": "OCR_LOW_CONFIDENCE",
      "message": "Main stat value should be reviewed.",
      "path": "echoes[0].mainStat.value"
    }
  ]
}
```

Importers should show a preview and require user confirmation before committing data to stores when warnings or low-confidence fields exist.

## Validation rules

The v1 schema is strict:

- Unknown object fields are rejected.
- Confidence values must be between `0` and `1`.
- Sentinel enum values such as `NONE` stats or `ALL` rarity are rejected in saved inventory.
- Echo substats and equipped echo IDs are capped at five entries.
- Levels, ascension, weapon rank, sequence, and skill levels are bounded to valid ranges.

The implementation lives in `apps/web/app/Core/ImportExport/WuwaOptimizerExport.ts`.
