<script setup lang="ts">
import type { Tool, ToolCategory } from '~/types'

const { t, locale } = useI18n()
const colorMode = useColorMode()

const [{ data: tools, pending }, { data: categories }] = await Promise.all([
  useFetch<Tool[]>('/api/tools'),
  useFetch<ToolCategory[]>('/api/tool-categories'),
])

const enabledTools = computed(() => tools.value?.filter(t => t.enabled !== false) ?? [])

const categoryLabel = (value: string) => {
  const cat = categories.value?.find(c => c.value === value)
  if (!cat) return value
  return locale.value === 'de' ? cat.labelDe : cat.labelEn
}

const toolsByCategory = computed(() => {
  const presentCats = new Set(enabledTools.value.map(t => t.category))
  const order = (categories.value ?? []).map(c => c.value)
  const sorted = [
    ...order.filter(c => presentCats.has(c)),
    ...[...presentCats].filter(c => !order.includes(c)),
  ]
  const result: Record<string, Tool[]> = {}
  for (const cat of sorted) {
    result[cat] = enabledTools.value.filter(t => t.category === cat)
  }
  return result
})

const iconErrors = reactive<Record<string, boolean>>({})

function iconUrl(tool: Tool) {
  const slug = tool.icon?.trim()
  if (!slug) return null
  const color = colorMode.value === 'light' ? '' : '/ffffff'
  return `https://cdn.simpleicons.org/${slug}${color}`
}

function initials(name: string) {
  return name.substring(0, 2).toUpperCase()
}
</script>

<template>
  <section id="tools" class="py-16 bg-card/20 relative">
    <div class="absolute inset-0 grid-bg opacity-10" />
    <div class="container relative z-10">
      <!-- Header -->
      <div class="text-center mb-10" data-animate>
        <p class="font-mono text-primary text-sm font-medium mb-2">{{ t('tools.subtitle') }}</p>
        <h2 class="text-4xl md:text-5xl font-bold mb-4">{{ t('tools.title') }}</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">{{ t('tools.description') }}</p>
      </div>

      <div v-if="pending" class="flex justify-center py-8">
        <div class="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>

      <div v-else class="space-y-6 max-w-4xl mx-auto" data-animate data-animate-delay="100">
        <div
          v-for="(catTools, cat) in toolsByCategory"
          :key="cat"
          class="flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <span class="font-mono text-xs text-primary shrink-0 w-44">// {{ categoryLabel(cat) }}</span>

          <div class="flex flex-wrap gap-2">
            <div
              v-for="tool in catTools"
              :key="tool.id"
              class="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/40 bg-card/50 hover:border-primary/40 hover:bg-card transition-colors cursor-default"
            >
              <img
                v-if="iconUrl(tool) && !iconErrors[tool.id]"
                :src="iconUrl(tool)!"
                :alt="tool.name"
                class="w-3.5 h-3.5 object-contain shrink-0"
                @error="iconErrors[tool.id] = true"
              />
              <span
                v-else
                class="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8px] font-bold text-white shrink-0 bg-primary/60"
              >{{ initials(tool.name) }}</span>

              <span class="text-xs font-medium">{{ tool.name }}</span>

              <div
                v-if="tool.description"
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-popover border border-border text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg"
              >
                {{ tool.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
