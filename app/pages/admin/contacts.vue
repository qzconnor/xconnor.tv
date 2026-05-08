<script setup lang="ts">
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import type { Contact } from '~/types'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()

const { data: contacts, refresh } = await useFetch<Contact[]>('/api/contacts')

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const isEdit = ref(false)
const deleteTarget = ref<Contact | null>(null)
const saving = ref(false)
const deleting = ref(false)

const form = reactive({
  id: '',
  label: '',
  value: '',
  href: '',
  icon: 'Globe',
  colorPreset: 'primary',
})

const iconOptions = [
  'Github', 'Mail', 'Twitter', 'Linkedin', 'Instagram', 'Youtube',
  'Globe', 'Phone', 'Link2', 'MessageSquare', 'Twitch',
].map(v => ({ value: v, label: v }))

const colorOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'purple',  label: 'Purple' },
  { value: 'sky',     label: 'Sky' },
  { value: 'blue',    label: 'Blue' },
  { value: 'green',   label: 'Green' },
  { value: 'red',     label: 'Red' },
  { value: 'orange',  label: 'Orange' },
  { value: 'pink',    label: 'Pink' },
  { value: 'yellow',  label: 'Yellow' },
  { value: 'teal',    label: 'Teal' },
]

function openAdd() {
  isEdit.value = false
  form.id = ''
  form.label = ''
  form.value = ''
  form.href = ''
  form.icon = 'Globe'
  form.colorPreset = 'primary'
  dialogOpen.value = true
}

function openEdit(contact: Contact) {
  isEdit.value = true
  form.id = contact.id
  form.label = contact.label
  form.value = contact.value
  form.href = contact.href
  form.icon = contact.icon
  form.colorPreset = contact.colorPreset
  dialogOpen.value = true
}

function openDelete(contact: Contact) {
  deleteTarget.value = contact
  deleteDialogOpen.value = true
}

async function save() {
  if (!form.label || !form.href) return
  saving.value = true
  try {
    const body = { label: form.label, value: form.value, href: form.href, icon: form.icon, colorPreset: form.colorPreset }
    if (isEdit.value) {
      await $fetch(`/api/contacts/${form.id}`, { method: 'PUT', body })
    } else {
      await $fetch('/api/contacts', { method: 'POST', body })
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
    await $fetch(`/api/contacts/${deleteTarget.value.id}`, { method: 'DELETE' })
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
          <span class="text-primary">></span> {{ t('admin.contacts') }}
        </h2>
        <p class="text-muted-foreground text-sm">{{ contacts?.length || 0 }} {{ t('admin.entries') }}</p>
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
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.contact_value') }}</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">{{ t('admin.fields.url') }}</th>
            <th class="text-left px-6 py-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Icon / Color</th>
            <th class="px-6 py-4" />
          </tr>
        </thead>
        <tbody class="divide-y divide-border/30">
          <tr v-if="!contacts || contacts.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-muted-foreground font-mono">
              {{ t('admin.no_items') }}
            </td>
          </tr>
          <tr
            v-for="contact in contacts"
            :key="contact.id"
            class="hover:bg-card/30 transition-colors group"
          >
            <td class="px-6 py-4 font-medium">{{ contact.label }}</td>
            <td class="px-6 py-4 text-muted-foreground font-mono text-xs">{{ contact.value || '—' }}</td>
            <td class="px-6 py-4 text-muted-foreground text-xs truncate max-w-[200px]">{{ contact.href }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono px-2 py-1 rounded bg-secondary text-muted-foreground">{{ contact.icon }}</span>
                <span class="text-xs font-mono px-2 py-1 rounded bg-secondary text-muted-foreground">{{ contact.colorPreset }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  @click="openEdit(contact)"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  @click="openDelete(contact)"
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
      :title="isEdit ? t('admin.edit') + ' Contact' : t('admin.add') + ' Contact'"
      @update:open="dialogOpen = $event"
    >
      <form class="space-y-4" @submit.prevent="save">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel for="contact-label">{{ t('admin.fields.name') }}</UiLabel>
            <UiInput id="contact-label" v-model="form.label" placeholder="GitHub" required />
          </div>
          <div class="space-y-2">
            <UiLabel for="contact-value">{{ t('admin.fields.contact_value') }}</UiLabel>
            <UiInput id="contact-value" v-model="form.value" placeholder="@xconnortv" />
          </div>
        </div>
        <div class="space-y-2">
          <UiLabel for="contact-href">{{ t('admin.fields.url') }}</UiLabel>
          <UiInput id="contact-href" v-model="form.href" placeholder="https://... or mailto:..." required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <UiLabel>{{ t('admin.fields.icon') }}</UiLabel>
            <UiSelect v-model="form.icon" :options="iconOptions" />
          </div>
          <div class="space-y-2">
            <UiLabel>{{ t('admin.fields.color') }}</UiLabel>
            <UiSelect v-model="form.colorPreset" :options="colorOptions" />
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
