<script setup lang="ts">
import { cn } from '~/lib/utils'
import { ChevronDown } from 'lucide-vue-next'

interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  options?: SelectOption[]
  placeholder?: string
  class?: string
  disabled?: boolean
}

const props = defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative">
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="cn(
        'flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled :selected="!modelValue">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
  </div>
</template>
