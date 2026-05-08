export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const deleted = await deleteItem('contacts', id)
  if (!deleted) throw createError({ statusCode: 404, message: 'Contact not found' })
  return { success: true }
})
