import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Gallery } from './components/Gallery'
import { PlantForm } from './components/PlantForm'
import {
  isAdminPinConfigured,
  isAdminUnlocked,
  lockAdmin,
  tryUnlockAdmin,
} from './lib/admin'
import {
  CLOUD_DELETE_BLOCKED_TH,
  deleteNote,
  insertNote,
  isSharedGallery,
  listNotes,
} from './lib/notesApi'
import type { AccentColor, Note } from './types/note'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [plantError, setPlantError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [adminUnlocked, setAdminUnlocked] = useState(() => isAdminUnlocked())
  const [pinPromptOpen, setPinPromptOpen] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const shared = isSharedGallery()
  const pinConfigured = isAdminPinConfigured()

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
      } catch (err) {
        console.error('Failed to plant note', err)
        setPlantError('ปักข้อความไม่สำเร็จ กรุณาลองใหม่')
        throw err
      }
    },
    [],
  )

  const handleDelete = useCallback(async (id: string) => {
    if (!isAdminUnlocked()) return
    setDeleteError('')
    setDeletingId(id)
    try {
      await deleteNote(id)
      setNotes((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      console.error('Failed to delete note', err)
      const msg =
        err instanceof Error && err.message
          ? err.message
          : CLOUD_DELETE_BLOCKED_TH
      setDeleteError(msg)
    } finally {
      setDeletingId(null)
    }
  }, [])

  function handleUnlockSubmit(e: FormEvent) {
    e.preventDefault()
    setPinError('')
    if (tryUnlockAdmin(pinInput)) {
      setAdminUnlocked(true)
      setPinPromptOpen(false)
      setPinInput('')
    } else {
      setPinError('รหัสไม่ถูกต้อง')
    }
  }

  function handleLock() {
    lockAdmin()
    setAdminUnlocked(false)
    setDeleteError('')
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="hero__eyebrow">messages for the heart</p>
        <h1 className="hero__title">ข้อความแทนใจ</h1>
        <p className="hero__subtitle">
          เขียนข้อความสั้น ๆ แทนใจ ปักลงกระดานกระดาษครีม — ไม่ต้องมีบัญชี
        </p>
      </header>

      <div className="layout">
        <aside className="layout__board panel">
          <Gallery
            notes={notes}
            loading={loading}
            adminUnlocked={adminUnlocked}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
          {deleteError ? (
            <p className="field__feedback field__feedback--error layout__alert" role="alert">
              {deleteError}
            </p>
          ) : null}
        </aside>

        <section className="layout__plant panel panel--plant">
          <PlantForm onPlant={handlePlant} />
          {plantError ? (
            <p className="field__feedback field__feedback--error" role="alert">
              {plantError}
            </p>
          ) : null}
        </section>
      </div>

      <footer className="footer">
        <p>
          {shared
            ? 'กระดานสาธารณะร่วมกัน · ไม่มีบัญชี · MVP'
            : 'บันทึกในเบราว์เซอร์นี้เท่านั้น · ไม่มีบัญชี · MVP'}
        </p>
        {pinConfigured ? (
          <div className="footer__admin">
            {adminUnlocked ? (
              <button type="button" className="footer__admin-btn" onClick={handleLock}>
                ล็อกแอดมิน
              </button>
            ) : pinPromptOpen ? (
              <form className="footer__pin" onSubmit={handleUnlockSubmit}>
                <label className="visually-hidden" htmlFor="admin-pin">
                  รหัสแอดมิน
                </label>
                <input
                  id="admin-pin"
                  className="footer__pin-input"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                />
                <button type="submit" className="footer__admin-btn">
                  ปลดล็อก
                </button>
                <button
                  type="button"
                  className="footer__admin-btn footer__admin-btn--ghost"
                  onClick={() => {
                    setPinPromptOpen(false)
                    setPinInput('')
                    setPinError('')
                  }}
                >
                  ยกเลิก
                </button>
                {pinError ? (
                  <span className="field__feedback field__feedback--error" role="alert">
                    {pinError}
                  </span>
                ) : null}
              </form>
            ) : (
              <button
                type="button"
                className="footer__admin-btn footer__admin-btn--ghost"
                onClick={() => setPinPromptOpen(true)}
              >
                แอดมิน
              </button>
            )}
          </div>
        ) : null}
      </footer>
    </div>
  )
}
