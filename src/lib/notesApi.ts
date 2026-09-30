import type { AccentColor, Note } from '../types/note'
import { getSessionAdminPin } from './admin'
import { loadNotes, saveNotes } from './storage'
import { isSupabaseConfigured, supabase } from './supabase'

type DbNote = {
  id: string
  nickname: string | null
  body: string
  color: string
  created_at: string
}

const ACCENTS = new Set<string>(['red', 'blue', 'green', 'purple'])

/** Shown when cloud admin delete is refused or misconfigured. */
export const CLOUD_DELETE_BLOCKED_TH =
  'ลบบนคลาวด์ไม่สำเร็จ — ตรวจ PIN / Edge Function หรือลบใน Supabase Dashboard'

function createLocalId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function rowToNote(row: DbNote): Note {
  const accent = ACCENTS.has(row.color) ? (row.color as AccentColor) : 'red'
  return {
    id: row.id,
    nickname: row.nickname ?? '',
    text: row.body,
    accent,
    createdAt: new Date(row.created_at).getTime(),
  }
}

/** True when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set. */
export function isSharedGallery(): boolean {
  return isSupabaseConfigured
}

export async function listNotes(): Promise<Note[]> {
  if (!supabase) {
    return loadNotes()
  }

  const { data, error } = await supabase
    .from('notes')
    .select('id, nickname, body, color, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('listNotes failed', error)
    throw error
  }

  return ((data ?? []) as DbNote[]).map(rowToNote)
}

export async function insertNote(input: {
  nickname: string
  text: string
  accent: AccentColor
}): Promise<Note> {
  if (!supabase) {
    const note: Note = {
      id: createLocalId(),
      nickname: input.nickname,
      text: input.text,
      accent: input.accent,
      createdAt: Date.now(),
    }
    const existing = loadNotes()
    saveNotes([note, ...existing])
    return note
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({
      nickname: input.nickname || '',
      body: input.text,
      color: input.accent,
    })
    .select('id, nickname, body, color, created_at')
    .single()

  if (error) {
    console.error('insertNote failed', error)
    throw error
  }

  return rowToNote(data as DbNote)
}

/**
 * Delete a note.
 * localStorage: works after PIN unlock (client UX gate).
 * Supabase: calls Edge Function `admin-delete-note` with session PIN.
 * RLS has no anon DELETE — never delete via the anon client.
 */
export async function deleteNote(id: string): Promise<void> {
  if (!supabase) {
    const existing = loadNotes()
    saveNotes(existing.filter((n) => n.id !== id))
    return
  }

  const pin = getSessionAdminPin()
  if (!pin) {
    throw new Error(CLOUD_DELETE_BLOCKED_TH)
  }

  // Call the Edge Function with explicit fetch so browser CORS + auth headers
  // match what the function allows (functions.invoke can send extra headers).
  const base = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
  const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()
  if (!base || !anon) {
    throw new Error(CLOUD_DELETE_BLOCKED_TH)
  }

  let res: Response
  try {
    res = await fetch(`${base.replace(/\/$/, '')}/functions/v1/admin-delete-note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anon}`,
        apikey: anon,
      },
      body: JSON.stringify({ id, pin }),
    })
  } catch (error) {
    console.error('admin-delete-note network failed', error)
    throw new Error(CLOUD_DELETE_BLOCKED_TH)
  }

  let payload: { ok?: boolean; error?: string } | null = null
  try {
    payload = (await res.json()) as { ok?: boolean; error?: string }
  } catch {
    payload = null
  }

  if (!res.ok || !payload?.ok) {
    console.error('admin-delete-note rejected', res.status, payload?.error ?? 'unknown')
    throw new Error(CLOUD_DELETE_BLOCKED_TH)
  }
}
