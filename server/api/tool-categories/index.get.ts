export default defineEventHandler(async () => {
  const raw = await useStorage('data').getItem<any>('tool-categories')
  if (Array.isArray(raw) && raw.length > 0 && raw[0]?.labelEn) return raw
  return []
})
