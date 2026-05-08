<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const open = ref(false)

const currentLocale = computed(() => locales.value.find(l => l.code === locale.value))

const availableLocales = computed(() => locales.value.filter(l => l.code !== locale.value))

async function switchLang(code: string) {
  await setLocale(code as 'de' | 'en')
  open.value = false
}

onMounted(() => {
  const handler = (e: MouseEvent) => {
    const target = e.target as Element
    if (!target.closest('[data-lang-switcher]')) {
      open.value = false
    }
  }
  document.addEventListener('click', handler)
  onUnmounted(() => document.removeEventListener('click', handler))
})
</script>

<template>
  <div class="relative" data-lang-switcher>
    <button
      class="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors font-mono text-xs font-semibold"
      @click.stop="open = !open"
    >
      {{ currentLocale?.code?.toUpperCase() }}
    </button>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute right-0 top-full mt-2 w-32 glass rounded-lg shadow-xl border border-border/50 overflow-hidden z-50"
      >
        <div class="p-1">
          <button
            v-for="loc in locales"
            :key="loc.code"
            :class="[
              'flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors font-mono',
              locale === loc.code
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            ]"
            @click="switchLang(loc.code)"
          >
            <span class="text-xs font-bold">{{ loc.code.toUpperCase() }}</span>
            <span class="text-xs">{{ loc.name }}</span>
            <span v-if="locale === loc.code" class="ml-auto text-primary text-xs">✓</span>
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
