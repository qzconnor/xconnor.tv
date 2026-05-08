export default defineEventHandler(async (event) => {
  const { ids } = await readBody<{ ids: string[] }>(event)
  if (!Array.isArray(ids)) throw createError({ statusCode: 400, message: 'ids must be an array' })

  const items = await getItems('tools')
  const ordered = ids.map(id => items.find((t: any) => t.id === id)).filter(Boolean)
  const missing = items.filter((t: any) => !ids.includes(t.id))
  await setItems('tools', [...ordered, ...missing])
  return { success: true }
})
