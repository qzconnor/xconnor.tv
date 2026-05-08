<script setup lang="ts">
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-vue-next'
import type { Skill } from '~/types'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()

const { data: skills, refresh } = await useFetch<Skill[]>('/api/skills')

// Modal state
const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const isEdit = ref(false)
const deleteTarget = ref<Skill | null>(null)
const saving = ref(false)
const deleting = ref(false)

// Form state
const form = reactive({
  name: '',
  level: 3 as 1 | 2 | 3 | 4 | 5,
  category: 'frontend',
  icon: '',
  color: '#00DC82',
  id: '',
})

const levelOptions = [1, 2, 3, 4, 5].map(l => ({ value: l, label: `${l} - ${t(`skills.level_${l}` as any)}` }))
const categoryOptions = ['frontend', 'backend', 'database', 'devops', 'mobile', 'other'].map(c => ({
  value: c,
  label: t(`skills.categories.${c}` as any)
}))

function openAdd() {
  isEdit.value = false
  form.name = ''
  form.level = 3
  form.category = 'frontend'
  form.icon = ''
  form.color = '#00DC82'
  form.id = ''
  dialogOpen.value = true
}

function openEdit(skill: Skill) {
  isEdit.value = true
  form.name = skill.name
  form.level = skill.level
  form.category = skill.category
  form.icon = skill.icon || ''
  form.color = skill.color || '#00DC82'
  form.id = skill.id
  dialogOpen.value = true
}

function openDelete(skill: Skill) {
  deleteTarget.value = skill
  deleteDialogOpen.value = true
}

async function save() {
  if (!form.name || !form.level || !form.category) return
  saving.value = true
  try {
    if (isEdit.value) {
      await $fetch(`/api/skills/${form.id}`, {
        method: 'PUT',
        body: { name: form.name, level: Number(form.level), category: form.category, icon: form.icon, color: form.color },
      })
    } else {
      await $fetch('/api/skills', {
        method: 'POST',
        body: { name: form.name, level: Number(form.level), category: form.category, icon: form.icon, color: form.color },
      })
    }
    dialogOpen.value = false
    await refresh()
  } finally {
    saving.value = false
  }
}

async function toggleEnabled(skill: Skill) {
  await $fetch(`/api/skills/${skill.id}`, {
    method: 'PUT',
    body: { enabled: skill.enabled === false ? true : false },
  })
  await refresh()
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await $fetch(`/api/skills/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteDialogOpen.value = false
    deleteTarget.value = null
    await refresh()
  } finally {
    deleting.value = false
  }
}

function getLevelLabel(level: number) {
  return t(`skills.level_${level}` as any)
}

function getCategoryLabel(cat: string) {
  return t(`skills.categories.${cat}` as any) || cat
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold font-mono mb-1">
          <span class="text-primary">></span> {{ t('admin.skills') }}
        </h2>
        <p class="text-muted-foreground text-sm">{{ skills?.length || 0 }} {{ t('admin.entries') }}</p>
      </div>
      <button
        class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        @click="openAdd"
      >
        <Plus class="h-4 w-4" />
        {{ t('admin.add') }}
      </button>
    </div>

    <!-- Table -->
    <div class="glass rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border/50 bg-card/30">
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.name') }}</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.category') }}</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.level') }}</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Color</th>
            <th class="px-6 py-4" />
          </tr>
        </thead>
        <tbody class="divide-y divide-border/30">
          <tr v-if="!skills || skills.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-muted-foreground font-mono">
              {{ t('admin.no_items') }}
            </td>
          </tr>
          <tr
            v-for="skill in skills"
            :key="skill.id"
            class="hover:bg-card/30 transition-colors group"
            :class="skill.enabled === false ? 'opacity-40' : ''"
          >
            <td class="px-6 py-4 font-medium">{{ skill.name }}</td>
            <td class="px-6 py-4">
              <span class="text-xs font-mono px-2 py-1 rounded bg-secondary text-muted-foreground">
                {{ getCategoryLabel(skill.category) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="flex gap-0.5">
                  <div
                    v-for="s in 5"
                    :key="s"
                    class="w-3 h-1.5 rounded-full"
                    :style="{
                      background: s <= skill.level ? (skill.color || 'hsl(var(--primary))') : 'hsl(var(--secondary))',
                      opacity: s <= skill.level ? 1 : 0.3
                    }"
                  />
                </div>
                <span class="text-xs text-muted-foreground">{{ getLevelLabel(skill.level) }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div v-if="skill.color" class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full border border-border/50" :style="{ background: skill.color }" />
                <span class="text-xs font-mono text-muted-foreground">{{ skill.color }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1 justify-end">
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                  :class="skill.enabled === false ? 'text-muted-foreground/40 hover:text-foreground' : 'text-primary/60 hover:text-primary'"
                  :title="skill.enabled === false ? 'Enable' : 'Disable'"
                  @click="toggleEnabled(skill)"
                >
                  <Eye v-if="skill.enabled !== false" class="h-3.5 w-3.5" />
                  <EyeOff v-else class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                  @click="openEdit(skill)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                  @click="openDelete(skill)"
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
      :title="isEdit ? t('admin.edit') + ' Skill' : t('admin.add') + ' Skill'"
      @update:open="dialogOpen = $event"
    >
      <form class="space-y-4" @submit.prevent="save">
        <div class="space-y-2">
          <UiLabel :for="'skill-name'">{{ t('admin.fields.name') }}</UiLabel>
          <UiInput id="skill-name" v-model="form.name" :placeholder="t('admin.fields.name')" required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel>{{ t('admin.fields.level') }}</UiLabel>
            <UiSelect
              v-model="form.level"
              :options="levelOptions"
            />
          </div>
          <div class="space-y-2">
            <UiLabel>{{ t('admin.fields.category') }}</UiLabel>
            <UiSelect
              v-model="form.category"
              :options="categoryOptions"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel :for="'skill-icon'">{{ t('admin.fields.icon') }}</UiLabel>
            <UiInput id="skill-icon" v-model="form.icon" placeholder="e.g. vue" />
          </div>
          <div class="space-y-2">
            <UiLabel :for="'skill-color'">{{ t('admin.fields.color') }}</UiLabel>
            <div class="flex gap-2">
              <input
                id="skill-color"
                v-model="form.color"
                type="color"
                class="h-10 w-12 rounded-md border border-input bg-background cursor-pointer"
              />
              <UiInput v-model="form.color" placeholder="#00DC82" class="flex-1" />
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
