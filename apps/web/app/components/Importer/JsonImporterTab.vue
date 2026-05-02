<script setup lang="ts">
import type { WuwaOptimizerExport } from "~/Core/ImportExport/WuwaOptimizerExport"
import type { WuwaOptimizerImportPreview } from "~/Core/ImportExport/WuwaOptimizerImport"
import type Echo from "~/Core/Interfaces/Echo"
import { ZodError } from "zod"
import {
  ParseWuwaOptimizerExport,
  WUWA_OPTIMIZER_EXPORT_FORMAT,
} from "~/Core/ImportExport/WuwaOptimizerExport"
import {
  CreateWuwaOptimizerImportPlan,
  CreateWuwaOptimizerImportPreview,
} from "~/Core/ImportExport/WuwaOptimizerImport"

const CharactersStore = useCharactersStore()
const WeaponsStore = useWeaponsStore()
const EchoesStore = useEchoesStore()
const BuildsStore = useBuildsStore()

const SelectedFile = ref<File | undefined>(undefined)
const JsonText = ref("")
const ParsedExport = ref<WuwaOptimizerExport | undefined>(undefined)
const Preview = ref<WuwaOptimizerImportPreview | undefined>(undefined)
const ErrorMessage = ref<string | undefined>(undefined)
const SuccessMessage = ref<string | undefined>(undefined)
const IsImporting = ref(false)

const BlockingIssues = computed(() => Preview.value?.issues.filter(issue => issue.severity === "error") ?? [])
const ReviewIssues = computed(() => Preview.value?.issues.filter(issue => issue.severity !== "error") ?? [])

async function OnFileUploaded() {
  if (!SelectedFile.value) {
    return
  }

  JsonText.value = await SelectedFile.value.text()
  ParseJsonText()
}

function OnJsonInputChanged() {
  ParsedExport.value = undefined
  Preview.value = undefined
  ErrorMessage.value = undefined
  SuccessMessage.value = undefined
}

function ParseJsonText() {
  ErrorMessage.value = undefined
  SuccessMessage.value = undefined
  ParsedExport.value = undefined
  Preview.value = undefined

  try {
    const parsedJson = JSON.parse(JsonText.value)
    const parsedExport = ParseWuwaOptimizerExport(parsedJson)

    ParsedExport.value = parsedExport
    Preview.value = CreateWuwaOptimizerImportPreview(parsedExport)
  }
  catch (error) {
    ErrorMessage.value = formatParseError(error)
  }
}

function OnClearClicked() {
  SelectedFile.value = undefined
  JsonText.value = ""
  ParsedExport.value = undefined
  Preview.value = undefined
  ErrorMessage.value = undefined
  SuccessMessage.value = undefined
}

function OnImportClicked() {
  if (!ParsedExport.value || !Preview.value?.canImport) {
    return
  }

  IsImporting.value = true
  ErrorMessage.value = undefined
  SuccessMessage.value = undefined

  try {
    const plan = CreateWuwaOptimizerImportPlan(ParsedExport.value)

    plan.characters.forEach(character => CharactersStore.UpdateById(character.Id, character))
    plan.weapons.forEach(weapon => WeaponsStore.AddOrUpdate(weapon))
    plan.echoes.forEach(echo => EchoesStore.Upsert(echo))
    plan.loadouts.forEach((loadout) => {
      if (!loadout.weaponId) {
        return
      }

      const character = CharactersStore.GetById(loadout.characterId)
      const weapon = WeaponsStore.GetById(loadout.weaponId)
      const echoes = loadout.echoIds
        .map(echoId => EchoesStore.GetById(echoId))
        .filter(isEcho)

      BuildsStore.CreateBuild(loadout.name, character, weapon, echoes)
    })

    SuccessMessage.value = `Imported ${plan.characters.length} characters, ${plan.weapons.length} weapons, and ${plan.echoes.length} echoes.`
  }
  catch (error) {
    ErrorMessage.value = error instanceof Error ? error.message : "Import failed."
  }
  finally {
    IsImporting.value = false
  }
}

function formatParseError(error: unknown): string {
  if (error instanceof SyntaxError) {
    return "Invalid JSON syntax."
  }

  if (error instanceof ZodError) {
    return error.issues
      .slice(0, 6)
      .map(issue => `${issue.path.join(".") || WUWA_OPTIMIZER_EXPORT_FORMAT}: ${issue.message}`)
      .join("\n")
  }

  return error instanceof Error ? error.message : "Invalid import file."
}

function isEcho(echo: Echo | undefined): echo is Echo {
  return echo !== undefined
}

function getIssueColor(severity: WuwaOptimizerImportPreview["issues"][number]["severity"]) {
  if (severity === "error") {
    return "error"
  }

  if (severity === "warning") {
    return "warning"
  }

  return "neutral"
}
</script>

<template>
  <div class="mx-auto my-8 max-w-7xl text-gray-300">
    <div class="grid grid-cols-1 lg:grid-cols-[24rem_minmax(0,1fr)] gap-6">
      <section class="border border-neutral-800 bg-neutral-950/40 p-4">
        <div class="flex flex-col gap-4">
          <UFileUpload
            v-model="SelectedFile"
            size="lg"
            accept="application/json,.json"
            variant="area"
            class="min-h-40"
            label="Drop JSON here"
            description="WUWA_OPTIMIZER_EXPORT"
            @change="OnFileUploaded"
          />

          <textarea
            v-model="JsonText"
            class="min-h-64 w-full resize-y border border-neutral-800 bg-neutral-950 p-3 font-mono text-sm text-gray-200 outline-none focus:border-primary-400"
            spellcheck="false"
            placeholder="{"
            @input="OnJsonInputChanged"
          />

          <div class="flex flex-wrap gap-3">
            <UButton
              icon="i-carbon-view"
              color="neutral"
              :disabled="JsonText.trim().length === 0"
              @click="ParseJsonText"
            >
              Preview
            </UButton>
            <UButton
              icon="i-carbon-trash-can"
              color="neutral"
              variant="ghost"
              @click="OnClearClicked"
            >
              Clear
            </UButton>
          </div>
        </div>
      </section>

      <section class="border border-neutral-800 bg-neutral-950/40 p-4">
        <div v-if="ErrorMessage" class="whitespace-pre-wrap">
          <UAlert
            color="error"
            variant="subtle"
            title="Import rejected"
            :description="ErrorMessage"
          />
        </div>

        <div v-else-if="Preview" class="flex flex-col gap-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-medium text-gray-100">
                Import Preview
              </h3>
              <p class="text-sm text-gray-400">
                Game {{ Preview.gameVersion }} - {{ Preview.sourceType }}
              </p>
            </div>
            <UBadge :color="Preview.canImport ? 'success' : 'error'" variant="subtle">
              {{ Preview.canImport ? 'Ready' : 'Blocked' }}
            </UBadge>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="border border-neutral-800 bg-neutral-950 p-3">
              <div class="text-2xl font-semibold text-gray-100">
                {{ Preview.counts.characters }}
              </div>
              <div class="text-xs uppercase tracking-wide text-gray-500">
                Characters
              </div>
            </div>
            <div class="border border-neutral-800 bg-neutral-950 p-3">
              <div class="text-2xl font-semibold text-gray-100">
                {{ Preview.counts.weapons }}
              </div>
              <div class="text-xs uppercase tracking-wide text-gray-500">
                Weapons
              </div>
            </div>
            <div class="border border-neutral-800 bg-neutral-950 p-3">
              <div class="text-2xl font-semibold text-gray-100">
                {{ Preview.counts.echoes }}
              </div>
              <div class="text-xs uppercase tracking-wide text-gray-500">
                Echoes
              </div>
            </div>
            <div class="border border-neutral-800 bg-neutral-950 p-3">
              <div class="text-2xl font-semibold text-gray-100">
                {{ Preview.counts.equipped }}
              </div>
              <div class="text-xs uppercase tracking-wide text-gray-500">
                Loadouts
              </div>
            </div>
          </div>

          <div v-if="BlockingIssues.length || ReviewIssues.length" class="flex flex-col gap-3">
            <div
              v-for="issue in Preview.issues"
              :key="`${issue.code}-${issue.path}-${issue.message}`"
              class="border border-neutral-800 bg-neutral-950 p-3"
            >
              <div class="flex flex-wrap items-center gap-2">
                <UBadge :color="getIssueColor(issue.severity)" variant="subtle">
                  {{ issue.severity }}
                </UBadge>
                <span class="font-mono text-xs text-gray-500">{{ issue.code }}</span>
                <span v-if="issue.path" class="font-mono text-xs text-gray-600">{{ issue.path }}</span>
              </div>
              <p class="mt-2 text-sm text-gray-300">
                {{ issue.message }}
              </p>
            </div>
          </div>

          <UAlert
            v-if="SuccessMessage"
            color="success"
            variant="subtle"
            title="Import complete"
            :description="SuccessMessage"
          />

          <div class="flex justify-end">
            <UButton
              color="primary"
              size="lg"
              icon="i-carbon-save"
              :loading="IsImporting"
              :disabled="!Preview.canImport"
              @click="OnImportClicked"
            >
              Import Data
            </UButton>
          </div>
        </div>

        <div v-else class="flex h-full min-h-96 items-center justify-center text-sm text-gray-500">
          No JSON preview loaded.
        </div>
      </section>
    </div>
  </div>
</template>
