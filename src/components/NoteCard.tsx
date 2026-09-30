import type { CSSProperties } from 'react'
import type { Note } from '../types/note'
import { ACCENT_COLORS } from '../types/note'

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
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
        {note.nickname ? (
          <p className="note-card__author">— {note.nickname}</p>
        ) : (
          <p className="note-card__author note-card__author--anon">— ไม่ระบุชื่อ</p>
        )}
      </div>
    </article>
  )
}
