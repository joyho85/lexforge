// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(cleanup)

describe('LexForge deck selection and learning flow', () => {
  beforeEach(() => localStorage.clear())

  it('presents US daily-life and academic English as two separate routes', () => {
    render(<App />)
    expect(screen.getByText('美國生活')).toBeInTheDocument()
    expect(screen.getByText('學術英文')).toBeInTheDocument()
  })

  it('starts the B2 CEFR deck with a general-English word', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'B2 中高級' }))
    fireEvent.click(screen.getByRole('button', { name: '開始今日訓練' }))
    expect(screen.getByText('compromise')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '顯示答案' }))
    expect(screen.getByText('妥協；折衷方案')).toBeInTheDocument()
  })

  it('starts GRE as a separate exam deck', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'GRE 字庫' }))
    fireEvent.click(screen.getByRole('button', { name: '開始今日訓練' }))
    expect(screen.getByText('recondite')).toBeInTheDocument()
  })

  it('starts the US daily-life B2 deck with a communicative word', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'B2 中高級' }))
    fireEvent.click(screen.getByRole('button', { name: '開始今日訓練' }))
    expect(screen.getByText('compromise')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '顯示答案' }))
    expect(screen.getByText('妥協；折衷方案')).toBeInTheDocument()
  })

  it('starts the academic TOEFL deck with an academic word', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'TOEFL 字庫' }))
    fireEvent.click(screen.getByRole('button', { name: '開始今日訓練' }))
    expect(screen.getByText('ubiquitous')).toBeInTheDocument()
  })
})
