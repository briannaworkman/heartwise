async function post(path, body) {
  let res
  try {
    res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  } catch {
    throw new Error("Can't reach the Heartwise server. Is it running?")
  }
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (json.error) throw new Error(json.error)
    throw new Error(res.status >= 500 ? "Can't reach the Heartwise server. Is it running?" : `Something went wrong (${res.status}).`)
  }
  return json
}

export const getHealth = () => fetch('/api/health').then((r) => (r.ok ? r.json() : null)).catch(() => null)
export const extractDoc = (image, opts) => post('/api/extract', { image, ...opts })
export const buildLesson = (doc, opts) => post('/api/lesson', { documentType: doc.documentType, terms: doc.terms, ...opts })
export const reviewMissed = (payload) => post('/api/review', payload)
export const askQuestion = (question, { demo = false, language = 'English' } = {}) => post('/api/ask', { question, language, demo })
