import type { Note } from '../types/note'
import { NoteCard } from './NoteCard'

interface GalleryProps {
  notes: Note[]
  onGoPlant?: () => void
}

export function Gallery({ notes, onGoPlant }: GalleryProps) {
  const sorted = [...notes].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <section className="gallery" aria-labelledby="gallery-heading">
      <div className="gallery__header">
        <h2 id="gallery-heading" className="section-title">
          กระดานข้อความ
        </h2>
        <p className="section-hint">
          {sorted.length === 0
            ? 'ยังไม่มีข้อความ — เป็นคนแรกที่ปักข้อความแทนใจ'
            : `${sorted.length} ข้อความบนกระดาน`}
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="gallery__empty">
          <p className="gallery__empty-msg">กระดานว่างเปล่า… ลองปักข้อความสั้น ๆ จากใจ</p>
          {onGoPlant ? (
            <button type="button" className="btn-plant btn-plant--inline" onClick={onGoPlant}>
              ไปปักข้อความ
            </button>
          ) : null}
        </div>
      ) : (
        <div className="gallery__board">
          {sorted.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </section>
  )
}
