export default defineEventHandler(async (event) => {
  const { ids } = await readBody<{ ids: string[] }>(event)
  if (!Array.isArray(ids)) throw createError({ statusCode: 400, message: 'ids must be an array' })
  const items = await getItems('tool-categories')
  const ordered = ids.map(id => (items as any[]).find((c: any) => c.id === id)).filter(Boolean)
  const missing = (items as any[]).filter((c: any) => !ids.includes(c.id))
  await setItems('tool-categories', [...ordered, ...missing])
  return { success: true }
})
