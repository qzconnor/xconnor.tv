export default defineEventHandler(async (event) => {
  const { password } = await readBody<{ password: string }>(event)
  if (!password) {
    throw createError({ statusCode: 400, message: 'Password required' })
  }

  let auth = await useStorage('data').getItem<{ hash: string; salt: string }>('auth')
  if (!auth) {
    // Fallback: seed default password if plugin didn't run
    const { hash, salt } = hashPassword('admin')
    await useStorage('data').setItem('auth', { hash, salt })
    auth = { hash, salt }
    console.warn('⚠️  Auth seeded via login fallback. Default password: admin')
  }

  if (!verifyPassword(password, auth.hash, auth.salt)) {
    // Constant-time delay to prevent timing attacks
    await new Promise(r => setTimeout(r, 200))
    throw createError({ statusCode: 401, message: 'Invalid password' })
  }

  const token = generateSessionToken()
  await createSession(token)

  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return { success: true }
})
