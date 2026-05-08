<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { t } = useI18n()

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showCurrent = ref(false)
const showNew = ref(false)
const loading = ref(false)
const success = ref(false)
const error = ref('')

async function changePassword() {
  error.value = ''
  success.value = false

  if (form.newPassword !== form.confirmPassword) {
    error.value = t('admin.settings.password_mismatch')
    return
  }
  if (form.newPassword.length < 6) {
    error.value = t('admin.settings.password_too_short')
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/password', {
      method: 'PUT',
      body: {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      },
    })
    success.value = true
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (e: any) {
    error.value = e?.data?.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg">
    <div class="mb-8">
      <h2 class="text-2xl font-bold font-mono mb-1">
        <span class="text-primary">></span> {{ t('admin.settings.title') }}
      </h2>
      <p class="text-muted-foreground text-sm">{{ t('admin.settings.subtitle') }}</p>
    </div>

    <div class="glass rounded-xl p-6 border border-border/50">
      <h3 class="font-semibold font-mono mb-4 flex items-center gap-2">
        <span class="text-primary text-xs">#</span>
        {{ t('admin.settings.change_password') }}
      </h3>

      <form class="space-y-4" @submit.prevent="changePassword">
        <!-- Current password -->
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ t('admin.settings.current_password') }}</label>
          <div class="relative">
            <input
              v-model="form.currentPassword"
              :type="showCurrent ? 'text' : 'password'"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono pr-10"
              :placeholder="t('admin.settings.current_password')"
              required
            />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" @click="showCurrent = !showCurrent">
              <svg v-if="showCurrent" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <svg v-else class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        <!-- New password -->
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ t('admin.settings.new_password') }}</label>
          <div class="relative">
            <input
              v-model="form.newPassword"
              :type="showNew ? 'text' : 'password'"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono pr-10"
              :placeholder="t('admin.settings.new_password_placeholder')"
              minlength="6"
              required
            />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" @click="showNew = !showNew">
              <svg v-if="showNew" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <svg v-else class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <p class="text-xs text-muted-foreground">{{ t('admin.settings.password_hint') }}</p>
        </div>

        <!-- Confirm new password -->
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ t('admin.settings.confirm_password') }}</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
            :class="form.confirmPassword && form.confirmPassword !== form.newPassword ? 'border-destructive focus-visible:ring-destructive' : ''"
            :placeholder="t('admin.settings.confirm_password')"
            required
          />
        </div>

        <!-- Feedback -->
        <Transition name="slide-fade">
          <div v-if="success" class="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-md px-3 py-2">
            <span>✓</span> {{ t('admin.settings.password_changed') }}
          </div>
          <div v-else-if="error" class="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
            <span>✗</span> {{ error }}
          </div>
        </Transition>

        <button
          type="submit"
          :disabled="loading || !form.currentPassword || !form.newPassword || !form.confirmPassword"
          class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="animate-spin">◌</span>
          {{ loading ? t('common.loading') : t('admin.settings.save_password') }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
