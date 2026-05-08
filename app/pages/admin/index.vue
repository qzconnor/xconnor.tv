<script setup lang="ts">
import { Zap, Wrench, Briefcase, AtSign, FolderGit2, ArrowRight, BriefcaseBusiness, LayoutDashboard } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()

const { data: skills } = await useFetch('/api/skills')
const { data: tools } = await useFetch('/api/tools')
const { data: experience } = await useFetch('/api/experience')
const { data: contacts } = await useFetch('/api/contacts')
const { data: projects } = await useFetch('/api/projects')
const { data: status, refresh: refreshStatus } = await useFetch<{
  openForWork: boolean
  sections: Record<string, boolean>
}>('/api/status')

const togglingWork = ref(false)

async function toggleOpenForWork() {
  if (!status.value) return
  togglingWork.value = true
  try {
    await $fetch('/api/status', { method: 'PUT', body: { openForWork: !status.value.openForWork } })
    await refreshStatus()
  } finally {
    togglingWork.value = false
  }
}

const sectionDefs = [
  { key: 'skills',     label: t('admin.total_skills'),     icon: Zap },
  { key: 'tools',      label: t('admin.total_tools'),      icon: Wrench },
  { key: 'experience', label: t('admin.total_experience'), icon: Briefcase },
  { key: 'projects',   label: t('admin.total_projects'),   icon: FolderGit2 },
]

async function toggleSection(key: string) {
  if (!status.value) return
  const current = status.value.sections?.[key] !== false
  await $fetch('/api/status', { method: 'PUT', body: { sections: { [key]: !current } } })
  await refreshStatus()
}

const stats = computed(() => [
  {
    label: t('admin.total_skills'),
    value: (skills.value as any[])?.length || 0,
    href: '/admin/skills',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
  },
  {
    label: t('admin.total_tools'),
    value: (tools.value as any[])?.length || 0,
    href: '/admin/tools',
    icon: Wrench,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  {
    label: t('admin.total_experience'),
    value: (experience.value as any[])?.length || 0,
    href: '/admin/experience',
    icon: Briefcase,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
  },
  {
    label: t('admin.total_projects'),
    value: (projects.value as any[])?.length || 0,
    href: '/admin/projects',
    icon: FolderGit2,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/20',
  },
  {
    label: t('admin.total_contacts'),
    value: (contacts.value as any[])?.length || 0,
    href: '/admin/contacts',
    icon: AtSign,
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
])
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold font-mono mb-1">
        <span class="text-primary">></span> {{ t('admin.dashboard') }}
      </h2>
      <p class="text-muted-foreground text-sm">Manage your portfolio content</p>
    </div>

    <!-- Open for Work toggle -->
    <div class="glass rounded-xl p-6 border mb-6 transition-colors duration-300"
      :class="status?.openForWork
        ? 'border-green-500/30 bg-green-500/5'
        : 'border-border/50'"
    >
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="rounded-full p-2.5 transition-colors"
            :class="status?.openForWork ? 'bg-green-500/15' : 'bg-muted'"
          >
            <BriefcaseBusiness
              class="h-5 w-5 transition-colors"
              :class="status?.openForWork ? 'text-green-400' : 'text-muted-foreground'"
            />
          </div>
          <div>
            <p class="font-semibold text-sm">{{ t('admin.open_for_work') }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ t('admin.open_for_work_desc') }}</p>
          </div>
        </div>

        <!-- Toggle switch -->
        <button
          :disabled="togglingWork"
          class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :class="status?.openForWork ? 'bg-green-500' : 'bg-muted-foreground/30'"
          :aria-checked="status?.openForWork"
          role="switch"
          @click="toggleOpenForWork"
        >
          <span
            class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200"
            :class="status?.openForWork ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>

      <!-- Status label -->
      <div class="mt-3 pt-3 border-t transition-colors"
        :class="status?.openForWork ? 'border-green-500/20' : 'border-border/30'"
      >
        <Transition name="status-label" mode="out-in">
          <span
            v-if="status?.openForWork"
            key="open"
            class="inline-flex items-center gap-1.5 text-xs font-mono text-green-400"
          >
            <span class="relative flex h-1.5 w-1.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
            </span>
            Sichtbar als „Offen für neue Stellen" auf dem Portfolio
          </span>
          <span
            v-else
            key="closed"
            class="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground"
          >
            <span class="inline-flex rounded-full h-1.5 w-1.5 bg-muted-foreground/50" />
            Nicht als verfügbar angezeigt
          </span>
        </Transition>
      </div>
    </div>

    <!-- Section visibility -->
    <div class="glass rounded-xl p-6 border border-border/50 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="rounded-full p-2.5 bg-muted">
          <LayoutDashboard class="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p class="font-semibold text-sm">{{ t('admin.section_visibility') }}</p>
          <p class="text-xs text-muted-foreground mt-0.5">{{ t('admin.section_visibility_desc') }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          v-for="sec in sectionDefs"
          :key="sec.key"
          class="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-all duration-200"
          :class="status?.sections?.[sec.key] !== false
            ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
            : 'bg-card/30 border-border/30 opacity-60 hover:opacity-80'"
          @click="toggleSection(sec.key)"
        >
          <div class="flex items-center gap-2">
            <component
              :is="sec.icon"
              class="h-4 w-4 transition-colors"
              :class="status?.sections?.[sec.key] !== false ? 'text-primary' : 'text-muted-foreground'"
            />
            <span class="text-sm font-medium">{{ sec.label }}</span>
          </div>
          <!-- mini toggle -->
          <div
            class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors"
            :class="status?.sections?.[sec.key] !== false ? 'bg-primary' : 'bg-muted-foreground/30'"
          >
            <span
              class="pointer-events-none block h-3 w-3 rounded-full bg-white shadow transition-transform"
              :class="status?.sections?.[sec.key] !== false ? 'translate-x-4' : 'translate-x-0'"
            />
          </div>
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.href"
        class="glass rounded-xl p-6 border glow-hover group transition-all duration-300 hover:-translate-y-0.5"
        :class="stat.bg"
      >
        <div class="flex items-center justify-between mb-4">
          <component :is="stat.icon" class="h-6 w-6" :class="stat.color" />
          <ArrowRight class="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        <div class="text-3xl font-bold mb-1" :class="stat.color">{{ stat.value }}</div>
        <div class="text-sm text-muted-foreground">{{ stat.label }}</div>
      </NuxtLink>
    </div>

    <div class="glass rounded-xl p-6">
      <h3 class="font-mono text-sm text-muted-foreground mb-4">
        <span class="text-primary">//</span> Quick Actions
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <NuxtLink
          to="/admin/skills"
          class="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 hover:border-primary/50 transition-colors group"
        >
          <Zap class="h-4 w-4 text-primary" />
          <span class="text-sm font-medium">Manage Skills</span>
          <ArrowRight class="h-3 w-3 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
        </NuxtLink>
        <NuxtLink
          to="/admin/tools"
          class="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 border border-border/50 hover:border-primary/30 transition-colors group"
        >
          <Wrench class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm font-medium">Manage Tools</span>
          <ArrowRight class="h-3 w-3 ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
        </NuxtLink>
        <NuxtLink
          to="/admin/experience"
          class="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 border border-border/50 hover:border-primary/30 transition-colors group"
        >
          <Briefcase class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm font-medium">Manage Experience</span>
          <ArrowRight class="h-3 w-3 ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
        </NuxtLink>
        <NuxtLink
          to="/admin/projects"
          class="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 border border-border/50 hover:border-orange-400/30 transition-colors group"
        >
          <FolderGit2 class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm font-medium">Manage Projects</span>
          <ArrowRight class="h-3 w-3 ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
        </NuxtLink>
        <NuxtLink
          to="/admin/contacts"
          class="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 border border-border/50 hover:border-green-400/30 transition-colors group"
        >
          <AtSign class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm font-medium">Manage Contacts</span>
          <ArrowRight class="h-3 w-3 ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-label-enter-active, .status-label-leave-active { transition: all 0.15s ease; }
.status-label-enter-from, .status-label-leave-to { opacity: 0; transform: translateX(-4px); }
</style>
