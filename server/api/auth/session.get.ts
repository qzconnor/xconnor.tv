export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const valid = await validateSession(token)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Session expired' })
  }

  return { authenticated: true }
})
