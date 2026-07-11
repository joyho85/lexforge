import { describe, expect, it } from 'vitest'
import { buildStudyQueue, gradeReview, selectWords } from './study'
import type { ProgressMap, Word } from './types'

const base = {
  phonetic: '/test/', partOfSpeech: 'adjective', definitionZh: '測試', definitionEn: 'used for testing',
  example: 'This is a test.', exampleZh: '這是測試。', topic: 'testing', register: 'neutral' as const,
}
const words: Word[] = [
  { ...base, id: 'b2-1', word: 'practical', deck: 'CEFR_B2', route: 'life', learningFocus: '在生活與工作中討論可行做法' },
  { ...base, id: 'c2-1', word: 'nuance', deck: 'CEFR_C2', route: 'life', learningFocus: '精準表達細微差異' },
  { ...base, id: 'gre-1', word: 'recondite', deck: 'GRE', route: 'academic', learningFocus: 'GRE 閱讀與填空辨義' },
]

describe('selectWords', () => {
  it('selects one explicit deck instead of intersecting CEFR with exams', () => {
    expect(selectWords(words, 'CEFR_B2').map((word) => word.id)).toEqual(['b2-1'])
    expect(selectWords(words, 'GRE').map((word) => word.id)).toEqual(['gre-1'])
  })
})

describe('buildStudyQueue', () => {
  it('puts due reviews before unseen words', () => {
    const progress: ProgressMap = {
      'b2-1': { repetitions: 2, interval: 6, ease: 2.5, dueAt: '2026-07-09T00:00:00.000Z', lastScore: 3 },
      'c2-1': { repetitions: 2, interval: 6, ease: 2.5, dueAt: '2026-07-12T00:00:00.000Z', lastScore: 3 },
    }
    expect(buildStudyQueue(words, progress, new Date('2026-07-10T00:00:00.000Z')).map((word) => word.id))
      .toEqual(['b2-1', 'gre-1'])
  })
})

describe('gradeReview', () => {
  it('advances a remembered word with a longer interval', () => {
    const result = gradeReview(undefined, 3, new Date('2026-07-10T00:00:00.000Z'))
    expect(result.repetitions).toBe(1)
    expect(result.interval).toBe(1)
    expect(result.dueAt).toBe('2026-07-11T00:00:00.000Z')
  })

  it('resets a forgotten word for same-day relearning', () => {
    const result = gradeReview(
      { repetitions: 4, interval: 18, ease: 2.6, dueAt: '2026-07-10T00:00:00.000Z', lastScore: 3 },
      0,
      new Date('2026-07-10T00:00:00.000Z'),
    )
    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(0)
    expect(result.dueAt).toBe('2026-07-10T00:10:00.000Z')
  })
})
