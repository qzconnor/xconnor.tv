export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const deleted = await deleteItem('tools', id)
  if (!deleted) throw createError({ statusCode: 404, message: 'Tool not found' })
  return { success: true }
})
