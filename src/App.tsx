import { useMemo, useState } from 'react'
import './App.css'
import { WORDS } from './data/words'
import { buildStudyQueue, gradeReview, selectWords } from './lib/study'
import type { DeckId, ProgressMap, ReviewScore, RouteId, Word, NewsItem } from './lib/types'
import newsData from './news.json'

const STORAGE_KEY = 'lexforge-progress-v2'
const SESSION_SIZE = 10

const DECKS: Record<DeckId, { short: string; title: string; subtitle: string; route: RouteId }> = {
  CEFR_B2: { short: 'B2', title: 'B2 中高級', subtitle: '獨立溝通、權衡利弊、處理生活與工作情境', route: 'life' },
  CEFR_C1: { short: 'C1', title: 'C1 高級', subtitle: '流暢處理專業、社交與含蓄訊息', route: 'life' },
  CEFR_C2: { short: 'C2', title: 'C2 精通', subtitle: '近母語的精準語氣、細微差異與統整能力', route: 'life' },
  TOEFL: { short: 'TOEFL', title: 'TOEFL 字庫', subtitle: '學術閱讀、講座與跨學科核心字彙', route: 'academic' },
  GRE: { short: 'GRE', title: 'GRE 字庫', subtitle: '高難度閱讀、填空與精確辨義', route: 'academic' },
}

const ROUTES: { id: RouteId; icon: string; eyebrow: string; title: string; desc: string; decks: DeckId[] }[] = [
  { id: 'life', icon: '◎', eyebrow: 'US DAILY LIFE ROUTE', title: '美國生活', desc: '在美國真實生活、職場與社交中需要用到的 B2–C2 高階溝通字，依能力級別分級。', decks: ['CEFR_B2', 'CEFR_C1', 'CEFR_C2'] },
  { id: 'academic', icon: '◇', eyebrow: 'ACADEMIC ROUTE', title: '學術英文', desc: '以考試文本與題型為導向：TOEFL 學術閱讀與 GRE 高難度填空，和「美國生活」路線獨立分類。', decks: ['TOEFL', 'GRE'] },
]

function readProgress(): ProgressMap {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as ProgressMap }
  catch { return {} }
}

function playAudio(id: string, kind: 'word' | 'example', fallbackText: string) {
  const url = `${import.meta.env.BASE_URL}audio/${id}_${kind}.mp3`
  const audio = new Audio(url)
  audio.play().catch(() => {
    if (!('speechSynthesis' in window)) return
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(fallbackText)
    utterance.lang = 'en-US'
    utterance.rate = 0.82
    speechSynthesis.speak(utterance)
  })
}

function App() {
  const [view, setView] = useState<'home' | 'study' | 'news' | 'done'>('home')
  const [deck, setDeck] = useState<DeckId>('CEFR_B2')
  const [progress, setProgress] = useState<ProgressMap>(readProgress)
  const [queue, setQueue] = useState<Word[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const news: NewsItem[] = newsData.items
  const [newsOpen, setNewsOpen] = useState<NewsItem | null>(null)

  const selectedWords = useMemo(() => selectWords(WORDS, deck), [deck])
  const deckProgress = selectedWords.map((word) => progress[word.id]).filter(Boolean)
  const mastered = deckProgress.filter((item) => item.repetitions >= 3).length
  const dueCount = buildStudyQueue(selectedWords, progress).filter((word) => progress[word.id]).length
  const current = queue[index]
  const sessionPercent = queue.length ? Math.round((index / queue.length) * 100) : 0

  function startSession() {
    const nextQueue = buildStudyQueue(selectedWords, progress).slice(0, SESSION_SIZE)
    setQueue(nextQueue)
    setIndex(0)
    setRevealed(false)
    setSessionCorrect(0)
    setView(nextQueue.length ? 'study' : 'done')
  }

  function startReviewAll() {
    const all = [...selectedWords]
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[all[i], all[j]] = [all[j], all[i]]
    }
    setQueue(all.slice(0, SESSION_SIZE))
    setIndex(0)
    setRevealed(false)
    setSessionCorrect(0)
    setView('study')
  }

  function review(score: ReviewScore) {
    if (!current) return
    const nextProgress = { ...progress, [current.id]: gradeReview(progress[current.id], score) }
    setProgress(nextProgress)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress))
    if (score >= 2) setSessionCorrect((value) => value + 1)
    if (index + 1 >= queue.length) setView('done')
    else { setIndex((value) => value + 1); setRevealed(false) }
  }

  if (newsOpen) {
    const item = newsOpen
    return (
      <main className="app-shell news-detail-shell">
        <header className="study-header">
          <button className="icon-button" onClick={() => setNewsOpen(null)} aria-label="返回新聞列表">←</button>
          <div className="news-detail-meta"><span>{item.date}</span></div>
        </header>
        <article className="news-article">
          <h1>{item.title}</h1>
          <p className="news-date">{item.date} · 來源 VOA News</p>
          {item.body.map((p, i) => <p key={i} className="news-para">{p}</p>)}
          <a className="news-source-link" href={item.url} target="_blank" rel="noreferrer">閱讀完整原文 ↗</a>
        </article>
      </main>
    )
  }

  if (view === 'news') {
    return (
      <main className="app-shell news-shell">
        <header className="study-header">
          <button className="icon-button" onClick={() => setView('home')} aria-label="返回首頁">←</button>
          <div className="news-header-title"><span>本週新聞</span><small>VOA News · 每週更新</small></div>
        </header>
        <section className="news-list">
          {news.map((n, i) => (
            <button key={i} className="news-card" onClick={() => setNewsOpen(n)}>
              <span className="news-card-date">{n.date}</span>
              <span className="news-card-title">{n.title}</span>
              <span className="news-card-arrow">→</span>
            </button>
          ))}
        </section>
      </main>
    )
  }

  if (view === 'study' && current) {
    const meta = DECKS[current.deck]
    return (
      <main className="app-shell study-shell">
        <header className="study-header">
          <button className="icon-button" onClick={() => setView('home')} aria-label="返回首頁">←</button>
          <div className="session-progress" aria-label={`學習進度 ${sessionPercent}%`}><span style={{ width: `${sessionPercent}%` }} /></div>
          <span className="session-count">{index + 1} / {queue.length}</span>
        </header>
        <section className="study-card" aria-live="polite">
          <div className="word-meta">
            <span className={`level-badge ${current.route === 'life' ? `level-${meta.short.toLowerCase()}` : 'exam-badge'}`}>{meta.short}</span>
            <span className="track-badge">{current.route === 'life' ? 'LIFE' : 'EXAM'}</span>
            <span className="track-badge">{current.register}</span>
          </div>
          <div className="word-heading-row">
            <div><h1 className="word">{current.word}</h1><p className="phonetic">{current.phonetic} · {current.partOfSpeech}</p></div>
            <button className="sound-button" onClick={() => playAudio(current.id, 'word', current.word)} aria-label={`播放 ${current.word} 發音`}>♫</button>
          </div>
          {!revealed ? (
            <div className="recall-prompt"><p>先在心裡說出意思，再揭曉答案。</p><button className="primary-button wide" onClick={() => setRevealed(true)}>顯示答案</button></div>
          ) : (
            <div className="answer-panel">
              <h2>{current.definitionZh}</h2>
              <p className="english-definition">{current.definitionEn}</p>
              <div className="example-box"><p>{current.example}</p><button className="sound-button inline-sound" onClick={() => playAudio(current.id, 'example', current.example)} aria-label={`播放例句發音`}>♫</button><p>{current.exampleZh}</p></div>
              <p className="learning-focus"><strong>這張卡練什麼：</strong>{current.learningFocus}</p>
              {current.synonyms && <p className="synonyms"><strong>近義：</strong>{current.synonyms.join(' · ')}</p>}
              <div className="rating-grid">
                <button aria-label="忘了" className="rate rate-again" onClick={() => review(0)}><strong>忘了</strong><small>10 分鐘</small></button>
                <button aria-label="有點難" className="rate rate-hard" onClick={() => review(1)}><strong>有點難</strong><small>明天</small></button>
                <button aria-label="記得" className="rate rate-good" onClick={() => review(2)}><strong>記得</strong><small>穩定複習</small></button>
                <button aria-label="完全記得" className="rate rate-easy" onClick={() => review(3)}><strong>完全記得</strong><small>拉長間隔</small></button>
              </div>
            </div>
          )}
        </section>
        <p className="study-tip">CEFR 評的是實際溝通能力；單字卡同時標出語境、語氣與使用目的。</p>
      </main>
    )
  }

  if (view === 'done') {
    return (
      <main className="app-shell completion-shell"><section className="completion-card">
        <div className="completion-mark">✓</div><span className="eyebrow">SESSION COMPLETE</span>
        <h1>今天的字彙訓練<br />已完成</h1><p>{DECKS[deck].title}：完成 {queue.length} 個，記得或完全記得 {sessionCorrect} 個。</p>
        <div className="completion-stats"><div><strong>{sessionCorrect}</strong><span>答對</span></div><div><strong>{queue.length-sessionCorrect}</strong><span>需加強</span></div><div><strong>{mastered}</strong><span>本級熟練</span></div></div>
        <button className="primary-button wide" onClick={() => setView('home')}>回到首頁</button>
      </section></main>
    )
  }

  const renderDeckButton = (id: DeckId) => {
    const meta = DECKS[id]
    return <button key={id} aria-label={meta.title} className={`deck-option ${deck === id ? 'active' : ''}`} onClick={() => setDeck(id)}><strong>{meta.short}</strong><span>{meta.title.replace(`${meta.short} `,'')}</span><small>{meta.subtitle}</small></button>
  }

  return (
    <main className="app-shell">
      <header className="topbar"><a className="brand" href="#top" aria-label="LexForge 首頁"><span>LF</span> LexForge</a><div className="topbar-right"><button className="news-nav" onClick={() => setView('news')}>📰 本週新聞</button><div className="streak"><span>◒</span> 今日訓練</div></div></header>
      <section className="hero" id="top">
        <div className="hero-copy"><span className="eyebrow">美國生活 B2–C2 · 學術英文 TOEFL／GRE</span><h1>兩條路線，<br />清楚分流</h1><p>「美國生活」按 B2–C2 級別收真實溝通字；「學術英文」按 TOEFL、GRE 收考試導向字。能力級別與考試分類不再混為一談。</p><button className="primary-button" onClick={startSession}>開始 {DECKS[deck].short} 訓練 <span>→</span></button><button className="secondary-button" onClick={startReviewAll}>全部複習（{selectedWords.length} 字）</button></div>
        <div className="hero-visual" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="floating-word word-a">compromise</div><div className="floating-word word-b">ambivalent</div><div className="floating-word word-c">recondite</div><div className="core-mark">C<span>2</span></div></div>
      </section>

      <section className="route-grid">
        {ROUTES.map((route) => (
          <article key={route.id} className={`panel route-panel ${route.id}-panel`}>
            <div className="route-heading">
              <span className="route-icon">{route.icon}</span>
              <div>
                <span className="eyebrow">{route.eyebrow}</span>
                <h2>{route.title}</h2>
                <p>{route.desc}</p>
              </div>
            </div>
            <div className={`deck-options ${route.id === 'academic' ? 'exam-options' : ''}`}>
              {route.decks.map((id) => renderDeckButton(id))}
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid progress-grid">
        <article className="panel focus-panel"><div className="panel-heading"><div><span className="eyebrow">SELECTED</span><h2>{DECKS[deck].title}</h2></div><span className="word-total">{selectedWords.length} 字</span></div><p className="deck-description">{DECKS[deck].subtitle}</p><button className="primary-button wide" onClick={startSession}>開始今日訓練</button></article>
        <article className="panel stats-panel"><span className="eyebrow">PROGRESS</span><h2>這個字庫的進度</h2><div className="stat-row"><div><strong>{deckProgress.length}</strong><span>已學習</span></div><div><strong>{dueCount}</strong><span>待複習</span></div><div><strong>{mastered}</strong><span>已熟練</span></div></div><div className="mastery-meter"><div className="meter-label"><span>{DECKS[deck].short} 掌握度</span><strong>{Math.round((mastered/selectedWords.length)*100)}%</strong></div><div className="meter-track"><span style={{width:`${(mastered/selectedWords.length)*100}%`}}/></div></div></article>
      </section>

      <section className="principles"><div className="section-title"><span className="eyebrow">CLASSIFICATION STANDARD</span><h2>不是只看「字很難」就叫 C2</h2></div><div className="principle-grid"><article><span className="principle-number">B2</span><h3>獨立而有效的溝通</h3><p>練習協商、說服、敘述經驗、分析選項，以及處理生活與職場問題。</p></article><article><span className="principle-number">C1</span><h3>流暢的專業表達</h3><p>練習組織複雜論點、掌握含蓄訊息，並調整正式與社交場合的語氣。</p></article><article><span className="principle-number">C2</span><h3>近母語的精準與細膩</h3><p>練習細微態度、反諷、語域與言外之意，而不只是罕見或學術單字。</p></article></div></section>
      <footer><span>LexForge</span><p>能力分級與考試字庫，清楚分流。</p></footer>
    </main>
  )
}

export default App
