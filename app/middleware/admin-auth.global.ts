export default defineNuxtRouteMiddleware(async (to) => {
  // Only guard /admin/* routes, leave /admin/login open
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') return

  // Forward cookies when running on the server (SSR)
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}

  try {
    await $fetch('/api/auth/session', { headers })
  } catch {
    return navigateTo('/admin/login')
  }
})
