import React from 'react'

// Minimal inline markup used in lesson text:
//   **bold**   *italic*   `code`   [label](https://link)
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*)/g

export function Inline({ text }) {
  if (!text) return null
  const parts = String(text).split(TOKEN)
  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="ic">{part.slice(1, -1)}</code>
    if (part.startsWith('[')) {
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (m) {
        const external = /^https?:/.test(m[2])
        return (
          <a key={i} href={m[2]} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
            {m[1]}
          </a>
        )
      }
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}
