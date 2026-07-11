import { describe, expect, it } from 'vitest'
import { WORDS } from './words'
import type { DeckId } from '../lib/types'

const decks: DeckId[] = ['CEFR_B2', 'CEFR_C1', 'CEFR_C2', 'TOEFL', 'GRE']
const lifeDecks: DeckId[] = ['CEFR_B2', 'CEFR_C1', 'CEFR_C2']
const academicDecks: DeckId[] = ['TOEFL', 'GRE']

describe('curated word bank', () => {
  it('contains five independent focused decks under two routes', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(60)
    expect(new Set(WORDS.map((word) => word.id)).size).toBe(WORDS.length)
    for (const deck of decks) {
      expect(WORDS.filter((word) => word.deck === deck).length).toBeGreaterThanOrEqual(12)
    }
  })

  it('assigns every word to a route and keeps life and academic separate', () => {
    const lifeWords = WORDS.filter((word) => lifeDecks.includes(word.deck))
    const academicWords = WORDS.filter((word) => academicDecks.includes(word.deck))
    expect(lifeWords).toHaveLength(215)
    expect(academicWords).toHaveLength(122)
    expect(lifeWords.every((word) => word.route === 'life')).toBe(true)
    expect(academicWords.every((word) => word.route === 'academic')).toBe(true)
  })

  it('uses communicative, general-English goals for CEFR (life) decks', () => {
    for (const word of WORDS.filter((item) => item.deck.startsWith('CEFR_'))) {
      expect(word.route).toBe('life')
      expect(word.learningFocus).toMatch(/生活|溝通|工作|觀點|語氣|精準|敘述|理解|表達|協商|社交|事務|規劃|求職|消費|醫療|保險|情緒|敘事|描述|生活|職場|租屋|銀行|行政|生活規劃/)
      expect(['neutral', 'informal', 'formal', 'literary']).toContain(word.register)
    }
  })

  it('provides bilingual definitions, examples and usage guidance', () => {
    for (const word of WORDS) {
      expect(word.definitionZh.trim()).not.toBe('')
      expect(word.definitionEn.trim()).not.toBe('')
      expect(word.example.trim()).not.toBe('')
      expect(word.exampleZh.trim()).not.toBe('')
      expect(word.phonetic.trim()).not.toBe('')
      expect(word.learningFocus.trim()).not.toBe('')
      expect(word.route).toMatch(/life|academic/)
    }
  })
})
