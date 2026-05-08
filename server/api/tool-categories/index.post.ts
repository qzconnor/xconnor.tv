export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.value || !body.labelEn || !body.labelDe)
    throw createError({ statusCode: 400, message: 'value, labelEn, and labelDe are required' })
  const existing = await getItems('tool-categories')
  if ((existing as any[]).some((c: any) => c.value === body.value))
    throw createError({ statusCode: 409, message: 'A category with this key already exists' })
  return await addItem('tool-categories', { value: body.value, labelEn: body.labelEn, labelDe: body.labelDe })
})
