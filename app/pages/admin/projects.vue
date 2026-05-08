<script setup lang="ts">
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-vue-next'
import type { Project } from '~/types'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()

const { data: projects, refresh } = await useFetch<Project[]>('/api/projects')

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const isEdit = ref(false)
const deleteTarget = ref<Project | null>(null)
const saving = ref(false)
const deleting = ref(false)

const form = reactive({
  id: '',
  title: '',
  description: '',
  tags: '',
  url: '',
  repo: '',
  color: '#00DC82',
  featured: false,
})

function openAdd() {
  isEdit.value = false
  form.id = ''
  form.title = ''
  form.description = ''
  form.tags = ''
  form.url = ''
  form.repo = ''
  form.color = '#00DC82'
  form.featured = false
  dialogOpen.value = true
}

function openEdit(project: Project) {
  isEdit.value = true
  form.id = project.id
  form.title = project.title
  form.description = project.description
  form.tags = project.tags?.join(', ') || ''
  form.url = project.url || ''
  form.repo = project.repo || ''
  form.color = project.color || '#00DC82'
  form.featured = project.featured ?? false
  dialogOpen.value = true
}

function openDelete(project: Project) {
  deleteTarget.value = project
  deleteDialogOpen.value = true
}

async function save() {
  if (!form.title || !form.description) return
  saving.value = true
  try {
    const body = {
      title: form.title,
      description: form.description,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      url: form.url || undefined,
      repo: form.repo || undefined,
      color: form.color,
      featured: form.featured,
    }
    if (isEdit.value) {
      await $fetch(`/api/projects/${form.id}`, { method: 'PUT', body })
    } else {
      await $fetch('/api/projects', { method: 'POST', body })
    }
    dialogOpen.value = false
    await refresh()
  } finally {
    saving.value = false
  }
}

async function toggleEnabled(project: Project) {
  await $fetch(`/api/projects/${project.id}`, {
    method: 'PUT',
    body: { enabled: project.enabled === false ? true : false },
  })
  await refresh()
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await $fetch(`/api/projects/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteDialogOpen.value = false
    deleteTarget.value = null
    await refresh()
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold font-mono mb-1">
          <span class="text-primary">></span> {{ t('admin.projects') }}
        </h2>
        <p class="text-muted-foreground text-sm">{{ projects?.length || 0 }} {{ t('admin.entries') }}</p>
      </div>
      <button
        class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        @click="openAdd"
      >
        <Plus class="h-4 w-4" />
        {{ t('admin.add') }}
      </button>
    </div>

    <div class="glass rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border/50 bg-card/30">
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.name') }}</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Tags</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Links</th>
            <th class="px-6 py-4" />
          </tr>
        </thead>
        <tbody class="divide-y divide-border/30">
          <tr v-if="!projects || projects.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-muted-foreground font-mono">
              {{ t('admin.no_items') }}
            </td>
          </tr>
          <tr
            v-for="project in projects"
            :key="project.id"
            class="hover:bg-card/30 transition-colors group"
            :class="project.enabled === false ? 'opacity-40' : ''"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div v-if="project.color" class="w-3 h-3 rounded-full shrink-0" :style="{ background: project.color }" />
                <span class="font-medium">{{ project.title }}</span>
                <Star v-if="project.featured" class="h-3 w-3 text-yellow-400 shrink-0" />
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in (project.tags || []).slice(0, 3)"
                  :key="tag"
                  class="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                >
                  {{ tag }}
                </span>
                <span v-if="(project.tags?.length || 0) > 3" class="text-xs text-muted-foreground">
                  +{{ project.tags!.length - 3 }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-xs text-muted-foreground font-mono space-y-0.5">
              <div v-if="project.url">↗ {{ project.url }}</div>
              <div v-if="project.repo" class="text-muted-foreground/60">⌥ {{ project.repo }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1 justify-end">
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                  :class="project.enabled === false ? 'text-muted-foreground/40 hover:text-foreground' : 'text-primary/60 hover:text-primary'"
                  :title="project.enabled === false ? 'Enable' : 'Disable'"
                  @click="toggleEnabled(project)"
                >
                  <Eye v-if="project.enabled !== false" class="h-3.5 w-3.5" />
                  <EyeOff v-else class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                  @click="openEdit(project)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                  @click="openDelete(project)"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Dialog -->
    <UiDialog
      :open="dialogOpen"
      :title="isEdit ? t('admin.edit') + ' Project' : t('admin.add') + ' Project'"
      @update:open="dialogOpen = $event"
    >
      <form class="space-y-4" @submit.prevent="save">
        <div class="space-y-2">
          <UiLabel for="proj-title">{{ t('admin.fields.name') }}</UiLabel>
          <UiInput id="proj-title" v-model="form.title" placeholder="My Awesome Project" required />
        </div>

        <div class="space-y-2">
          <UiLabel for="proj-desc">{{ t('admin.fields.description') }}</UiLabel>
          <UiTextarea id="proj-desc" v-model="form.description" :placeholder="t('admin.fields.description')" :rows="3" required />
        </div>

        <div class="space-y-2">
          <UiLabel for="proj-tags">Tags <span class="text-muted-foreground text-xs">(kommagetrennt)</span></UiLabel>
          <UiInput id="proj-tags" v-model="form.tags" placeholder="Vue.js, Nuxt, TypeScript" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel for="proj-url">{{ t('projects.live_url') }}</UiLabel>
            <UiInput id="proj-url" v-model="form.url" type="url" placeholder="https://..." />
          </div>
          <div class="space-y-2">
            <UiLabel for="proj-repo">{{ t('projects.repo_url') }}</UiLabel>
            <UiInput id="proj-repo" v-model="form.repo" type="url" placeholder="https://github.com/..." />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel for="proj-color">{{ t('admin.fields.color') }}</UiLabel>
            <div class="flex gap-2">
              <input
                id="proj-color"
                v-model="form.color"
                type="color"
                class="h-10 w-12 rounded-md border border-input bg-background cursor-pointer"
              />
              <UiInput v-model="form.color" placeholder="#00DC82" class="flex-1" />
            </div>
          </div>
          <div class="space-y-2">
            <UiLabel>{{ t('projects.featured') }}</UiLabel>
            <div class="flex items-center gap-2 h-10">
              <input
                id="proj-featured"
                v-model="form.featured"
                type="checkbox"
                class="h-4 w-4 rounded border-input accent-primary"
              />
              <label for="proj-featured" class="text-sm text-muted-foreground">{{ t('projects.featured_desc') }}</label>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors"
            @click="dialogOpen = false"
          >
            {{ t('admin.cancel') }}
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            :disabled="saving"
          >
            {{ saving ? t('common.loading') : t('admin.save') }}
          </button>
        </div>
      </form>
    </UiDialog>

    <!-- Delete Confirmation -->
    <UiDialog
      :open="deleteDialogOpen"
      :title="t('admin.confirm_delete')"
      :description="t('admin.confirm_delete_desc')"
      @update:open="deleteDialogOpen = $event"
    >
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors"
          @click="deleteDialogOpen = false"
        >
          {{ t('admin.cancel') }}
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50"
          :disabled="deleting"
          @click="confirmDelete"
        >
          {{ deleting ? t('common.loading') : t('admin.delete') }}
        </button>
      </div>
    </UiDialog>
  </div>
</template>
