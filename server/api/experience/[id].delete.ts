export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const deleted = await deleteItem('experience', id)
  if (!deleted) throw createError({ statusCode: 404, message: 'Experience not found' })
  return { success: true }
})
