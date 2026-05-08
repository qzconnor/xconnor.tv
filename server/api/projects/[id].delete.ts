export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const deleted = await deleteItem('projects', id)
  if (!deleted) throw createError({ statusCode: 404, message: 'Project not found' })
  return { success: true }
})
