<script setup lang="ts">
import { cn } from '~/lib/utils'
import { X } from 'lucide-vue-next'

interface Props {
  open?: boolean
  title?: string
  description?: string
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

function close() {
  emit('update:open', false)
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.open) close()
  }
  document.addEventListener('keydown', onKey)
  onUnmounted(() => document.removeEventListener('keydown', onKey))
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click="onOverlayClick"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <!-- Content -->
        <div
          :class="cn(
            'relative z-10 w-full max-w-lg mx-4 glass rounded-xl shadow-2xl border border-border/50',
            'max-h-[90vh] overflow-y-auto',
            props.class
          )"
        >
          <div class="flex items-center justify-between p-6 pb-0">
            <div>
              <h2 v-if="title" class="text-lg font-semibold text-foreground">{{ title }}</h2>
              <p v-if="description" class="text-sm text-muted-foreground mt-1">{{ description }}</p>
            </div>
            <button
              class="ml-4 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              @click="close"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
          <div class="p-6">
            <slot />
          </div>
          <div v-if="$slots.footer" class="flex items-center justify-end gap-2 px-6 pb-6">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.2s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-from .relative,
.dialog-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
