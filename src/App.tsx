import { useCallback, useEffect, useState } from 'react'
import { Gallery } from './components/Gallery'
import { PlantForm } from './components/PlantForm'
import { loadNotes, saveNotes } from './lib/storage'
import type { AccentColor, Note } from './types/note'

type View = 'plant' | 'gallery'

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes())
  const [view, setView] = useState<View>('plant')

  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const handlePlant = useCallback(
    (input: { nickname: string; text: string; accent: AccentColor }) => {
      const next: Note = {
        id: createId(),
        nickname: input.nickname,
        text: input.text,
        accent: input.accent,
        createdAt: Date.now(),
      }
      setNotes((prev) => [next, ...prev])
      setView('gallery')
    },
    [],
  )

  return (
    <div className="app">
      <header className="hero">
        <p className="hero__eyebrow">messages for the heart</p>
        <h1 className="hero__title">ข้อความแทนใจ</h1>
        <p className="hero__subtitle">
          เขียนข้อความสั้น ๆ แทนใจ ปักลงกระดานกระดาษครีม — ไม่ต้องมีบัญชี
        </p>
      </header>

      <nav className="tabs" aria-label="เมนูหลัก">
        <button
          type="button"
          className={`tabs__btn${view === 'plant' ? ' is-active' : ''}`}
          onClick={() => setView('plant')}
          aria-current={view === 'plant' ? 'page' : undefined}
        >
          ปักข้อความ
        </button>
        <button
          type="button"
          className={`tabs__btn${view === 'gallery' ? ' is-active' : ''}`}
          onClick={() => setView('gallery')}
          aria-current={view === 'gallery' ? 'page' : undefined}
        >
          ดูกระดาน ({notes.length})
        </button>
      </nav>

      <main className="main">
        {view === 'plant' ? (
          <PlantForm onPlant={handlePlant} />
        ) : (
          <Gallery notes={notes} onGoPlant={() => setView('plant')} />
        )}
      </main>

      <footer className="footer">
        <p>บันทึกในเบราว์เซอร์นี้เท่านั้น · ไม่มีบัญชี · MVP</p>
      </footer>
    </div>
  )
}
