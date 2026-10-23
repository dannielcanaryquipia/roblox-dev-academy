import React, { useMemo, useState } from 'react'
import { Inline } from '../lib/inline.jsx'
import { highlight } from '../lib/highlight.js'
import Quiz from './Quiz.jsx'
import EarningsCalculator from './EarningsCalculator.jsx'

function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return [copied, copy]
}

export function CodeBlock({ code, lang = 'luau', title }) {
  const [copied, copy] = useCopy()
  const tokens = useMemo(() => highlight(code.replace(/\n$/, ''), lang), [code, lang])
  const label = { luau: 'Luau', bash: 'Terminal', powershell: 'PowerShell', cmd: 'Command Prompt', json: 'JSON', text: 'Text' }[lang] || lang
  return (
    <figure className="code">
      <figcaption>
        <span className="code-title">{title || label}</span>
        {title && <span className="code-lang">{label}</span>}
        <button type="button" className="code-copy" onClick={() => copy(code)}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>
      <pre tabIndex={0}>
        <code>
          {tokens.map((tk, i) =>
            tk.t === 'plain' || tk.t === 'space' ? (
              <React.Fragment key={i}>{tk.v}</React.Fragment>
            ) : (
              <span key={i} className={`tk-${tk.t}`}>{tk.v}</span>
            )
          )}
        </code>
      </pre>
    </figure>
  )
}

function PromptBlock({ title, text }) {
  const [copied, copy] = useCopy()
  return (
    <figure className="prompt">
      <figcaption>
        <span className="prompt-badge" aria-hidden="true">›_</span>
        <span>{title || 'Prompt for Claude Code'}</span>
        <button type="button" className="code-copy" onClick={() => copy(text)}>
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
      </figcaption>
      <p className="prompt-text">{text}</p>
    </figure>
  )
}

const CALLOUT_TITLES = { tip: 'Tip', warn: 'Watch out', info: 'Good to know', money: 'Money', godot: 'Coming from Godot' }

function Callout({ tone = 'info', title, text, items }) {
  return (
    <aside className={`callout callout-${tone}`}>
      <p className="callout-title">{title || CALLOUT_TITLES[tone]}</p>
      {text && <p><Inline text={text} /></p>}
      {items && (
        <ul>
          {items.map((it, i) => <li key={i}><Inline text={it} /></li>)}
        </ul>
      )}
    </aside>
  )
}

function Steps({ items }) {
  return (
    <ol className="steps">
      {items.map((s, i) => (
        <li key={i}>
          <span className="step-n" aria-hidden="true">{i + 1}</span>
          <div>
            <p className="step-title"><Inline text={s.title} /></p>
            {s.text && <p><Inline text={s.text} /></p>}
            {s.code && <CodeBlock code={s.code} lang={s.lang || 'luau'} title={s.codeTitle} />}
          </div>
        </li>
      ))}
    </ol>
  )
}

function Table({ head, rows, caption }) {
  return (
    <div className="table-wrap">
      <table>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>{head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (j === 0 ? <th key={j} scope="row"><Inline text={c} /></th> : <td key={j}><Inline text={c} /></td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Checklist({ id, items, progress }) {
  return (
    <ul className="checklist">
      {items.map((it, i) => {
        const key = `${id}:${i}`
        const on = !!progress.state.checks[key]
        return (
          <li key={key}>
            <label className={on ? 'on' : ''}>
              <input type="checkbox" checked={on} onChange={() => progress.toggleCheck(key)} />
              <span><Inline text={it} /></span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}

function Notes({ id, progress }) {
  const value = progress.state.notes[id] || ''
  return (
    <div className="notes">
      <label htmlFor={`note-${id}`}>Your notes for this lesson (saved in this browser)</label>
      <textarea
        id={`note-${id}`}
        rows={4}
        value={value}
        placeholder="What did you learn? What confused you? What will you ask Claude Code next?"
        onChange={(e) => progress.saveNote(id, e.target.value)}
      />
    </div>
  )
}

export default function Blocks({ blocks, progress, lessonId }) {
  return blocks.map((b, i) => {
    const key = `${lessonId}-${i}`
    switch (b.type) {
      case 'h':
        return <h2 key={key} id={`s-${i}`}>{b.text}</h2>
      case 'h3':
        return <h3 key={key}>{b.text}</h3>
      case 'p':
        return <p key={key}><Inline text={b.text} /></p>
      case 'list':
        return (
          <ul key={key} className="prose-list">
            {b.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}
          </ul>
        )
      case 'olist':
        return (
          <ol key={key} className="prose-list">
            {b.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}
          </ol>
        )
      case 'code':
        return <CodeBlock key={key} code={b.code} lang={b.lang} title={b.title} />
      case 'prompt':
        return <PromptBlock key={key} title={b.title} text={b.text} />
      case 'callout':
        return <Callout key={key} {...b} />
      case 'steps':
        return <Steps key={key} items={b.items} />
      case 'table':
        return <Table key={key} head={b.head} rows={b.rows} caption={b.caption} />
      case 'checklist':
        return <Checklist key={key} id={b.id || key} items={b.items} progress={progress} />
      case 'quiz':
        return <Quiz key={key} id={b.id || key} questions={b.questions} progress={progress} />
      case 'calculator':
        return <EarningsCalculator key={key} />
      case 'notes':
        return <Notes key={key} id={lessonId} progress={progress} />
      default:
        return null
    }
  })
}
