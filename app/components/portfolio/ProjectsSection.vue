<script setup lang="ts">
import { ExternalLink, Github, Star } from 'lucide-vue-next'
import type { Project } from '~/types'

const { t } = useI18n()

const { data: projects, pending } = await useFetch<Project[]>('/api/projects')

const visibleProjects = computed(() => projects.value?.filter(p => p.enabled !== false) ?? [])
const featured = computed(() => visibleProjects.value.filter(p => p.featured))
const rest = computed(() => visibleProjects.value.filter(p => !p.featured))
</script>

<template>
  <section id="projects" class="py-24 relative">
    <div class="absolute inset-0 dots-bg opacity-20" />
    <div class="container relative z-10">
      <!-- Header -->
      <div class="text-center mb-16" data-animate>
        <p class="font-mono text-primary text-sm font-medium mb-2">{{ t('projects.subtitle') }}</p>
        <h2 class="text-4xl md:text-5xl font-bold mb-4">{{ t('projects.title') }}</h2>
        <p class="text-muted-foreground max-w-xl mx-auto">{{ t('projects.description') }}</p>
      </div>

      <div v-if="pending" class="flex justify-center py-12">
        <div class="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>

      <div v-else-if="visibleProjects.length === 0" class="text-center py-12 text-muted-foreground">
        <p class="font-mono">{{ t('admin.no_items') }}</p>
      </div>

      <template v-else>
        <!-- Featured projects -->
        <div v-if="featured.length" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div
            v-for="(project, i) in featured"
            :key="project.id"
            class="glass rounded-2xl p-6 glow-hover group transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            data-animate
            :data-animate-delay="String(i * 100)"
          >
            <!-- Accent bar -->
            <div
              class="absolute top-0 left-0 right-0 h-0.5"
              :style="{ background: project.color || 'hsl(var(--primary))' }"
            />

            <!-- Featured badge -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <span
                class="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full border"
                :style="{
                  color: project.color || 'hsl(var(--primary))',
                  borderColor: (project.color || 'hsl(var(--primary))') + '40',
                  background: (project.color || 'hsl(var(--primary))') + '15',
                }"
              >
                <Star class="h-3 w-3" />
                Featured
              </span>
              <div class="flex items-center gap-2">
                <a
                  v-if="project.repo"
                  :href="project.repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  :title="t('projects.repo')"
                >
                  <Github class="h-4 w-4" />
                </a>
                <a
                  v-if="project.url"
                  :href="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  :title="t('projects.visit')"
                >
                  <ExternalLink class="h-4 w-4" />
                </a>
              </div>
            </div>

            <h3
              class="text-xl font-bold mb-2 group-hover:transition-colors"
              :style="{ color: project.color ? undefined : 'inherit' }"
            >
              {{ project.title }}
            </h3>
            <p class="text-muted-foreground text-sm leading-relaxed mb-4">{{ project.description }}</p>

            <div v-if="project.tags?.length" class="flex flex-wrap gap-2">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="text-xs font-mono px-2 py-0.5 rounded-md bg-secondary text-muted-foreground"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Regular projects grid -->
        <div v-if="rest.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(project, i) in rest"
            :key="project.id"
            class="glass rounded-xl p-5 glow-hover group transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            data-animate
            :data-animate-delay="String((featured.length + i) * 100 % 500)"
          >
            <div
              class="absolute top-0 left-0 right-0 h-0.5 opacity-70"
              :style="{ background: project.color || 'hsl(var(--primary))' }"
            />

            <div class="flex items-start justify-between gap-2 mb-3">
              <h3 class="font-semibold group-hover:text-primary transition-colors">{{ project.title }}</h3>
              <div class="flex items-center gap-1 shrink-0">
                <a
                  v-if="project.repo"
                  :href="project.repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Github class="h-3.5 w-3.5" />
                </a>
                <a
                  v-if="project.url"
                  :href="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <ExternalLink class="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <p class="text-muted-foreground text-sm leading-relaxed mb-3">{{ project.description }}</p>

            <div v-if="project.tags?.length" class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
