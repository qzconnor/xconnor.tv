export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.name || !body.category) {
    throw createError({ statusCode: 400, message: 'name and category are required' })
  }
  return await addItem('tools', body)
})
