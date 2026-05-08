export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.name || !body.level || !body.category) {
    throw createError({ statusCode: 400, message: 'name, level, and category are required' })
  }
  return await addItem('skills', body)
})
