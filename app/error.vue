<script setup lang="ts">
import { Home, Terminal, Lock, ServerCrash, WifiOff, AlertTriangle } from 'lucide-vue-next'

const { locale } = useI18n()
const colorMode = useColorMode()
const themeStore = useCookie<string>('color-theme', { default: () => 'default' })

onMounted(() => {
  const html = document.documentElement
  watch([() => colorMode.value, themeStore], ([_mode, theme]) => {
    html.classList.remove('theme-terminal', 'theme-ocean', 'theme-violet')
    if (theme !== 'default') html.classList.add(`theme-${theme}`)
  }, { immediate: true })
})

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

type ErrorStrings = { title: string; desc: string; hint: string }
type Translations = { goHome: string; errors: Record<string, ErrorStrings>; default: ErrorStrings }

const STRINGS: Record<string, Translations> = {
  de: {
    goHome: 'Startseite',
    errors: {
      404: { title: 'Seite nicht gefunden',      desc: 'Der angeforderte Pfad existiert nicht oder wurde verschoben.',            hint: 'FEHLER: Datei oder Verzeichnis nicht gefunden' },
      403: { title: 'Zugriff verweigert',         desc: 'Du hast keine Berechtigung, auf diese Ressource zuzugreifen.',            hint: 'FEHLER: Zugriff verweigert' },
      500: { title: 'Interner Serverfehler',      desc: 'Auf unserer Seite ist etwas schiefgelaufen. Bitte versuche es später.',   hint: 'FEHLER: Unbehandelte Ausnahme' },
      503: { title: 'Dienst nicht verfügbar',     desc: 'Der Server kann Anfragen vorübergehend nicht verarbeiten.',               hint: 'FEHLER: Verbindung abgelehnt' },
    },
    default: { title: 'Unerwarteter Fehler', desc: 'Ein unerwarteter Fehler ist aufgetreten.', hint: 'FEHLER: Unbekannter Fehler' },
  },
  en: {
    goHome: 'Home',
    errors: {
      404: { title: 'Page Not Found',          desc: "The path you requested doesn't exist or has been moved.",       hint: 'ERROR: No such file or directory' },
      403: { title: 'Access Forbidden',        desc: "You don't have permission to access this resource.",             hint: 'ERROR: Permission denied' },
      500: { title: 'Internal Server Error',   desc: 'Something went wrong on our end. Please try again later.',      hint: 'ERROR: Unhandled exception' },
      503: { title: 'Service Unavailable',     desc: 'The server is temporarily unable to handle requests.',           hint: 'ERROR: Connection refused' },
    },
    default: { title: 'Unexpected Error', desc: 'An unexpected error occurred.', hint: 'ERROR: Unknown error' },
  },
}

const ICON_MAP: Record<number, any> = {
  404: Terminal,
  403: Lock,
  500: ServerCrash,
  503: WifiOff,
}

const info = computed(() => {
  const strings = STRINGS[locale.value] ?? STRINGS.de
  const key = String(props.error.statusCode)
  const text = strings.errors[key] ?? { ...strings.default, desc: props.error.statusMessage ?? strings.default.desc }
  return { icon: ICON_MAP[props.error.statusCode] ?? AlertTriangle, ...text, goHome: strings.goHome }
})

const route = useRoute()

function goHome() {
  window.location.href = '/'
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
    <!-- Background patterns -->
    <div class="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
    <div class="absolute inset-0 dots-bg opacity-5 pointer-events-none" />

    <!-- Ambient glows -->
    <div class="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

    <!-- Minimal header (no nav links) -->
    <header class="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div class="container flex h-16 items-center justify-between">
        <a href="/" class="flex items-center gap-2 font-mono text-sm font-medium group">
          <span class="text-muted-foreground group-hover:text-foreground transition-colors">~/</span>
          <span class="text-primary font-bold text-base">xconnor.tv</span>
          <span class="animate-blink text-primary">_</span>
        </a>
        <div class="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="flex-1 flex flex-col items-center justify-center px-4 pt-16">
      <!-- Error code -->
      <p class="font-mono text-primary text-sm font-medium mb-4 tracking-widest uppercase">
        xconnor.tv / error
      </p>
      <h1 class="text-gradient font-bold leading-none mb-6 select-none" style="font-size: clamp(6rem, 20vw, 12rem);">
        {{ error.statusCode }}
      </h1>

      <!-- Glass card -->
      <div class="glass rounded-2xl p-8 max-w-lg w-full mb-8 border border-border/50">
        <div class="flex items-start gap-5 mb-6">
          <!-- Icon -->
          <div class="shrink-0 w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <component :is="info.icon" class="h-6 w-6 text-primary" />
          </div>
          <!-- Text -->
          <div>
            <h2 class="text-2xl font-bold mb-2">{{ info.title }}</h2>
            <p class="text-muted-foreground leading-relaxed">{{ info.desc }}</p>
          </div>
        </div>

        <!-- Terminal hint -->
        <div class="font-mono text-xs bg-card/80 border border-border/50 rounded-lg px-4 py-3 text-left text-muted-foreground">
          <span class="text-primary">~/xconnor.tv</span>
          <span class="text-muted-foreground/60"> $ </span>
          <span>open "{{ route.fullPath }}"</span>
          <br />
          <span class="text-destructive/80">{{ info.hint }}</span>
          <span class="inline-block w-2 h-4 bg-primary ml-1 animate-blink align-middle" />
        </div>
      </div>

      <!-- Actions -->
      <button
        class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all glow-hover hover:scale-105"
        @click="goHome"
      >
        <Home class="h-4 w-4" />
        {{ info.goHome }}
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1s step-start infinite;
}
</style>
