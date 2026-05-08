<script setup lang="ts">
import { Sun, Moon, Monitor, Waves, Zap } from 'lucide-vue-next'

const { t } = useI18n()
const colorMode = useColorMode()
const themeStore = useCookie<string>('color-theme', { default: () => 'default' })
const open = ref(false)

interface ThemeOption {
  id: string
  label: string
  colorMode: 'dark' | 'light'
  themeClass: string
  icon: any
  color: string
}

const themes: ThemeOption[] = [
  { id: 'dark', label: 'Dark', colorMode: 'dark', themeClass: 'default', icon: Moon, color: 'text-slate-400' },
  { id: 'light', label: 'Light', colorMode: 'light', themeClass: 'default', icon: Sun, color: 'text-yellow-400' },
  { id: 'terminal', label: 'Terminal', colorMode: 'dark', themeClass: 'terminal', icon: Monitor, color: 'text-green-400' },
  { id: 'ocean', label: 'Ocean', colorMode: 'dark', themeClass: 'ocean', icon: Waves, color: 'text-blue-400' },
  { id: 'violet', label: 'Violet', colorMode: 'dark', themeClass: 'violet', icon: Zap, color: 'text-violet-400' },
]

const currentTheme = computed<ThemeOption>(() => {
  if (themeStore.value !== 'default') {
    return themes.find(t => t.themeClass === themeStore.value) ?? themes[0]!
  }
  return colorMode.value === 'light' ? themes[1]! : themes[0]!
})

function setTheme(theme: ThemeOption) {
  colorMode.preference = theme.colorMode
  themeStore.value = theme.themeClass
  open.value = false
}

// Close on outside click
onMounted(() => {
  const handler = (e: MouseEvent) => {
    const target = e.target as Element
    if (!target.closest('[data-theme-switcher]')) {
      open.value = false
    }
  }
  document.addEventListener('click', handler)
  onUnmounted(() => document.removeEventListener('click', handler))
})
</script>

<template>
  <div class="relative" data-theme-switcher>
    <button
      class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-sm"
      :title="t('theme.toggle')"
      @click.stop="open = !open"
    >
      <component :is="currentTheme.icon" class="h-4 w-4" :class="currentTheme.color" />
    </button>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute right-0 top-full mt-2 w-44 glass rounded-lg shadow-xl border border-border/50 overflow-hidden z-50"
      >
        <div class="p-1">
          <button
            v-for="theme in themes"
            :key="theme.id"
            :class="[
              'flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors',
              currentTheme.id === theme.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            ]"
            @click="setTheme(theme)"
          >
            <component :is="theme.icon" class="h-4 w-4" :class="theme.color" />
            {{ theme.label }}
            <span v-if="currentTheme.id === theme.id" class="ml-auto text-primary text-xs">✓</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
