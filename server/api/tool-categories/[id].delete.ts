export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ok = await deleteItem('tool-categories', id)
  if (!ok) throw createError({ statusCode: 404, message: 'Category not found' })
  return { success: true }
})
