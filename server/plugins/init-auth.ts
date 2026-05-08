export default defineNitroPlugin(async () => {
  const storage = useStorage('data')
  const hasAuth = await storage.hasItem('auth')
  if (!hasAuth) {
    // hashPassword is auto-imported from server/utils/auth.ts
    const { hash, salt } = hashPassword('admin')
    await storage.setItem('auth', { hash, salt })
    console.warn('\n⚠️  Default admin password is "admin" — change it at /admin/settings\n')
  }
})
