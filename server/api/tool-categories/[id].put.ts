export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const updated = await updateItem('tool-categories', id, {
    labelEn: body.labelEn,
    labelDe: body.labelDe,
  })
  if (!updated) throw createError({ statusCode: 404, message: 'Category not found' })
  return updated
})
