import React from 'react'
import { allLessons } from '../content/index.js'
import { lessonHref } from '../lib/router.js'

// Each lesson is one brick. Finished lessons are filled with their module color.
// The tower is built bottom-up in study order, like stacking bricks in Studio.
export default function BrickTower({ done, size = 'large', perRow = 6 }) {
  const rows = []
  for (let i = 0; i < allLessons.length; i += perRow) rows.push(allLessons.slice(i, i + perRow))
  return (
    <div className={`tower tower-${size}`} role="img" aria-label={`${Object.keys(done).length} of ${allLessons.length} lessons finished`}>
      {rows.reverse().map((row, r) => (
        <div className={`tower-row${(rows.length - r) % 2 === 0 ? ' offset' : ''}`} key={r}>
          {row.map((l) => {
            const isDone = !!done[l.key]
            const brick = <span className={`brick c-${l.color}${isDone ? ' done' : ''}`} />
            return size === 'large' ? (
              <a key={l.key} href={lessonHref(l.moduleId, l.id)} title={`${l.moduleTitle}: ${l.title}${isDone ? ' (done)' : ''}`} className="brick-link">
                {brick}
              </a>
            ) : (
              <React.Fragment key={l.key}>{brick}</React.Fragment>
            )
          })}
        </div>
      ))}
    </div>
  )
}
