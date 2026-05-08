<script setup lang="ts">
definePageMeta({ layout: false })

const { t } = useI18n()

const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

async function login() {
  if (!password.value) return
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value },
    })
    await navigateTo('/admin')
  } catch (e: any) {
    error.value = e?.data?.message || t('admin.login.error')
    password.value = ''
  } finally {
    loading.value = false
  }
}

// Redirect if already authenticated
onMounted(async () => {
  try {
    await $fetch('/api/auth/session')
    await navigateTo('/admin')
  } catch {
    // Not logged in, stay on login page
  }
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
    <!-- Background -->
    <div class="absolute inset-0 dots-bg opacity-30" />
    <div class="absolute inset-0 grid-bg opacity-10" />

    <div class="relative w-full max-w-sm">
      <!-- Header -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <span class="text-primary">←</span> Portfolio
        </NuxtLink>
        <div class="font-mono text-primary text-3xl font-bold mb-1">~/admin</div>
        <p class="text-muted-foreground text-sm font-mono">
          <span class="text-primary">$</span> sudo xconnor.tv admin
        </p>
      </div>

      <!-- Login card -->
      <div class="glass rounded-xl p-8 border border-border/50 shadow-2xl">
        <!-- Terminal header bar -->
        <div class="flex items-center gap-1.5 mb-6 pb-4 border-b border-border/30">
          <div class="w-3 h-3 rounded-full bg-red-500/70" />
          <div class="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div class="w-3 h-3 rounded-full bg-green-500/70" />
          <span class="ml-2 font-mono text-xs text-muted-foreground">auth.ts</span>
        </div>

        <form class="space-y-5" @submit.prevent="login">
          <div class="space-y-2">
            <label class="text-sm font-medium font-mono text-muted-foreground">
              <span class="text-primary">></span> {{ t('admin.login.password') }}
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono pr-10"
                placeholder="••••••••"
                autofocus
                required
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <Transition name="fade-in">
            <div v-if="error" class="flex items-center gap-2 text-sm text-destructive font-mono bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
              <span class="text-destructive">✗</span>
              {{ error }}
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="loading || !password"
            class="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground h-10 px-4 rounded-md text-sm font-semibold font-mono hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed glow-hover"
          >
            <span v-if="loading" class="animate-spin text-base">◌</span>
            <span v-else class="text-primary-foreground/70">$</span>
            {{ loading ? t('common.loading') : t('admin.login.submit') }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-muted-foreground mt-4 font-mono">
        xconnor.tv &mdash; admin panel
      </p>
    </div>
  </div>
</template>

<style scoped>
.fade-in-enter-active { transition: all 0.2s ease; }
.fade-in-enter-from { opacity: 0; transform: translateY(-4px); }
</style>
