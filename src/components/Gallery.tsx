import type { Note } from '../types/note'
import { NoteCard } from './NoteCard'

interface GalleryProps {
  notes: Note[]
  loading?: boolean
  adminUnlocked?: boolean
  deletingId?: string | null
  onDelete?: (id: string) => void
}

export function Gallery({
  notes,
  loading,
  adminUnlocked,
  deletingId,
  onDelete,
}: GalleryProps) {
  const sorted = [...notes].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <section className="gallery" aria-labelledby="gallery-heading">
      <div className="gallery__header">
        <h2 id="gallery-heading" className="section-title">
          กระดานข้อความ
        </h2>
        <p className="section-hint">
          {loading
            ? 'กำลังโหลดกระดาน…'
            : sorted.length === 0
              ? 'ยังไม่มีข้อความ — เป็นคนแรกที่ปักข้อความแทนใจ'
              : `${sorted.length} ข้อความบนกระดาน`}
        </p>
      </div>

      {loading ? (
        <div className="gallery__empty">
          <p className="gallery__empty-msg">กำลังโหลด…</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="gallery__empty">
          <p className="gallery__empty-msg">กระดานว่างเปล่า… ลองปักข้อความสั้น ๆ จากใจ</p>
        </div>
      ) : (
        <div className="gallery__board">
          {sorted.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              showDelete={adminUnlocked}
              onDelete={onDelete}
              deleting={deletingId === note.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
