import type { CSSProperties } from 'react'
import type { Note } from '../types/note'
import { ACCENT_COLORS } from '../types/note'

interface NoteCardProps {
  note: Note
  showDelete?: boolean
  onDelete?: (id: string) => void
  deleting?: boolean
}

export function NoteCard({ note, showDelete, onDelete, deleting }: NoteCardProps) {
  const accent = ACCENT_COLORS[note.accent] ?? ACCENT_COLORS.red
  const rotation = ((note.createdAt % 7) - 3) * 0.6

  return (
    <article
      className="note-card"
      style={
        {
          '--accent': accent.hex,
          transform: `rotate(${rotation}deg)`,
        } as CSSProperties
      }
    >
      <div className="note-card__strip" aria-hidden="true" />
      <div className="note-card__body">
        <p className="note-card__text">{note.text}</p>
        <div className="note-card__footer">
          {note.nickname ? (
            <p className="note-card__author">— {note.nickname}</p>
          ) : (
            <p className="note-card__author note-card__author--anon">— ไม่ระบุชื่อ</p>
          )}
          {showDelete && onDelete ? (
            <button
              type="button"
              className="note-card__delete"
              onClick={() => onDelete(note.id)}
              disabled={deleting}
              aria-label="ลบข้อความ"
              title="ลบข้อความ (แอดมิน)"
            >
              ลบ
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
