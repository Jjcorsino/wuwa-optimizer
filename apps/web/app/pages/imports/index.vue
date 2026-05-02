<script setup lang="ts">
definePageMeta({
  layout: "default",
})

useSeoMeta({
  title: "Import Data - Wuthering Waves Optimizer",
  description: "Import Wuthering Waves characters, weapons, and echoes from JSON exports or screenshots.",
  keywords: "WuWa import, Wuthering Waves scanner, OCR import, character scanner, JSON import, screenshot scanner",
  ogTitle: "Import Data - Wuthering Waves Optimizer",
  ogDescription: "Import Wuthering Waves characters, weapons, and echoes.",
  ogType: "website",
})

const SelectedTab = ref<string>("0")

const TabItems = [{
  label: "JSON Import",
  icon: "i-carbon-json",
  disabled: false,
  slot: "json" as const,
}, {
  label: "Wuthering Waves Bot Scanner",
  icon: "i-carbon-scan",
  disabled: false,
  slot: "scanner" as const,
}]
</script>

<template>
  <div class="mx-auto mb-4 xl:max-w-7xl px-8 text-gray-300">
    <ClientOnly>
      <UTabs
        v-model="SelectedTab"
        :items="TabItems"
        color="neutral"
        class="max-w-7xl xl:max-w-[100rem] mx-auto"
        default-value="0"
        :ui="{
          list: 'rounded-none border-neutral-600',
          indicator: 'rounded-none bg-neutral-300',
        }"
      >
        <template #json>
          <LazyJsonImporterTab v-if="SelectedTab === '0'" />
        </template>
        <template #scanner>
          <LazyScannerImporterTab v-if="SelectedTab === '1'" />
        </template>
      </UTabs>
      <template #fallback>
        <div class="flex items-center justify-center w-full h-full overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center">
            <UProgress class="w-[50%]" animation="swing" />
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
