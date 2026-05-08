<script setup lang="ts">
import { cn } from '~/lib/utils'
defineProps<{ class?: string; modelValue?: number }>()
</script>
<template>
  <div :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', $props.class)">
    <div
      class="h-full flex-1 bg-primary transition-all duration-700 ease-out"
      :style="{ width: `${modelValue || 0}%` }"
    />
  </div>
</template>
