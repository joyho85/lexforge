export type DeckId = 'CEFR_B2' | 'CEFR_C1' | 'CEFR_C2' | 'TOEFL' | 'GRE'
export type Register = 'neutral' | 'informal' | 'formal' | 'literary'
export type RouteId = 'life' | 'academic'

export interface Word {
  id: string
  word: string
  phonetic: string
  partOfSpeech: string
  definitionZh: string
  definitionEn: string
  example: string
  exampleZh: string
  deck: DeckId
  route: RouteId
  topic: string
  register: Register
  learningFocus: string
  note?: string
  synonyms?: string[]
}

export interface ReviewProgress {
  repetitions: number
  interval: number
  ease: number
  dueAt: string
  lastScore: ReviewScore
}

export type ReviewScore = 0 | 1 | 2 | 3
export type ProgressMap = Record<string, ReviewProgress>

export interface NewsItem {
  title: string
  date: string
  url: string
  body: string[]
  source: string
}
