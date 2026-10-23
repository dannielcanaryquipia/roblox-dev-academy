import start from './m00-start.js'
import setup from './m01-setup.js'
import studio from './m02-studio.js'
import luau from './m03-luau.js'
import engine from './m04-engine.js'
import data from './m05-data.js'
import ui from './m06-ui.js'
import design from './m07-design.js'
import claude from './m08-claude.js'
import obby from './m09-obby.js'
import sim from './m10-sim.js'
import money from './m11-money.js'
import publish from './m12-publish.js'
import rules from './m13-rules.js'

export const modules = [start, setup, studio, luau, engine, data, ui, design, claude, obby, sim, money, publish, rules].map(
  (m, i) => ({ ...m, num: i })
)

// Flat list in study order, used for prev/next and progress
export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title, color: m.color, key: `${m.id}/${l.id}` }))
)

export function findLesson(moduleId, lessonId) {
  const idx = allLessons.findIndex((l) => l.moduleId === moduleId && l.id === lessonId)
  if (idx === -1) return null
  return { lesson: allLessons[idx], prev: allLessons[idx - 1], next: allLessons[idx + 1], index: idx }
}

// Every prompt block in the course, for the Prompt library page
export const allPrompts = allLessons.flatMap((l) =>
  l.blocks
    .filter((b) => b.type === 'prompt')
    .map((b) => ({ ...b, lessonTitle: l.title, moduleTitle: l.moduleTitle, moduleId: l.moduleId, lessonId: l.id, color: l.color }))
)

export const totalMinutes = allLessons.reduce((n, l) => n + (l.minutes || 0), 0)
