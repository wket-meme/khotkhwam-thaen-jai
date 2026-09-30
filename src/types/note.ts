export type AccentColor = 'red' | 'blue' | 'green' | 'purple'

export interface Note {
  id: string
  nickname: string
  text: string
  accent: AccentColor
  createdAt: number
}

export const ACCENT_COLORS: Record<AccentColor, { label: string; hex: string }> = {
  red: { label: 'แดง', hex: '#e85d5d' },
  blue: { label: 'ฟ้า', hex: '#5b8def' },
  green: { label: 'เขียว', hex: '#4caf7a' },
  purple: { label: 'ม่วง', hex: '#9b6bdb' },
}

export const MAX_NOTE_LENGTH = 40
export const STORAGE_KEY = 'khotkhwam-thaen-jai-notes-v1'
