export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.company || !body.role || !body.startDate) {
    throw createError({ statusCode: 400, message: 'company, role, and startDate are required' })
  }
  return await addItem('experience', body)
})
