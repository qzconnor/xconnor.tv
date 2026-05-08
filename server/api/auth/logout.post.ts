export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  if (token) await deleteSession(token)
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
  return { success: true }
})
