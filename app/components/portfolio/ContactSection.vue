<script setup lang="ts">
import { ExternalLink, Github, Mail, Twitter, Linkedin, Instagram, Youtube, Globe, Phone, Link2, MessageSquare, Twitch } from 'lucide-vue-next'
import type { Contact } from '~/types'

const { t } = useI18n()

const { data: status } = await useFetch('/api/status', { default: () => ({ openForWork: true }) })
const { data: contacts } = await useFetch<Contact[]>('/api/contacts', { default: () => [] })

const ICON_MAP: Record<string, any> = {
  Github, Mail, Twitter, Linkedin, Instagram, Youtube, Globe, Phone, Link2, MessageSquare, Twitch,
}

// Full tailwind class strings must be hardcoded here so JIT can scan them
const COLOR_MAP: Record<string, { card: string; icon: string }> = {
  purple:  { card: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 hover:border-purple-400/50',  icon: 'text-purple-400' },
  primary: { card: 'from-primary/20 to-primary/10 border-primary/20 hover:border-primary/50',              icon: 'text-primary' },
  sky:     { card: 'from-sky-500/20 to-sky-600/10 border-sky-500/20 hover:border-sky-400/50',              icon: 'text-sky-400' },
  blue:    { card: 'from-blue-600/20 to-blue-700/10 border-blue-600/20 hover:border-blue-500/50',          icon: 'text-blue-400' },
  green:   { card: 'from-green-500/20 to-green-600/10 border-green-500/20 hover:border-green-400/50',      icon: 'text-green-400' },
  red:     { card: 'from-red-500/20 to-red-600/10 border-red-500/20 hover:border-red-400/50',              icon: 'text-red-400' },
  orange:  { card: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 hover:border-orange-400/50',  icon: 'text-orange-400' },
  pink:    { card: 'from-pink-500/20 to-pink-600/10 border-pink-500/20 hover:border-pink-400/50',          icon: 'text-pink-400' },
  yellow:  { card: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 hover:border-yellow-400/50',  icon: 'text-yellow-400' },
  teal:    { card: 'from-teal-500/20 to-teal-600/10 border-teal-500/20 hover:border-teal-400/50',          icon: 'text-teal-400' },
}

function cardColor(preset: string) {
  return (COLOR_MAP[preset] ?? COLOR_MAP.primary).card
}
function iconColor(preset: string) {
  return (COLOR_MAP[preset] ?? COLOR_MAP.primary).icon
}
function resolveIcon(name: string) {
  return ICON_MAP[name] ?? Globe
}
</script>

<template>
  <section id="contact" class="py-24 bg-card/20 relative">
    <div class="absolute inset-0 grid-bg opacity-10" />
    <div class="container relative z-10">
      <!-- Header -->
      <div class="text-center mb-16" data-animate>
        <p class="font-mono text-primary text-sm font-medium mb-2">{{ t('contact.subtitle') }}</p>
        <h2 class="text-4xl md:text-5xl font-bold mb-4">
          {{ t('contact.title') }}
        </h2>
        <p class="text-muted-foreground max-w-xl mx-auto">{{ t('contact.description') }}</p>
      </div>

      <!-- Available banner -->
      <div class="flex justify-center mb-12" data-animate data-animate-delay="100">
        <Transition name="status-swap" mode="out-in">
          <div
            v-if="status?.openForWork"
            key="open"
            class="glass rounded-xl px-8 py-5 border border-green-500/20 max-w-lg text-center"
          >
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span class="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
              </span>
              <span class="text-green-400 font-semibold">{{ t('hero.available') }}</span>
            </div>
            <p class="text-muted-foreground text-sm">{{ t('contact.available_text') }}</p>
          </div>
          <div
            v-else
            key="closed"
            class="glass rounded-xl px-8 py-5 border border-border/30 max-w-lg text-center opacity-60"
          >
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="inline-flex rounded-full h-3 w-3 bg-muted-foreground/40" />
              <span class="text-muted-foreground font-semibold">{{ t('hero.not_available') }}</span>
            </div>
            <p class="text-muted-foreground text-sm">{{ t('contact.not_available_text') }}</p>
          </div>
        </Transition>
      </div>

      <!-- Contact cards grid -->
      <div
        v-if="contacts && contacts.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
      >
        <a
          v-for="(contact, i) in contacts"
          :key="contact.id"
          :href="contact.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex flex-col items-center gap-4 p-6 rounded-xl border bg-gradient-to-br backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          :class="cardColor(contact.colorPreset)"
          data-animate
          :data-animate-delay="String(i * 100)"
        >
          <div
            class="w-14 h-14 rounded-full bg-card/50 flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform"
          >
            <component :is="resolveIcon(contact.icon)" class="h-6 w-6" :class="iconColor(contact.colorPreset)" />
          </div>
          <div class="text-center">
            <p class="font-semibold text-sm mb-1">{{ contact.label }}</p>
            <p class="text-xs text-muted-foreground font-mono">{{ contact.value }}</p>
          </div>
          <ExternalLink class="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.status-swap-enter-active, .status-swap-leave-active { transition: all 0.25s ease; }
.status-swap-enter-from, .status-swap-leave-to { opacity: 0; transform: translateY(6px); }
</style>
