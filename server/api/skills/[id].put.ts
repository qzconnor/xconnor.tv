export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const updated = await updateItem('skills', id, body)
  if (!updated) throw createError({ statusCode: 404, message: 'Skill not found' })
  return updated
})
