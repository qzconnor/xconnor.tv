<script setup lang="ts">
const colorMode = useColorMode()
const themeStore = useCookie<string>('color-theme', { default: () => 'default' })

onMounted(() => {
  const html = document.documentElement
  watch([() => colorMode.value, themeStore], ([mode, theme]) => {
    html.classList.remove('theme-terminal', 'theme-ocean', 'theme-violet')
    if (theme !== 'default') {
      html.classList.add(`theme-${theme}`)
    }
  }, { immediate: true })
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
