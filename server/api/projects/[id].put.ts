export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const updated = await updateItem('projects', id, body)
  if (!updated) throw createError({ statusCode: 404, message: 'Project not found' })
  return updated
})
