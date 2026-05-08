<script setup lang="ts">
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-vue-next'
import type { ToolCategory } from '~/types'

definePageMeta({ layout: 'admin' })

const { data, refresh } = await useFetch<ToolCategory[]>('/api/tool-categories')

const local = ref<ToolCategory[]>([])
watch(data, val => { if (val) local.value = [...val] }, { immediate: true })

// --- Drag and drop ---
const dragSrcIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function onDragStart(i: number) { dragSrcIndex.value = i }
function onDragOver(i: number) { dragOverIndex.value = i }
function onDragEnd() { dragSrcIndex.value = null; dragOverIndex.value = null }

function onDrop(targetIndex: number) {
  if (dragSrcIndex.value === null || dragSrcIndex.value === targetIndex) {
    dragSrcIndex.value = null; dragOverIndex.value = null; return
  }
  const list = [...local.value]
  const [moved] = list.splice(dragSrcIndex.value, 1)
  list.splice(targetIndex, 0, moved!)
  local.value = list
  dragSrcIndex.value = null; dragOverIndex.value = null
  saveOrder()
}

async function saveOrder() {
  await $fetch('/api/tool-categories/order', {
    method: 'PUT',
    body: { ids: local.value.map(c => c.id) },
  })
}

// --- CRUD ---
const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const isEdit = ref(false)
const deleteTarget = ref<ToolCategory | null>(null)
const saving = ref(false)
const deleting = ref(false)

const form = reactive({ id: '', value: '', labelEn: '', labelDe: '' })

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function openAdd() {
  isEdit.value = false
  Object.assign(form, { id: '', value: '', labelEn: '', labelDe: '' })
  dialogOpen.value = true
}

function openEdit(cat: ToolCategory) {
  isEdit.value = true
  Object.assign(form, { id: cat.id, value: cat.value, labelEn: cat.labelEn, labelDe: cat.labelDe })
  dialogOpen.value = true
}

function openDelete(cat: ToolCategory) {
  deleteTarget.value = cat
  deleteDialogOpen.value = true
}

function onLabelEnInput() {
  if (!isEdit.value && !form.value) {
    form.value = slugify(form.labelEn)
  }
}

async function save() {
  if (!form.labelEn || !form.labelDe || (!isEdit.value && !form.value)) return
  saving.value = true
  try {
    if (isEdit.value) {
      await $fetch(`/api/tool-categories/${form.id}`, {
        method: 'PUT',
        body: { labelEn: form.labelEn, labelDe: form.labelDe },
      })
    } else {
      await $fetch('/api/tool-categories', {
        method: 'POST',
        body: { value: form.value, labelEn: form.labelEn, labelDe: form.labelDe },
      })
    }
    dialogOpen.value = false
    await refresh()
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await $fetch(`/api/tool-categories/${deleteTarget.value.id}`, { method: 'DELETE' })
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
          <span class="text-primary">></span> Tool Categories
        </h2>
        <p class="text-muted-foreground text-sm">{{ local.length }} categories — drag to reorder</p>
      </div>
      <button
        class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        @click="openAdd"
      >
        <Plus class="h-4 w-4" />
        Add Category
      </button>
    </div>

    <div class="glass rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border/50 bg-card/30">
            <th class="w-8 px-3 py-4" />
            <th class="text-left px-4 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Key</th>
            <th class="text-left px-4 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">English</th>
            <th class="text-left px-4 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Deutsch</th>
            <th class="px-4 py-4" />
          </tr>
        </thead>
        <tbody class="divide-y divide-border/30">
          <tr v-if="local.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-muted-foreground font-mono">No categories yet.</td>
          </tr>
          <tr
            v-for="(cat, index) in local"
            :key="cat.id"
            draggable="true"
            class="transition-colors group"
            :class="[
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
            <td class="px-3 py-4 w-8">
              <GripVertical class="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors" />
            </td>
            <td class="px-4 py-4">
              <span class="text-xs font-mono px-2 py-1 rounded bg-secondary text-muted-foreground">{{ cat.value }}</span>
            </td>
            <td class="px-4 py-4 font-medium">{{ cat.labelEn }}</td>
            <td class="px-4 py-4 text-muted-foreground">{{ cat.labelDe }}</td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-1 justify-end">
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                  @click="openEdit(cat)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                  @click="openDelete(cat)"
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
      :title="isEdit ? 'Edit Category' : 'Add Category'"
      @update:open="dialogOpen = $event"
    >
      <form class="space-y-4" @submit.prevent="save">
        <div class="space-y-2">
          <UiLabel for="cat-key">
            Key
            <span class="ml-1 text-muted-foreground text-[10px] font-mono">(used internally, cannot change after creation)</span>
          </UiLabel>
          <UiInput
            id="cat-key"
            v-model="form.value"
            placeholder="e.g. framework"
            :disabled="isEdit"
            :class="isEdit ? 'opacity-50 cursor-not-allowed' : ''"
            required
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel for="cat-en">English</UiLabel>
            <UiInput
              id="cat-en"
              v-model="form.labelEn"
              placeholder="e.g. Framework"
              required
              @input="onLabelEnInput"
            />
          </div>
          <div class="space-y-2">
            <UiLabel for="cat-de">Deutsch</UiLabel>
            <UiInput id="cat-de" v-model="form.labelDe" placeholder="z.B. Framework" required />
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors" @click="dialogOpen = false">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </form>
    </UiDialog>

    <!-- Delete Confirmation -->
    <UiDialog
      :open="deleteDialogOpen"
      title="Delete Category"
      description="This will not delete tools in this category — their category field will just not match any label. Are you sure?"
      @update:open="deleteDialogOpen = $event"
    >
      <div class="flex justify-end gap-2">
        <button class="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors" @click="deleteDialogOpen = false">
          Cancel
        </button>
        <button class="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50" :disabled="deleting" @click="confirmDelete">
          {{ deleting ? 'Deleting…' : 'Delete' }}
        </button>
      </div>
    </UiDialog>
  </div>
</template>
