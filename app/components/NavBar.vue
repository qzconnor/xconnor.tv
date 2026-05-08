<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

const { t } = useI18n()
const { y: scrollY } = useWindowScroll()
const mobileMenuOpen = ref(false)
const activeSection = ref('hero')

const isScrolled = computed(() => scrollY.value > 20)

const { data: status } = await useFetch('/api/status', {
  default: () => ({ sections: { skills: true, tools: true, experience: true, projects: true } }),
})

const allNavLinks = [
  { id: 'skills',     label: () => t('nav.skills') },
  { id: 'tools',      label: () => t('nav.tools') },
  { id: 'experience', label: () => t('nav.experience') },
  { id: 'projects',   label: () => t('nav.projects') },
  { id: 'contact',    label: () => t('nav.contact') },
]

const navLinks = computed(() =>
  allNavLinks
    .filter(link => {
      const sections = (status.value as any)?.sections
      if (!sections || !(link.id in sections)) return true
      return sections[link.id] !== false
    })
    .map(link => ({ id: link.id, label: link.label() }))
)

function scrollTo(id: string) {
  mobileMenuOpen.value = false
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Track active section via IntersectionObserver
onMounted(() => {
  const sections = ['hero', ...navLinks.value.map(l => l.id)]
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
  )
  sections.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      isScrolled
        ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-lg'
        : 'bg-transparent'
    ]"
  >
    <div class="container flex h-16 items-center justify-between">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-mono text-sm font-medium group"
        @click="scrollTo('hero')"
      >
        <span class="text-muted-foreground group-hover:text-foreground transition-colors">~/</span>
        <span class="text-primary font-bold text-base">xconnor.tv</span>
        <span class="animate-blink text-primary">_</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1">
        <button
          v-for="link in navLinks"
          :key="link.id"
          :class="[
            'px-3 py-2 rounded-md text-sm font-medium transition-colors font-mono',
            activeSection === link.id
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          ]"
          @click="scrollTo(link.id)"
        >
          {{ link.label }}
        </button>
      </nav>

      <!-- Right side controls -->
      <div class="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <NuxtLink
          to="/admin"
          class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors font-mono"
        >
          <span class="text-primary">[</span>admin<span class="text-primary">]</span>
        </NuxtLink>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Menu v-if="!mobileMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
      >
        <div class="container py-4 flex flex-col gap-1">
          <button
            v-for="link in navLinks"
            :key="link.id"
            :class="[
              'px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors font-mono',
              activeSection === link.id
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            ]"
            @click="scrollTo(link.id)"
          >
            <span class="text-primary mr-2">></span>{{ link.label }}
          </button>
          <NuxtLink
            to="/admin"
            class="px-4 py-3 rounded-lg text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            @click="mobileMenuOpen = false"
          >
            <span class="text-primary mr-2">[</span>admin<span class="text-primary">]</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
