import type { Note } from '../types/note'
import { STORAGE_KEY } from '../types/note'

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidNote)
  } catch {
    return []
  }
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

function isValidNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false
  const n = value as Record<string, unknown>
  return (
    typeof n.id === 'string' &&
    typeof n.nickname === 'string' &&
    typeof n.text === 'string' &&
    typeof n.accent === 'string' &&
    typeof n.createdAt === 'number'
  )
}
