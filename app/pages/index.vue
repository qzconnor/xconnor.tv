<script setup lang="ts">
useScrollAnimation()

useSeoMeta({
  title: 'Connor Breuer | xConnorTV - Full-Stack Developer',
  description: 'Portfolio von Connor Breuer, Full-Stack Developer spezialisiert auf Vue.js, Nuxt.js und moderne Webtechnologien.',
  ogTitle: 'Connor Breuer | Full-Stack Developer',
  ogDescription: 'Moderne Webanwendungen mit Vue.js, Nuxt.js und TypeScript.',
})

const { data: status } = await useFetch('/api/status', {
  default: () => ({ openForWork: true, sections: { skills: true, tools: true, experience: true, projects: true } }),
})

const sections = computed(() => (status.value as any)?.sections ?? {})
</script>

<template>
  <div>
    <portfolio-hero-section />
    <portfolio-skills-section v-if="sections.skills !== false" />
    <portfolio-tools-section v-if="sections.tools !== false" />
    <portfolio-experience-section v-if="sections.experience !== false" />
    <portfolio-projects-section v-if="sections.projects !== false" />
    <portfolio-contact-section />
  </div>
</template>
