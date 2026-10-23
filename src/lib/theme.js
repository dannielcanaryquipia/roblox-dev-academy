import { useCallback, useEffect, useState } from 'react'

// Theme preference is saved per-browser. Default is 'system', which follows
// the OS light/dark setting. 'light' and 'dark' force a mode via a data-theme
// attribute on <html>, which styles.css reads.
const KEY = 'brick-by-brick-theme-v1'
const MODES = ['system', 'light', 'dark']

function read() {
  try {
    const v = window.localStorage.getItem(KEY)
    return MODES.includes(v) ? v : 'system'
  } catch {
    return 'system'
  }
}

function apply(mode) {
  const el = document.documentElement
  if (mode === 'system') el.removeAttribute('data-theme')
  else el.setAttribute('data-theme', mode)
}

export function useTheme() {
  const [mode, setMode] = useState(read)

  useEffect(() => {
    apply(mode)
    try {
      window.localStorage.setItem(KEY, mode)
    } catch {
      /* storage blocked (private mode) — preference just won't persist */
    }
  }, [mode])

  // cycle system -> light -> dark -> system
  const cycle = useCallback(() => {
    setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length])
  }, [])

  return { mode, cycle, setMode }
}
