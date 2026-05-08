export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token || !(await validateSession(token))) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { currentPassword, newPassword } = await readBody<{
    currentPassword: string
    newPassword: string
  }>(event)

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, message: 'Both passwords are required' })
  }
  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, message: 'New password must be at least 6 characters' })
  }

  const auth = await useStorage('data').getItem<{ hash: string; salt: string }>('auth')
  if (!auth) {
    throw createError({ statusCode: 500, message: 'Auth not initialized' })
  }

  if (!verifyPassword(currentPassword, auth.hash, auth.salt)) {
    throw createError({ statusCode: 401, message: 'Current password is incorrect' })
  }

  const { hash, salt } = hashPassword(newPassword)
  await useStorage('data').setItem('auth', { hash, salt })

  return { success: true }
})
