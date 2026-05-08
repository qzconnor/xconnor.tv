export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.label || !body.href) {
    throw createError({ statusCode: 400, message: 'label and href are required' })
  }
  return await addItem('contacts', body)
})
