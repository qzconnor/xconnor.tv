export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, any>>(event)
  const storage = useStorage('data')
  const current = await storage.getItem<Record<string, any>>('status') ?? {}

  const updated = {
    ...current,
    ...body,
    // deep-merge sections if provided
    sections: body.sections
      ? { ...(current.sections ?? {}), ...body.sections }
      : current.sections,
  }

  await storage.setItem('status', updated)
  return updated
})
