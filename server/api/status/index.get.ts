const DEFAULT_SECTIONS = { skills: true, tools: true, experience: true, projects: true }

export default defineEventHandler(async () => {
  const status = await useStorage('data').getItem<Record<string, any>>('status')
  return {
    openForWork: true,
    ...status,
    sections: { ...DEFAULT_SECTIONS, ...(status?.sections ?? {}) },
  }
})
