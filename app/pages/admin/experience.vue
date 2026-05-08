<script setup lang="ts">
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-vue-next'
import type { Experience } from '~/types'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()

const { data: experiences, refresh } = await useFetch<Experience[]>('/api/experience')

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const isEdit = ref(false)
const deleteTarget = ref<Experience | null>(null)
const saving = ref(false)
const deleting = ref(false)

const form = reactive({
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  technologies: '',
  location: '',
  id: '',
})

function openAdd() {
  isEdit.value = false
  form.company = ''
  form.role = ''
  form.startDate = ''
  form.endDate = ''
  form.current = false
  form.description = ''
  form.technologies = ''
  form.location = ''
  form.id = ''
  dialogOpen.value = true
}

function openEdit(exp: Experience) {
  isEdit.value = true
  form.company = exp.company
  form.role = exp.role
  form.startDate = exp.startDate
  form.endDate = exp.endDate || ''
  form.current = exp.current
  form.description = exp.description
  form.technologies = exp.technologies.join(', ')
  form.location = exp.location || ''
  form.id = exp.id
  dialogOpen.value = true
}

function openDelete(exp: Experience) {
  deleteTarget.value = exp
  deleteDialogOpen.value = true
}

async function save() {
  if (!form.company || !form.role || !form.startDate) return
  saving.value = true
  try {
    const techs = form.technologies.split(',').map(t => t.trim()).filter(Boolean)
    const payload = {
      company: form.company,
      role: form.role,
      startDate: form.startDate,
      endDate: form.current ? undefined : form.endDate || undefined,
      current: form.current,
      description: form.description,
      technologies: techs,
      location: form.location || undefined,
    }
    if (isEdit.value) {
      await $fetch(`/api/experience/${form.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/experience', { method: 'POST', body: payload })
    }
    dialogOpen.value = false
    await refresh()
  } finally {
    saving.value = false
  }
}

async function toggleEnabled(exp: Experience) {
  await $fetch(`/api/experience/${exp.id}`, {
    method: 'PUT',
    body: { enabled: exp.enabled === false ? true : false },
  })
  await refresh()
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await $fetch(`/api/experience/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteDialogOpen.value = false
    deleteTarget.value = null
    await refresh()
  } finally {
    deleting.value = false
  }
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  const year = parts[0] ?? '2020'
  const month = parts[1] ?? '01'
  const d = new Date(parseInt(year), parseInt(month) - 1)
  return d.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold font-mono mb-1">
          <span class="text-primary">></span> {{ t('admin.experience') }}
        </h2>
        <p class="text-muted-foreground text-sm">{{ experiences?.length || 0 }} {{ t('admin.entries') }}</p>
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
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.company') }}</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.role') }}</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Zeitraum</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Status</th>
            <th class="px-6 py-4" />
          </tr>
        </thead>
        <tbody class="divide-y divide-border/30">
          <tr v-if="!experiences || experiences.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-muted-foreground font-mono">
              {{ t('admin.no_items') }}
            </td>
          </tr>
          <tr
            v-for="exp in experiences"
            :key="exp.id"
            class="hover:bg-card/30 transition-colors group"
            :class="exp.enabled === false ? 'opacity-40' : ''"
          >
            <td class="px-6 py-4 font-medium">{{ exp.company }}</td>
            <td class="px-6 py-4 text-muted-foreground">{{ exp.role }}</td>
            <td class="px-6 py-4 font-mono text-xs text-muted-foreground">
              {{ formatDate(exp.startDate) }} — {{ exp.current ? t('experience.present') : formatDate(exp.endDate || '') }}
            </td>
            <td class="px-6 py-4">
              <span
                v-if="exp.current"
                class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {{ t('experience.present') }}
              </span>
              <span v-else class="text-xs text-muted-foreground">Abgeschlossen</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1 justify-end">
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                  :class="exp.enabled === false ? 'text-muted-foreground/40 hover:text-foreground' : 'text-primary/60 hover:text-primary'"
                  :title="exp.enabled === false ? 'Enable' : 'Disable'"
                  @click="toggleEnabled(exp)"
                >
                  <Eye v-if="exp.enabled !== false" class="h-3.5 w-3.5" />
                  <EyeOff v-else class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                  @click="openEdit(exp)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                  @click="openDelete(exp)"
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
      :title="isEdit ? t('admin.edit') + ' Experience' : t('admin.add') + ' Experience'"
      class="max-w-2xl"
      @update:open="dialogOpen = $event"
    >
      <form class="space-y-4" @submit.prevent="save">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel :for="'exp-company'">{{ t('admin.fields.company') }}</UiLabel>
            <UiInput id="exp-company" v-model="form.company" :placeholder="t('admin.fields.company')" required />
          </div>
          <div class="space-y-2">
            <UiLabel :for="'exp-role'">{{ t('admin.fields.role') }}</UiLabel>
            <UiInput id="exp-role" v-model="form.role" :placeholder="t('admin.fields.role')" required />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel :for="'exp-start'">{{ t('admin.fields.start_date') }}</UiLabel>
            <UiInput id="exp-start" v-model="form.startDate" type="month" required />
          </div>
          <div class="space-y-2">
            <UiLabel :for="'exp-end'">{{ t('admin.fields.end_date') }}</UiLabel>
            <UiInput id="exp-end" v-model="form.endDate" type="month" :disabled="form.current" />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="exp-current"
            v-model="form.current"
            type="checkbox"
            class="h-4 w-4 rounded border-input accent-primary"
          />
          <UiLabel :for="'exp-current'">{{ t('admin.fields.current') }}</UiLabel>
        </div>

        <div class="space-y-2">
          <UiLabel :for="'exp-desc'">{{ t('admin.fields.description') }}</UiLabel>
          <UiTextarea id="exp-desc" v-model="form.description" :placeholder="t('admin.fields.description')" :rows="3" />
        </div>

        <div class="space-y-2">
          <UiLabel :for="'exp-tech'">{{ t('admin.fields.technologies') }}</UiLabel>
          <UiInput id="exp-tech" v-model="form.technologies" placeholder="Vue.js, Nuxt.js, TypeScript" />
        </div>

        <div class="space-y-2">
          <UiLabel :for="'exp-loc'">{{ t('admin.fields.location') }}</UiLabel>
          <UiInput id="exp-loc" v-model="form.location" placeholder="Remote / Berlin" />
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
