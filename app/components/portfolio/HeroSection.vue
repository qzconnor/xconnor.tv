<script setup lang="ts">
import { Github, Mail, ChevronDown } from 'lucide-vue-next'
import type { Contact } from '~/types'

const { t, tm } = useI18n()

const roles = computed<string[]>(() => {
  const val = tm('hero.roles')
  if (Array.isArray(val)) return val as string[]
  return ['Full-Stack Developer', 'Web Developer', 'Open Source Enthusiast', 'Problem Solver']
})
const { displayText } = useTypewriter(roles.value)

const { data: status } = await useFetch('/api/status', { default: () => ({ openForWork: true }) })
const { data: contacts } = await useFetch<Contact[]>('/api/contacts', { default: () => [] })

const githubContact = computed(() => contacts.value?.find(c => c.icon === 'Github') ?? null)

const visible = ref(false)
onMounted(() => {
  setTimeout(() => { visible.value = true }, 100)
})

function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background layers -->
    <div class="absolute inset-0 dots-bg opacity-40" />
    <div class="absolute inset-0 grid-bg opacity-20" />

    <!-- Floating decorative elements -->
    <div class="absolute top-1/4 right-10 md:right-20 animate-float opacity-30 hidden md:block">
      <div class="glass rounded-xl p-4 font-mono text-xs text-primary border border-primary/20 shadow-lg">
        <div class="text-muted-foreground mb-1">// portfolio.ts</div>
        <div><span class="text-blue-400">const</span> <span class="text-green-400">dev</span> = {</div>
        <div class="pl-4"><span class="text-yellow-400">name</span>: <span class="text-orange-400">"Connor"</span>,</div>
        <div class="pl-4"><span class="text-yellow-400">stack</span>: [<span class="text-orange-400">"Vue"</span>, <span class="text-orange-400">"Nuxt"</span>],</div>
        <div class="pl-4"><span class="text-yellow-400">loves</span>: <span class="text-orange-400">"DX"</span></div>
        <div>}</div>
      </div>
    </div>

    <div class="absolute bottom-1/3 left-8 md:left-16 animate-float opacity-20 hidden lg:block" style="animation-delay: 1.5s">
      <div class="font-mono text-primary text-xs space-y-1">
        <div>$ npm run dev</div>
        <div class="text-muted-foreground">✓ Nuxt ready on localhost:3000</div>
        <div class="text-muted-foreground">◐ Fast Refresh enabled</div>
      </div>
    </div>

    <!-- Main content -->
    <div class="container relative z-10 text-center">
      <Transition name="fade-stagger">
        <div v-if="visible" class="space-y-6">
          <!-- Open for work badge -->
          <div class="flex justify-center">
            <Transition name="badge-swap" mode="out-in">
              <div
                v-if="status?.openForWork"
                key="open"
                class="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm border border-green-500/30"
              >
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span class="text-green-400 font-medium">{{ t('hero.available') }}</span>
              </div>
              <div
                v-else
                key="closed"
                class="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm border border-border/30"
              >
                <span class="relative flex h-2 w-2">
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground/50" />
                </span>
                <span class="text-muted-foreground font-medium">{{ t('hero.not_available') }}</span>
              </div>
            </Transition>
          </div>

          <!-- Greeting -->
          <p class="text-muted-foreground text-lg font-mono">
            <span class="text-primary">></span> {{ t('hero.greeting') }}
          </p>

          <!-- Name -->
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
            <span class="text-gradient">Connor</span>
            <br />
            <span class="text-foreground">Breuer</span>
          </h1>

          <!-- Handle -->
          <p class="font-mono text-primary text-xl md:text-2xl font-semibold tracking-wider">
            @xConnorTV<span class="animate-blink">_</span>
          </p>

          <!-- Typewriter -->
          <div class="h-10 flex items-center justify-center">
            <p class="text-xl md:text-2xl text-muted-foreground font-mono">
              {{ displayText }}
            </p>
          </div>

          <!-- Description -->
          <p class="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {{ t('hero.description') }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="#contact"
              class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 glow-hover transition-all duration-300 shadow-lg"
              @click.prevent="scrollToContact"
            >
              <Mail class="h-4 w-4" />
              {{ t('hero.cta_contact') }}
            </a>
            <a
              v-if="githubContact"
              :href="githubContact.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 border border-border/50 px-8 py-3 rounded-lg font-semibold text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 glass"
            >
              <Github class="h-4 w-4" />
              {{ githubContact.label }}
            </a>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
      <span class="text-xs font-mono">{{ t('hero.scroll_down') }}</span>
      <ChevronDown class="h-5 w-5" />
    </div>
  </section>
</template>

<style scoped>
.badge-swap-enter-active, .badge-swap-leave-active { transition: all 0.2s ease; }
.badge-swap-enter-from, .badge-swap-leave-to { opacity: 0; transform: scale(0.95); }

.fade-stagger-enter-active {
  animation: fadeIn 0.8s ease-out forwards;
}
.fade-stagger-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
