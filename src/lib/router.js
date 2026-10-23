import { useEffect, useState } from 'react'

// Tiny hash router: #/ , #/roadmap , #/learn/<moduleId>/<lessonId>
function parse() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const parts = hash.split('/').filter(Boolean)
  return { page: parts[0] || 'home', a: parts[1], b: parts[2] }
}

export function useRoute() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const onChange = () => {
      setRoute(parse())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const lessonHref = (moduleId, lessonId) => `#/learn/${moduleId}/${lessonId}`
