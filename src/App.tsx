import { useCallback, useEffect, useState } from 'react'
import { Gallery } from './components/Gallery'
import { PlantForm } from './components/PlantForm'
import { insertNote, isSharedGallery, listNotes } from './lib/notesApi'
import type { AccentColor, Note } from './types/note'

type View = 'plant' | 'gallery'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [view, setView] = useState<View>('plant')
  const [loading, setLoading] = useState(true)
  const [plantError, setPlantError] = useState('')
  const shared = isSharedGallery()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const loaded = await listNotes()
        if (!cancelled) setNotes(loaded)
      } catch (err) {
        console.error('Failed to load notes', err)
        if (!cancelled) setNotes([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handlePlant = useCallback(
    async (input: { nickname: string; text: string; accent: AccentColor }) => {
      setPlantError('')
      try {
        const next = await insertNote(input)
        setNotes((prev) => [next, ...prev.filter((n) => n.id !== next.id)])
        setView('gallery')
      } catch (err) {
        console.error('Failed to plant note', err)
        setPlantError('ปักข้อความไม่สำเร็จ กรุณาลองใหม่')
        throw err
      }
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
          ดูกระดาน ({loading ? '…' : notes.length})
        </button>
      </nav>

      <main className="main">
        {view === 'plant' ? (
          <>
            <PlantForm onPlant={handlePlant} />
            {plantError ? (
              <p className="field__feedback field__feedback--error" role="alert">
                {plantError}
              </p>
            ) : null}
          </>
        ) : loading ? (
          <p className="section-hint">กำลังโหลดกระดาน…</p>
        ) : (
          <Gallery notes={notes} onGoPlant={() => setView('plant')} />
        )}
      </main>

      <footer className="footer">
        <p>
          {shared
            ? 'กระดานสาธารณะร่วมกัน · ไม่มีบัญชี · MVP'
            : 'บันทึกในเบราว์เซอร์นี้เท่านั้น · ไม่มีบัญชี · MVP'}
        </p>
      </footer>
    </div>
  )
}
