<script setup lang="ts">
import type { Skill } from '~/types'

const { t } = useI18n()

const { data: skills, pending } = await useFetch<Skill[]>('/api/skills')

const activeCategory = ref('all')

const categories = computed(() => {
  const cats = new Set(skills.value?.map(s => s.category) || [])
  return ['all', ...Array.from(cats)]
})

const filteredSkills = computed(() => {
  if (!skills.value) return []
  const enabled = skills.value.filter(s => s.enabled !== false)
  if (activeCategory.value === 'all') return enabled
  return enabled.filter(s => s.category === activeCategory.value)
})

function getCategoryLabel(cat: string) {
  if (cat === 'all') return 'All'
  const key = `skills.categories.${cat}`
  return t(key as any) || cat
}

function getLevelLabel(level: number) {
  return t(`skills.level_${level}` as any)
}

function getLevelPercent(level: number) {
  return (level / 5) * 100
}
</script>

<template>
  <section id="skills" class="py-24 relative">
    <div class="absolute inset-0 dots-bg opacity-20" />
    <div class="container relative z-10">
      <!-- Header -->
      <div class="text-center mb-16" data-animate>
        <p class="font-mono text-primary text-sm font-medium mb-2">{{ t('skills.subtitle') }}</p>
        <h2 class="text-4xl md:text-5xl font-bold mb-4">
          {{ t('skills.title') }}
        </h2>
        <p class="text-muted-foreground max-w-xl mx-auto">{{ t('skills.description') }}</p>
      </div>

      <!-- Category filter tabs -->
      <div class="flex flex-wrap gap-2 justify-center mb-12" data-animate data-animate-delay="100">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 font-mono',
            activeCategory === cat
              ? 'bg-primary text-primary-foreground shadow-lg glow'
              : 'glass text-muted-foreground hover:text-foreground hover:border-primary/30'
          ]"
          @click="activeCategory = cat"
        >
          {{ getCategoryLabel(cat) }}
        </button>
      </div>

      <!-- Skills grid -->
      <div v-if="pending" class="flex justify-center py-12">
        <div class="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <div
          v-for="(skill, i) in filteredSkills"
          :key="skill.id"
          class="glass rounded-xl p-5 glow-hover group transition-all duration-300 hover:-translate-y-1"
          data-animate
          :style="{ transitionDelay: `${(i % 8) * 50}ms` }"
        >
          <!-- Color accent bar -->
          <div
            class="w-full h-0.5 rounded-full mb-4 opacity-70"
            :style="{ background: skill.color || 'hsl(var(--primary))' }"
          />

          <!-- Skill name -->
          <h3 class="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {{ skill.name }}
          </h3>

          <!-- Category badge -->
          <div class="mb-4">
            <span class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground border-border/50">
              {{ getCategoryLabel(skill.category) }}
            </span>
          </div>

          <!-- Progress bar -->
          <div class="space-y-1">
            <div class="flex justify-between items-center text-xs text-muted-foreground font-mono">
              <span>{{ getLevelLabel(skill.level) }}</span>
              <span>{{ skill.level }}/5</span>
            </div>
            <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                class="h-full rounded-full transition-all duration-700 ease-out"
                :style="{
                  width: `${getLevelPercent(skill.level)}%`,
                  background: skill.color || 'hsl(var(--primary))'
                }"
              />
            </div>
          </div>

        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!pending && filteredSkills.length === 0" class="text-center py-12 text-muted-foreground">
        <p class="font-mono">{{ t('admin.no_items') }}</p>
      </div>
    </div>
  </section>
</template>
