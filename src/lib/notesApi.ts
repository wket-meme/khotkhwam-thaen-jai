import type { AccentColor, Note } from '../types/note'
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
