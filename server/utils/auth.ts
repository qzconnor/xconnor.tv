import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const SESSION_COOKIE = 'admin_session'

export { SESSION_COOKIE }

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return { hash, salt }
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const hashBuffer = Buffer.from(hash, 'hex')
    const derivedHash = scryptSync(password, salt, 64)
    return timingSafeEqual(hashBuffer, derivedHash)
  } catch {
    return false
  }
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createSession(token: string): Promise<void> {
  await useStorage('data').setItem(`session:${token}`, {
    expires: Date.now() + SESSION_EXPIRY_MS,
  })
}

export async function validateSession(token: string): Promise<boolean> {
  const session = await useStorage('data').getItem<{ expires: number }>(`session:${token}`)
  if (!session) return false
  if (session.expires < Date.now()) {
    await useStorage('data').removeItem(`session:${token}`)
    return false
  }
  return true
}

export async function deleteSession(token: string): Promise<void> {
  await useStorage('data').removeItem(`session:${token}`)
}
