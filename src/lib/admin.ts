/**
 * Client-side MVP admin unlock.
 * Soft UX gate only: VITE_ADMIN_PIN is embedded in the Vite bundle.
 * Shared-gallery delete is authorized by the Edge Function against ADMIN_PIN
 * (server secret). The PIN kept in sessionStorage is only forwarded to that
 * function — it is not strong security by itself.
 */

const SESSION_FLAG_KEY = 'khotkhwam-thaen-jai-admin-unlocked'
const SESSION_PIN_KEY = 'khotkhwam-thaen-jai-admin-pin'

export function getAdminPin(): string {
  return (import.meta.env.VITE_ADMIN_PIN as string | undefined)?.trim() ?? ''
}

export function isAdminPinConfigured(): boolean {
  return getAdminPin().length > 0
}

export function isAdminUnlocked(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(SESSION_FLAG_KEY) === '1'
}

/** PIN entered at unlock — session only; used to call admin-delete-note. */
export function getSessionAdminPin(): string {
  if (typeof sessionStorage === 'undefined') return ''
  return sessionStorage.getItem(SESSION_PIN_KEY) ?? ''
}

export function tryUnlockAdmin(pin: string): boolean {
  const expected = getAdminPin()
  if (!expected) return false
  if (pin.trim() !== expected) return false
  sessionStorage.setItem(SESSION_FLAG_KEY, '1')
  sessionStorage.setItem(SESSION_PIN_KEY, pin.trim())
  return true
}

export function lockAdmin(): void {
  sessionStorage.removeItem(SESSION_FLAG_KEY)
  sessionStorage.removeItem(SESSION_PIN_KEY)
}
