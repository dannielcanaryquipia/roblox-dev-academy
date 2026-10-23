import React, { useEffect, useState } from 'react'
import { useProgress } from './lib/progress.js'
import { useTheme } from './lib/theme.js'
import { useRoute } from './lib/router.js'
import { allLessons, findLesson } from './content/index.js'
import Sidebar from './components/Sidebar.jsx'
import BrickTower from './components/BrickTower.jsx'
import { Home, LessonPage, Roadmap, Prompts, Glossary } from './components/Pages.jsx'

const TITLES = { home: 'Brick by Brick', roadmap: 'Roadmap', prompts: 'Prompt library', glossary: 'Glossary' }

const THEME_META = {
  system: { icon: '◐', label: 'Theme: match system' },
  light: { icon: '☀', label: 'Theme: light' },
  dark: { icon: '☾', label: 'Theme: dark' },
}

export default function App() {
  const progress = useProgress()
  const route = useRoute()
  const theme = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let title = TITLES[route.page] || 'Brick by Brick'
    if (route.page === 'learn') {
      const f = findLesson(route.a, route.b)
      if (f) title = f.lesson.title
    }
    document.title = title === 'Brick by Brick' ? title : `${title} · Brick by Brick`
  }, [route])

  const doneCount = Object.keys(progress.state.lessons).length
  const pct = Math.round((Math.min(doneCount, allLessons.length) / allLessons.length) * 100)

  let page
  if (route.page === 'learn') page = <LessonPage route={route} progress={progress} />
  else if (route.page === 'roadmap') page = <Roadmap progress={progress} />
  else if (route.page === 'prompts') page = <Prompts />
  else if (route.page === 'glossary') page = <Glossary />
  else page = <Home progress={progress} />

  return (
    <div className="shell">
      <a className="skip" href="#main">Skip to content</a>
      <header className="topbar">
        <button
          type="button"
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-controls="course-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span aria-hidden="true">☰</span>
          <span className="sr-only">Course menu</span>
        </button>
        <a href="#/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <i /><i /><b />
          </span>
          Brick by Brick
        </a>
        <div className="topbar-progress" title={`${doneCount} lessons done`}>
          <BrickTower done={progress.state.lessons} size="mini" perRow={allLessons.length} />
          <span>{pct}%</span>
        </div>
        <button
          type="button"
          className="theme-btn"
          onClick={theme.cycle}
          title={THEME_META[theme.mode].label}
        >
          <span aria-hidden="true">{THEME_META[theme.mode].icon}</span>
          <span className="sr-only">{THEME_META[theme.mode].label}. Click to change.</span>
        </button>
      </header>
      <div className="layout">
        <div id="course-nav">
          <Sidebar route={route} progress={progress} open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        </div>
        {menuOpen && <button type="button" className="scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
        <main id="main" tabIndex={-1}>{page}</main>
      </div>
    </div>
  )
}
