export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const updated = await updateItem('experience', id, body)
  if (!updated) throw createError({ statusCode: 404, message: 'Experience not found' })
  return updated
})
