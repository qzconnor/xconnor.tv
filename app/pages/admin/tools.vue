<script setup lang="ts">
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-vue-next'
import type { Tool, ToolCategory } from '~/types'

definePageMeta({ layout: 'admin' })

const { t, locale } = useI18n()

const [{ data: toolsData, refresh }, { data: categoriesData }] = await Promise.all([
  useFetch<Tool[]>('/api/tools'),
  useFetch<ToolCategory[]>('/api/tool-categories'),
])

// Local copy so we can reorder immediately without waiting for API
const localTools = ref<Tool[]>([])
watch(toolsData, val => { if (val) localTools.value = [...val] }, { immediate: true })

// --- Category filter ---
const activeCategory = ref('all')

const availableCategories = computed(() => {
  const presentCats = new Set(localTools.value.map(t => t.category))
  const order = (categoriesData.value ?? []).map(c => c.value)
  const sorted = [
    ...order.filter(c => presentCats.has(c)),
    ...[...presentCats].filter(c => !order.includes(c)),
  ]
  return ['all', ...sorted]
})

const filteredTools = computed(() =>
  activeCategory.value === 'all'
    ? localTools.value
    : localTools.value.filter(t => t.category === activeCategory.value)
)

// --- Drag and drop ---
const dragSrcIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function onDragStart(index: number) {
  dragSrcIndex.value = index
}

function onDragOver(index: number) {
  dragOverIndex.value = index
}

function onDrop(targetIndex: number) {
  if (dragSrcIndex.value === null || dragSrcIndex.value === targetIndex) {
    dragSrcIndex.value = null
    dragOverIndex.value = null
    return
  }

  // Reorder within the filtered view
  const filtered = [...filteredTools.value]
  const [moved] = filtered.splice(dragSrcIndex.value, 1)
  filtered.splice(targetIndex, 0, moved!)

  // Rebuild localTools replacing the filtered positions with new order
  const filteredIdSet = new Set(filteredTools.value.map(t => t.id))
  const result: Tool[] = []
  let fi = 0
  for (const tool of localTools.value) {
    result.push(filteredIdSet.has(tool.id) ? filtered[fi++]! : tool)
  }
  localTools.value = result

  dragSrcIndex.value = null
  dragOverIndex.value = null

  saveOrder()
}

function onDragEnd() {
  dragSrcIndex.value = null
  dragOverIndex.value = null
}

async function saveOrder() {
  await $fetch('/api/tools/order', {
    method: 'PUT',
    body: { ids: localTools.value.map(t => t.id) },
  })
}

// --- CRUD ---
const categoryOptions = computed(() =>
  (categoriesData.value ?? []).map(c => ({
    value: c.value,
    label: locale.value === 'de' ? c.labelDe : c.labelEn,
  }))
)

const categoryLabels = computed(() =>
  Object.fromEntries(
    (categoriesData.value ?? []).map(c => [
      c.value,
      locale.value === 'de' ? c.labelDe : c.labelEn,
    ])
  )
)

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const isEdit = ref(false)
const deleteTarget = ref<Tool | null>(null)
const saving = ref(false)
const deleting = ref(false)

const form = reactive({ name: '', category: 'editor', icon: '', description: '', url: '', id: '' })

function openAdd() {
  isEdit.value = false
  Object.assign(form, { name: '', category: 'editor', icon: '', description: '', url: '', id: '' })
  dialogOpen.value = true
}

function openEdit(tool: Tool) {
  isEdit.value = true
  Object.assign(form, {
    name: tool.name, category: tool.category, icon: tool.icon || '',
    description: tool.description || '', url: tool.url || '', id: tool.id,
  })
  dialogOpen.value = true
}

function openDelete(tool: Tool) {
  deleteTarget.value = tool
  deleteDialogOpen.value = true
}

async function save() {
  if (!form.name || !form.category) return
  saving.value = true
  try {
    const body = { name: form.name, category: form.category, icon: form.icon, description: form.description, url: form.url }
    if (isEdit.value) {
      await $fetch(`/api/tools/${form.id}`, { method: 'PUT', body })
    } else {
      await $fetch('/api/tools', { method: 'POST', body })
    }
    dialogOpen.value = false
    await refresh()
  } finally {
    saving.value = false
  }
}

async function toggleEnabled(tool: Tool) {
  await $fetch(`/api/tools/${tool.id}`, { method: 'PUT', body: { enabled: tool.enabled === false } })
  await refresh()
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await $fetch(`/api/tools/${deleteTarget.value.id}`, { method: 'DELETE' })
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
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold font-mono mb-1">
          <span class="text-primary">></span> {{ t('admin.tools') }}
        </h2>
        <p class="text-muted-foreground text-sm">
          {{ filteredTools.length }} / {{ localTools.length }} {{ t('admin.entries') }}
        </p>
      </div>
      <button
        class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        @click="openAdd"
      >
        <Plus class="h-4 w-4" />
        {{ t('admin.add') }}
      </button>
    </div>

    <!-- Category filter -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="cat in availableCategories"
        :key="cat"
        class="px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors"
        :class="activeCategory === cat
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'"
        @click="activeCategory = cat"
      >
        {{ cat === 'all' ? 'All' : (categoryLabels[cat] ?? cat) }}
      </button>
    </div>

    <div class="glass rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border/50 bg-card/30">
            <th class="w-8 px-3 py-4" />
            <th class="text-left px-4 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.name') }}</th>
            <th class="text-left px-4 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.category') }}</th>
            <th class="text-left px-4 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.description') }}</th>
            <th class="px-4 py-4" />
          </tr>
        </thead>
        <tbody class="divide-y divide-border/30">
          <tr v-if="filteredTools.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-muted-foreground font-mono">
              {{ t('admin.no_items') }}
            </td>
          </tr>
          <tr
            v-for="(tool, index) in filteredTools"
            :key="tool.id"
            draggable="true"
            class="transition-colors group"
            :class="[
              tool.enabled === false ? 'opacity-40' : '',
              dragOverIndex === index && dragSrcIndex !== index
                ? 'bg-primary/10 border-t-2 border-primary'
                : 'hover:bg-card/30',
              dragSrcIndex === index ? 'opacity-50' : '',
            ]"
            @dragstart="onDragStart(index)"
            @dragover.prevent="onDragOver(index)"
            @drop.prevent="onDrop(index)"
            @dragend="onDragEnd"
          >
            <!-- Drag handle -->
            <td class="px-3 py-4 w-8">
              <GripVertical class="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors" />
            </td>
            <td class="px-4 py-4 font-medium">{{ tool.name }}</td>
            <td class="px-4 py-4">
              <span class="text-xs font-mono px-2 py-1 rounded bg-secondary text-muted-foreground">
                {{ categoryLabels[tool.category] ?? tool.category }}
              </span>
            </td>
            <td class="px-4 py-4 text-muted-foreground text-sm truncate max-w-xs">
              {{ tool.description || '—' }}
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-1 justify-end">
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                  :class="tool.enabled === false ? 'text-muted-foreground/40 hover:text-foreground' : 'text-primary/60 hover:text-primary'"
                  :title="tool.enabled === false ? 'Enable' : 'Disable'"
                  @click="toggleEnabled(tool)"
                >
                  <Eye v-if="tool.enabled !== false" class="h-3.5 w-3.5" />
                  <EyeOff v-else class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                  @click="openEdit(tool)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                  @click="openDelete(tool)"
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
      :title="isEdit ? t('admin.edit') + ' Tool' : t('admin.add') + ' Tool'"
      @update:open="dialogOpen = $event"
    >
      <form class="space-y-4" @submit.prevent="save">
        <div class="space-y-2">
          <UiLabel for="tool-name">{{ t('admin.fields.name') }}</UiLabel>
          <UiInput id="tool-name" v-model="form.name" :placeholder="t('admin.fields.name')" required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel>{{ t('admin.fields.category') }}</UiLabel>
            <UiSelect v-model="form.category" :options="categoryOptions" />
          </div>
          <div class="space-y-2">
            <UiLabel for="tool-icon">
              {{ t('admin.fields.icon') }}
              <a href="https://simpleicons.org" target="_blank" rel="noopener noreferrer" class="ml-1 text-primary/60 hover:text-primary text-[10px] font-mono">(simpleicons.org ↗)</a>
            </UiLabel>
            <UiInput id="tool-icon" v-model="form.icon" placeholder="e.g. vscode, figma, github" />
          </div>
        </div>
        <div class="space-y-2">
          <UiLabel for="tool-desc">{{ t('admin.fields.description') }}</UiLabel>
          <UiTextarea id="tool-desc" v-model="form.description" :placeholder="t('admin.fields.description')" :rows="3" />
        </div>
        <div class="space-y-2">
          <UiLabel for="tool-url">{{ t('admin.fields.url') }}</UiLabel>
          <UiInput id="tool-url" v-model="form.url" type="url" placeholder="https://..." />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors" @click="dialogOpen = false">
            {{ t('admin.cancel') }}
          </button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50" :disabled="saving">
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
        <button class="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors" @click="deleteDialogOpen = false">
          {{ t('admin.cancel') }}
        </button>
        <button class="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50" :disabled="deleting" @click="confirmDelete">
          {{ deleting ? t('common.loading') : t('admin.delete') }}
        </button>
      </div>
    </UiDialog>
  </div>
</template>
