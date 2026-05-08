<script setup lang="ts">
import type { Experience } from '~/types'

const { t } = useI18n()

const { data: experiences, pending } = await useFetch<Experience[]>('/api/experience')

const visibleExperiences = computed(() => experiences.value?.filter(e => e.enabled !== false) ?? [])

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  const year = parts[0] ?? '2020'
  const month = parts[1] ?? '01'
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })
}

function getDuration(startDate: string, endDate?: string, current?: boolean) {
  const start = new Date(startDate + '-01')
  const end = current ? new Date() : new Date((endDate || startDate) + '-01')
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years === 0) return `${remainingMonths} ${t('common.months')}`
  if (remainingMonths === 0) return `${years} ${t('common.years')}`
  return `${years} ${t('common.years')}, ${remainingMonths} ${t('common.months')}`
}
</script>

<template>
  <section id="experience" class="py-24 relative">
    <div class="absolute inset-0 dots-bg opacity-20" />
    <div class="container relative z-10">
      <!-- Header -->
      <div class="text-center mb-16" data-animate>
        <p class="font-mono text-primary text-sm font-medium mb-2">{{ t('experience.subtitle') }}</p>
        <h2 class="text-4xl md:text-5xl font-bold mb-4">
          {{ t('experience.title') }}
        </h2>
        <p class="text-muted-foreground max-w-xl mx-auto">{{ t('experience.description') }}</p>
      </div>

      <div v-if="pending" class="flex justify-center py-12">
        <div class="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>

      <!-- Timeline -->
      <div v-else class="relative max-w-3xl mx-auto">
        <!-- Timeline line -->
        <div class="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />

        <div class="space-y-8">
          <div
            v-for="(exp, i) in visibleExperiences"
            :key="exp.id"
            class="relative pl-20"
            data-animate
            :data-animate-delay="String(i * 100)"
          >
            <!-- Timeline dot -->
            <div class="absolute left-5 top-6 w-6 h-6 rounded-full border-2 border-primary bg-background flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-primary" :class="exp.current ? 'animate-pulse' : ''" />
            </div>

            <!-- Card -->
            <div class="glass rounded-xl p-6 glow-hover transition-all duration-300 hover:-translate-y-0.5">
              <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 class="text-xl font-bold text-foreground">{{ exp.role }}</h3>
                  <p class="text-primary font-semibold font-mono">{{ exp.company }}</p>
                </div>
                <div class="text-right">
                  <div class="flex items-center gap-2 justify-end flex-wrap">
                    <span
                      v-if="exp.current"
                      class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {{ t('experience.present') }}
                    </span>
                    <span class="text-sm text-muted-foreground font-mono">
                      {{ formatDate(exp.startDate) }} — {{ exp.current ? t('experience.present') : formatDate(exp.endDate || '') }}
                    </span>
                  </div>
                  <p class="text-xs text-muted-foreground mt-1 font-mono">
                    {{ getDuration(exp.startDate, exp.endDate, exp.current) }}
                  </p>
                </div>
              </div>

              <p v-if="exp.location" class="text-sm text-muted-foreground mb-3 flex items-center gap-1.5">
                <span class="text-primary font-mono text-xs">@</span>
                {{ exp.location }}
              </p>

              <p class="text-muted-foreground text-sm leading-relaxed mb-4">
                {{ exp.description }}
              </p>

              <!-- Technologies -->
              <div v-if="exp.technologies?.length" class="flex flex-wrap gap-2">
                <span
                  v-for="tech in exp.technologies"
                  :key="tech"
                  class="text-xs font-mono px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!pending && visibleExperiences.length === 0" class="text-center py-12 text-muted-foreground">
          <p class="font-mono">{{ t('admin.no_items') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
