export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.title || !body.description) {
    throw createError({ statusCode: 400, message: 'title and description are required' })
  }
  return await addItem('projects', body)
})
