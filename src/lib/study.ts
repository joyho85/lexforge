import type { DeckId, ProgressMap, ReviewProgress, ReviewScore, Word } from './types'

const DAY_MS = 86_400_000

export function selectWords(words: Word[], deck: DeckId): Word[] {
  return words.filter((word) => word.deck === deck)
}

export function buildStudyQueue(words: Word[], progress: ProgressMap, now = new Date()): Word[] {
  const due: Word[] = []
  const unseen: Word[] = []

  for (const word of words) {
    const review = progress[word.id]
    if (!review) unseen.push(word)
    else if (new Date(review.dueAt).getTime() <= now.getTime()) due.push(word)
  }

  due.sort((a, b) => new Date(progress[a.id].dueAt).getTime() - new Date(progress[b.id].dueAt).getTime())
  return [...due, ...unseen]
}

export function gradeReview(
  previous: ReviewProgress | undefined,
  score: ReviewScore,
  now = new Date(),
): ReviewProgress {
  const current = previous ?? { repetitions: 0, interval: 0, ease: 2.5, dueAt: now.toISOString(), lastScore: 0 as ReviewScore }

  if (score === 0) {
    return {
      repetitions: 0,
      interval: 0,
      ease: Math.max(1.3, current.ease - 0.2),
      dueAt: new Date(now.getTime() + 10 * 60_000).toISOString(),
      lastScore: score,
    }
  }

  const repetitions = current.repetitions + 1
  const scoreFactor = score === 1 ? 0.75 : score === 2 ? 1 : 1.15
  const ease = Math.max(1.3, current.ease + (score === 3 ? 0.1 : score === 1 ? -0.15 : 0))
  const interval = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.max(1, Math.round(current.interval * ease * scoreFactor))

  return {
    repetitions,
    interval,
    ease,
    dueAt: new Date(now.getTime() + interval * DAY_MS).toISOString(),
    lastScore: score,
  }
}
