import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { containsProfanity, PROFANITY_ERROR_TH } from '../lib/profanity'
import type { AccentColor } from '../types/note'
import { ACCENT_COLORS, MAX_NOTE_LENGTH } from '../types/note'

interface PlantFormProps {
  onPlant: (input: { nickname: string; text: string; accent: AccentColor }) => void | Promise<void>
}

export function PlantForm({ onPlant }: PlantFormProps) {
  const [nickname, setNickname] = useState('')
  const [text, setText] = useState('')
  const [accent, setAccent] = useState<AccentColor>('red')
  const [submitting, setSubmitting] = useState(false)

  const trimmedNick = nickname.trim().slice(0, 20)
  const trimmed = text.trim()

  const fieldError = useMemo(() => {
    if (!text) return ''
    if (trimmed.length > MAX_NOTE_LENGTH) {
      return `ข้อความยาวเกิน ${MAX_NOTE_LENGTH} ตัวอักษร`
    }
    if (containsProfanity(trimmed)) {
      return PROFANITY_ERROR_TH
    }
    return ''
  }, [text, trimmed])

  const nickError = useMemo(() => {
    if (!trimmedNick) return ''
    if (containsProfanity(trimmedNick)) {
      return PROFANITY_ERROR_TH
    }
    return ''
  }, [trimmedNick])

  const isEmpty = !trimmed
  const isOverLimit = trimmed.length > MAX_NOTE_LENGTH
  const hasProfanity = containsProfanity(trimmed, trimmedNick)
  const isInvalid = isEmpty || isOverLimit || hasProfanity

  const counterAtMax = text.length >= MAX_NOTE_LENGTH
  const counterNearLimit = !counterAtMax && text.length >= MAX_NOTE_LENGTH - 5
  const counterOver = text.length > MAX_NOTE_LENGTH
  const atMaxHint = counterAtMax
    ? `ครบ ${MAX_NOTE_LENGTH} ตัวอักษรแล้ว — พิมพ์ต่อไม่ได้`
    : ''

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isInvalid || submitting) return
    setSubmitting(true)
    try {
      await onPlant({
        nickname: trimmedNick,
        text: trimmed,
        accent,
      })
      setNickname('')
      setText('')
    } catch {
      // Parent surfaces error; keep form values for retry
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="plant-form" onSubmit={handleSubmit} noValidate>
      <h2 className="section-title">ปักข้อความ</h2>
      <p className="section-hint">เขียนข้อความสั้น ๆ แทนใจ แล้ววางลงบนกระดานกระดาษครีม</p>

      <label className="field">
        <span className="field__label">ชื่อเล่น (ไม่บังคับ)</span>
        <input
          className="field__input"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value.slice(0, 20))}
          placeholder="เช่น นกน้อย"
          maxLength={20}
          autoComplete="off"
        />
        {nickError ? (
          <span className="field__feedback field__feedback--error" role="alert">
            {nickError}
          </span>
        ) : null}
      </label>

      <label className="field">
        <span className="field__label">
          ข้อความ <em>สูงสุด {MAX_NOTE_LENGTH} ตัวอักษร</em>
        </span>
        <textarea
          className={`field__input field__textarea${fieldError ? ' is-invalid' : ''}`}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_NOTE_LENGTH))}
          placeholder="อยากบอกอะไรจากใจ…"
          rows={2}
          maxLength={MAX_NOTE_LENGTH}
          aria-invalid={Boolean(fieldError)}
          aria-describedby="message-feedback"
        />
        <div className="field__meta" id="message-feedback">
          <span
            className={`field__feedback${
              fieldError
                ? ' field__feedback--error'
                : atMaxHint
                  ? ' field__feedback--warn'
                  : isEmpty
                    ? ' field__feedback--hint'
                    : ''
            }`}
            role={fieldError || atMaxHint ? 'status' : undefined}
            aria-live={fieldError || atMaxHint ? 'polite' : undefined}
          >
            {fieldError || atMaxHint || (isEmpty ? 'กรุณาเขียนข้อความสั้น ๆ' : '\u00a0')}
          </span>
          <span
            className={`field__counter${
              counterOver ? ' is-over' : counterAtMax ? ' is-at-max' : counterNearLimit ? ' is-near' : ''
            }`}
          >
            {text.length}/{MAX_NOTE_LENGTH}
          </span>
        </div>
      </label>

      <fieldset className="accent-pick">
        <legend className="field__label">สีปากกาไฮไลต์</legend>
        <div className="accent-pick__row" role="group" aria-label="เลือกสีปากกา">
          {(Object.keys(ACCENT_COLORS) as AccentColor[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`accent-swatch${accent === key ? ' is-selected' : ''}`}
              style={{ '--swatch': ACCENT_COLORS[key].hex } as CSSProperties}
              onClick={() => setAccent(key)}
              aria-pressed={accent === key}
              aria-label={ACCENT_COLORS[key].label}
              title={ACCENT_COLORS[key].label}
            >
              <span className="accent-swatch__dot" aria-hidden="true" />
              <span className="accent-swatch__name">{ACCENT_COLORS[key].label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="btn-plant" disabled={isInvalid || submitting}>
        ปักลงกระดาน
      </button>
    </form>
  )
}
