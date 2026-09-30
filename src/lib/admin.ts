/** Client-side MVP admin unlock via VITE_ADMIN_PIN. Not strong security. */

const SESSION_KEY = 'khotkhwam-thaen-jai-admin-unlocked'

export function getAdminPin(): string {
  return (import.meta.env.VITE_ADMIN_PIN as string | undefined)?.trim() ?? ''
}

export function isAdminPinConfigured(): boolean {
  return getAdminPin().length > 0
}

export function isAdminUnlocked(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function tryUnlockAdmin(pin: string): boolean {
  const expected = getAdminPin()
  if (!expected) return false
  if (pin.trim() !== expected) return false
  sessionStorage.setItem(SESSION_KEY, '1')
  return true
}

export function lockAdmin(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
