export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const deleted = await deleteItem('skills', id)
  if (!deleted) throw createError({ statusCode: 404, message: 'Skill not found' })
  return { success: true }
})
