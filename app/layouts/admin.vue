<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/tools', label: 'Tools' },
  { href: '/admin/tool-categories', label: 'Categories', indent: true },
  { href: '/admin/experience', label: 'Experience' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/contacts', label: 'Contacts' },
  { href: '/admin/settings', label: 'Settings' },
]

function isActive(href: string) {
  return route.path === href
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="h-screen bg-background text-foreground flex overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-border/50 bg-card/30 flex flex-col shrink-0 h-screen overflow-y-auto">
      <div class="p-6 border-b border-border/50">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="font-mono text-primary text-lg font-bold">~/admin</span>
        </NuxtLink>
        <p class="text-xs text-muted-foreground mt-1 font-mono">xconnor.tv admin</p>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            item.indent ? 'ml-4 text-xs' : '',
            isActive(item.href)
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          ]"
        >
          <span class="font-mono text-xs" :class="item.indent ? 'text-primary/40' : 'text-primary/70'">{{ item.indent ? '↳' : '>' }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-border/50 space-y-1">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-accent"
        >
          <span class="font-mono text-xs">←</span>
          Portfolio
        </NuxtLink>
        <button
          class="flex items-center gap-2 w-full text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-lg hover:bg-destructive/10 text-left"
          @click="logout"
        >
          <span class="font-mono text-xs text-destructive/60">⏻</span>
          {{ t('admin.logout') }}
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <header class="border-b border-border/50 px-8 py-4 flex items-center justify-between bg-card/20 shrink-0">
        <h1 class="text-lg font-semibold font-mono">
          <span class="text-primary">></span> {{ t('admin.title') }}
        </h1>
        <div class="flex items-center gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>
      <main class="flex-1 p-8 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
