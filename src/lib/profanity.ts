/**
 * Client-side MVP blocklist for note text + nickname.
 * Extend THAI_BLOCKLIST / ENGLISH_BLOCKLIST as needed.
 * Matching is case-insensitive for English; Thai terms match as substrings.
 */

const THAI_BLOCKLIST: string[] = [
  'เหี้ย',
  'เฮี้ย',
  'ควาย',
  'ควย',
  'หี',
  'หำ',
  'เย็ด',
  'เยด',
  'สัตว์',
  'สัส',
  'แม่ง',
  'มึง',
  'กู',
  'ไอ้สัตว์',
  'ไอ้สัส',
  'ชาติหมา',
  'เชี่ย',
  'เชี้ย',
]

const ENGLISH_BLOCKLIST: string[] = [
  'fuck',
  'fucker',
  'fucking',
  'shit',
  'asshole',
  'bitch',
  'bastard',
  'cunt',
  'dick',
  'piss',
  'whore',
  'slut',
  'motherfucker',
  'nigger',
  'nigga',
]

const THAI = THAI_BLOCKLIST.map((w) => w.trim()).filter(Boolean)
const ENGLISH = ENGLISH_BLOCKLIST.map((w) => w.trim().toLowerCase()).filter(Boolean)

function normalize(input: string): string {
  return input.normalize('NFC').trim()
}

function containsThaiProfanity(text: string): boolean {
  const n = normalize(text)
  if (!n) return false
  return THAI.some((term) => n.includes(term))
}

function containsEnglishProfanity(text: string): boolean {
  const n = normalize(text).toLowerCase()
  if (!n) return false
  return ENGLISH.some((term) => n.includes(term))
}

/** Returns true if nickname or note text should be blocked. */
export function containsProfanity(...fields: string[]): boolean {
  return fields.some(
    (field) => containsThaiProfanity(field) || containsEnglishProfanity(field),
  )
}

export const PROFANITY_ERROR_TH =
  'มีคำที่ไม่เหมาะสม กรุณาแก้ข้อความ'
