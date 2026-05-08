const WRITE_PROTECTED = ['/api/skills', '/api/tools', '/api/experience', '/api/status', '/api/contacts', '/api/projects', '/api/tool-categories']
const ALWAYS_PROTECTED = ['/api/auth/logout', '/api/auth/password']

export default defineEventHandler(async (event) => {
  const path = event.path
  const method = event.method

  const isAlwaysProtected = ALWAYS_PROTECTED.some(p => path === p || path.startsWith(p + '/'))
  const isWriteProtected = WRITE_PROTECTED.some(p => path === p || path.startsWith(p + '/'))

  // Public: GET requests to portfolio data endpoints
  if (isWriteProtected && method === 'GET') return
  if (!isAlwaysProtected && !isWriteProtected) return

  const token = getCookie(event, SESSION_COOKIE)
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const valid = await validateSession(token)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Session expired' })
  }
})
