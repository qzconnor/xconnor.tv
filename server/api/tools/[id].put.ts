export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const updated = await updateItem('tools', id, body)
  if (!updated) throw createError({ statusCode: 404, message: 'Tool not found' })
  return updated
})
