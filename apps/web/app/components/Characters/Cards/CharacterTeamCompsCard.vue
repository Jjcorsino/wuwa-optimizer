<script setup lang="ts">
import type { BaseCharacter } from '~/Core/Interfaces/Character'
import { TeamComps } from '~/Core/TeamComps'

const Route = useRoute()
const { t, te } = useI18n()
const CharactersStore = useCharactersStore()

const Id = computed<number>(() => Number.parseInt((Route.params as { id: string }).id))

const CharacterName = computed(() => {
  const key = `${Id.value}_name`
  return te(key) ? t(key) : ''
})

// Build lowercase-name → BaseCharacter map for icon + ID resolution
const CharacterByName = computed(() => {
  const map = new Map<string, BaseCharacter>()
  for (const char of CharactersStore.GetAll()) {
    const key = `${char.Id}_name`
    const name = te(key) ? t(key) : null
    if (name) map.set(name.toLowerCase(), char)
  }
  return map
})

const CharacterTeamComps = computed(() => {
  if (!CharacterName.value) return []
  const searchName = CharacterName.value.toLowerCase().trim()
  return TeamComps.filter((comp) => {
    const compName = comp.characterName.toLowerCase().trim()
    return compName === searchName
      || compName.startsWith(`${searchName} (`)
      || searchName.startsWith(`${compName} (`)
  })
})

function resolveCharacter(memberName: string): BaseCharacter | null {
  const lower = memberName.toLowerCase()
  let char = CharacterByName.value.get(lower) ?? null

  if (!char) {
    for (const [name, c] of CharacterByName.value) {
      if (lower.startsWith(`${name} (`) || name.startsWith(`${lower} (`)) {
        char = c
        break
      }
    }
  }
  return char
}

function getCharacterIcon(memberName: string): string | null {
  const char = resolveCharacter(memberName)
  return char ? `/characters/${char.Id}/images/${char.Icon}` : null
}

function getCharacterRoute(memberName: string): string | null {
  const char = resolveCharacter(memberName)
  return char ? `/characters/${char.Id}` : null
}

function getRoleBadgeColor(role: string): 'primary' | 'secondary' | 'success' {
  const r = role.toLowerCase()
  if (r.includes('main')) return 'primary'
  if (r.includes('support') || r.includes('healer')) return 'success'
  return 'secondary'
}
</script>

<template>
  <div v-if="CharacterTeamComps.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-3">
    <MCard
      v-for="(comp, idx) in CharacterTeamComps"
      :key="idx"
      :border-lines-count="3"
    >
      <div class="flex flex-col gap-2">
        <span v-if="CharacterTeamComps.length > 1" class="text-xs text-neutral-400 font-medium">
          {{ comp.teamLabel }}
        </span>
        <div class="flex items-stretch gap-2 justify-around">
          <div
            v-for="member in comp.members"
            :key="member.name"
            class="flex flex-col items-center gap-2 flex-1 py-1"
          >
            <component
              :is="getCharacterRoute(member.name) ? 'NuxtLink' : 'div'"
              :to="getCharacterRoute(member.name) ?? undefined"
              class="relative w-16 h-16 rounded overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0 transition-transform duration-150"
              :class="{ 'hover:scale-110 cursor-pointer': getCharacterRoute(member.name) }"
            >
              <NuxtImg
                v-if="getCharacterIcon(member.name)"
                :src="getCharacterIcon(member.name)!"
                :width="64"
                :height="64"
                class="w-full h-full object-cover object-top"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-xl font-bold text-neutral-400 select-none"
              >
                {{ member.name[0] }}
              </div>
            </component>

            <span
              class="text-xs font-medium text-neutral-200 text-center leading-tight max-w-[80px] line-clamp-2"
              :title="member.name"
            >
              {{ member.name }}
            </span>

            <UBadge
              size="xs"
              :color="getRoleBadgeColor(member.role)"
              variant="soft"
            >
              {{ member.role }}
            </UBadge>
          </div>
        </div>
      </div>
    </MCard>
  </div>
</template>
