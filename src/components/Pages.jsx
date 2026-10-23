import React, { useRef } from 'react'
import { modules, allLessons, allPrompts, findLesson, totalMinutes } from '../content/index.js'
import { roadmap } from '../content/roadmap.js'
import { glossary, resources } from '../content/glossary.js'
import { lessonHref } from '../lib/router.js'
import { Inline } from '../lib/inline.jsx'
import Blocks from './Blocks.jsx'
import BrickTower from './BrickTower.jsx'

/* ---------------- Home ---------------- */
export function Home({ progress }) {
  const done = progress.state.lessons
  const doneCount = Object.keys(done).filter((k) => allLessons.some((l) => l.key === k)).length
  const nextLesson = allLessons.find((l) => !done[l.key]) || allLessons[0]
  const fileRef = useRef(null)

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(progress.state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brick-by-brick-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  const importProgress = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then((t) => {
      try {
        progress.importState(JSON.parse(t))
      } catch {
        alert('That file is not a progress export from this site.')
      }
    })
    e.target.value = ''
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>Build a Roblox game that earns, brick by brick.</h1>
          <p className="lede">
            A self-study course for making your first Roblox games with Claude Code: Studio, Luau, saving data, two real projects,
            monetization and the DevEx cash-out. {allLessons.length} lessons, about {Math.round(totalMinutes / 60)} hours of reading,
            plus building time.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={lessonHref(nextLesson.moduleId, nextLesson.id)}>
              {doneCount === 0 ? 'Start the first lesson' : `Continue: ${nextLesson.title}`}
            </a>
            <a className="btn" href="#/roadmap">See the 12-week plan</a>
          </div>
        </div>
        <figure className="hero-tower">
          <BrickTower done={done} />
          <figcaption>
            <strong>{doneCount}</strong> of {allLessons.length} bricks placed. Each lesson you finish adds one.
          </figcaption>
        </figure>
      </section>

      <section className="module-list" aria-labelledby="path-h">
        <h2 id="path-h">The path</h2>
        <ol>
          {modules.map((m) => {
            const finished = m.lessons.filter((l) => done[`${m.id}/${l.id}`]).length
            const mins = m.lessons.reduce((n, l) => n + l.minutes, 0)
            return (
              <li key={m.id} className={`module-row c-${m.color}`}>
                <a href={lessonHref(m.id, m.lessons[0].id)}>
                  <span className="module-num" aria-hidden="true">{m.num}</span>
                  <span className="module-body">
                    <span className="module-title">{m.title}</span>
                    <span className="module-summary">{m.summary}</span>
                  </span>
                  <span className="module-meta">
                    {finished}/{m.lessons.length} done
                    <br />
                    {mins} min
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="progress-tools" aria-labelledby="pt-h">
        <h2 id="pt-h">Your progress</h2>
        <p>Progress, quiz scores and notes are saved in this browser. Export them to keep a backup or move to another device.</p>
        <div className="hero-actions">
          <button type="button" className="btn" onClick={exportProgress}>Export progress</button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>Import progress</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importProgress} />
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              if (confirm('Erase all progress, quiz scores and notes on this device?')) progress.reset()
            }}
          >
            Reset progress
          </button>
        </div>
      </section>
    </div>
  )
}

/* ---------------- Lesson ---------------- */
export function LessonPage({ route, progress }) {
  const found = findLesson(route.a, route.b)
  if (!found) {
    return (
      <div className="empty">
        <h1>Lesson not found</h1>
        <p>The link may be out of date. <a href="#/">Go to the course home</a>.</p>
      </div>
    )
  }
  const { lesson, prev, next } = found
  const mod = modules.find((m) => m.id === lesson.moduleId)
  const pos = mod.lessons.findIndex((l) => l.id === lesson.id) + 1
  const isDone = !!progress.state.lessons[lesson.key]

  const finishAndNext = () => {
    progress.setLessonDone(lesson.key)
    if (next) window.location.hash = lessonHref(next.moduleId, next.id)
  }

  return (
    <article className={`lesson c-${lesson.color}`}>
      <header className="lesson-head">
        <p className="lesson-crumb">
          <a href={lessonHref(mod.id, mod.lessons[0].id)}>Module {mod.num}: {mod.title}</a>
          <span> · Lesson {pos} of {mod.lessons.length} · {lesson.minutes} min</span>
        </p>
        <h1>{lesson.title}</h1>
      </header>

      <div className="lesson-body">
        <Blocks blocks={lesson.blocks} progress={progress} lessonId={lesson.key} />
      </div>

      <footer className="lesson-foot">
        <label className={`done-toggle${isDone ? ' on' : ''}`}>
          <input type="checkbox" checked={isDone} onChange={() => progress.toggleLesson(lesson.key)} />
          <span>{isDone ? 'Lesson marked done' : 'Mark this lesson done'}</span>
        </label>
        <div className="pager">
          {prev ? (
            <a className="btn" href={lessonHref(prev.moduleId, prev.id)}>Back: {prev.title}</a>
          ) : <span />}
          {next ? (
            <button type="button" className="btn btn-primary" onClick={finishAndNext}>
              {isDone ? 'Next' : 'Done, next'}: {next.title}
            </button>
          ) : (
            <a className="btn btn-primary" href="#/roadmap" onClick={() => progress.setLessonDone(lesson.key)}>Finish course</a>
          )}
        </div>
      </footer>
    </article>
  )
}

/* ---------------- Roadmap ---------------- */
export function Roadmap({ progress }) {
  const byKey = Object.fromEntries(allLessons.map((l) => [l.key, l]))
  return (
    <div className="page roadmap">
      <h1>12-week roadmap</h1>
      <p className="lede">About 5 hours a week: two 1-hour evenings for lessons and one 3-hour weekend block for building. Fall behind? Stretch a week into two. Finishing matters more than speed.</p>
      <ol className="weeks">
        {roadmap.map((w) => {
          const lessonDone = w.lessons.filter((k) => progress.state.lessons[k]).length
          const taskDone = w.tasks.filter((_, i) => progress.state.checks[`week${w.week}:${i}`]).length
          const complete = lessonDone === w.lessons.length && taskDone === w.tasks.length
          return (
            <li key={w.week} className={`week${complete ? ' complete' : ''}`}>
              <div className="week-marker" aria-hidden="true">{w.week}</div>
              <div className="week-body">
                <h2>Week {w.week}: {w.title}</h2>
                <p className="week-goal">{w.goal}</p>
                <div className="week-cols">
                  <div>
                    <h3>Lessons ({lessonDone}/{w.lessons.length})</h3>
                    <ul className="week-lessons">
                      {w.lessons.map((k) => {
                        const l = byKey[k]
                        if (!l) return null
                        return (
                          <li key={k} className={progress.state.lessons[k] ? 'done' : ''}>
                            <a href={lessonHref(l.moduleId, l.id)}>{l.title}</a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div>
                    <h3>Build tasks ({taskDone}/{w.tasks.length})</h3>
                    <ul className="checklist">
                      {w.tasks.map((t, i) => {
                        const key = `week${w.week}:${i}`
                        const on = !!progress.state.checks[key]
                        return (
                          <li key={key}>
                            <label className={on ? 'on' : ''}>
                              <input type="checkbox" checked={on} onChange={() => progress.toggleCheck(key)} />
                              <span>{t}</span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ---------------- Prompt library ---------------- */
export function Prompts() {
  const groups = modules
    .map((m) => ({ m, prompts: allPrompts.filter((p) => p.moduleId === m.id) }))
    .filter((g) => g.prompts.length)
  return (
    <div className="page">
      <h1>Prompt library</h1>
      <p className="lede">
        Every Claude Code prompt from the course in one place. Replace anything in angle brackets, like &lt;your theme&gt;, before sending.
      </p>
      {groups.map(({ m, prompts }) => (
        <section key={m.id} className={`prompt-group c-${m.color}`}>
          <h2>{m.title}</h2>
          {prompts.map((p, i) => (
            <div key={i}>
              <p className="prompt-from">
                From <a href={lessonHref(p.moduleId, p.lessonId)}>{p.lessonTitle}</a>
              </p>
              <Blocks blocks={[p]} progress={null} lessonId={`prompt-${m.id}-${i}`} />
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

/* ---------------- Glossary ---------------- */
export function Glossary() {
  return (
    <div className="page">
      <h1>Glossary and links</h1>
      <p className="lede">Words you will see in Roblox docs, forums and Claude’s explanations.</p>
      <dl className="glossary">
        {glossary.map(([term, def]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd><Inline text={def} /></dd>
          </div>
        ))}
      </dl>
      <h2>Official links</h2>
      <ul className="resources">
        {resources.map(([name, url, note]) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noreferrer">{name}</a>
            <span>{note}</span>
          </li>
        ))}
      </ul>
      <p className="fineprint">
        Facts about Roblox payouts and policies were checked against the official Roblox documentation in October 2026. Rates and rules change, so check the linked pages before making money decisions.
      </p>
    </div>
  )
}
