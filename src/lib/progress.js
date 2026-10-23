import { useCallback, useEffect, useState } from 'react'

// Everything you finish is saved in this browser only (localStorage).
// Use the Export / Import buttons on the Home page to move progress between devices.
const KEY = 'brick-by-brick-progress-v1'

const EMPTY = { lessons: {}, checks: {}, quizzes: {}, notes: {} }

function read() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw)
    return { ...EMPTY, ...parsed }
  } catch {
    return { ...EMPTY }
  }
}

function write(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage blocked (private mode) — progress just won't persist */
  }
}

export function useProgress() {
  const [state, setState] = useState(read)

  useEffect(() => {
    write(state)
  }, [state])

  const toggleLesson = useCallback((id) => {
    setState((s) => {
      const lessons = { ...s.lessons }
      if (lessons[id]) delete lessons[id]
      else lessons[id] = Date.now()
      return { ...s, lessons }
    })
  }, [])

  const setLessonDone = useCallback((id) => {
    setState((s) => (s.lessons[id] ? s : { ...s, lessons: { ...s.lessons, [id]: Date.now() } }))
  }, [])

  const toggleCheck = useCallback((id) => {
    setState((s) => {
      const checks = { ...s.checks }
      if (checks[id]) delete checks[id]
      else checks[id] = true
      return { ...s, checks }
    })
  }, [])

  const saveQuiz = useCallback((id, score, total) => {
    setState((s) => {
      const prev = s.quizzes[id]
      const best = prev ? Math.max(prev.best, score) : score
      return { ...s, quizzes: { ...s.quizzes, [id]: { best, total, last: score } } }
    })
  }, [])

  const saveNote = useCallback((id, text) => {
    setState((s) => ({ ...s, notes: { ...s.notes, [id]: text } }))
  }, [])

  const reset = useCallback(() => setState({ ...EMPTY }), [])

  const importState = useCallback((obj) => {
    if (obj && typeof obj === 'object') setState({ ...EMPTY, ...obj })
  }, [])

  return { state, toggleLesson, setLessonDone, toggleCheck, saveQuiz, saveNote, reset, importState }
}
