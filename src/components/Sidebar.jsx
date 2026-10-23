import React, { useMemo, useState } from 'react'
import { modules } from '../content/index.js'
import { lessonHref } from '../lib/router.js'

export default function Sidebar({ route, progress, open, onNavigate }) {
  const [query, setQuery] = useState('')
  const done = progress.state.lessons

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return modules
    return modules
      .map((m) => ({
        ...m,
        lessons: m.lessons.filter((l) => {
          const text = (l.title + ' ' + m.title + ' ' + JSON.stringify(l.blocks)).toLowerCase()
          return text.includes(q)
        }),
      }))
      .filter((m) => m.lessons.length)
  }, [query])

  const pageLink = (href, label, page) => (
    <a href={href} className={`nav-page${route.page === page ? ' active' : ''}`} onClick={onNavigate}>
      {label}
    </a>
  )

  return (
    <nav className={`sidebar${open ? ' open' : ''}`} aria-label="Course">
      <div className="nav-pages">
        {pageLink('#/', 'Home', 'home')}
        {pageLink('#/roadmap', '12-week roadmap', 'roadmap')}
        {pageLink('#/prompts', 'Prompt library', 'prompts')}
        {pageLink('#/glossary', 'Glossary & links', 'glossary')}
      </div>
      <label className="search">
        <span className="sr-only">Search lessons</span>
        <input type="search" placeholder="Search lessons…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <ol className="nav-modules">
        {filtered.map((m) => {
          const finished = m.lessons.filter((l) => done[`${m.id}/${l.id}`]).length
          const isCurrent = route.page === 'learn' && route.a === m.id
          return (
            <li key={m.id} className={`nav-module c-${m.color}`}>
              <details open={isCurrent || !!query}>
                <summary>
                  <span className="nav-num" aria-hidden="true">{m.num}</span>
                  <span className="nav-title">{m.title}</span>
                  <span className="nav-count">{finished}/{m.lessons.length}</span>
                </summary>
                <ol>
                  {m.lessons.map((l) => {
                    const active = route.page === 'learn' && route.a === m.id && route.b === l.id
                    const isDone = done[`${m.id}/${l.id}`]
                    return (
                      <li key={l.id}>
                        <a
                          href={lessonHref(m.id, l.id)}
                          className={`nav-lesson${active ? ' active' : ''}${isDone ? ' done' : ''}`}
                          aria-current={active ? 'page' : undefined}
                          onClick={onNavigate}
                        >
                          <span className="nav-dot" aria-hidden="true" />
                          {l.title}
                        </a>
                      </li>
                    )
                  })}
                </ol>
              </details>
            </li>
          )
        })}
        {!filtered.length && <li className="nav-empty">No lessons match “{query}”.</li>}
      </ol>
    </nav>
  )
}
