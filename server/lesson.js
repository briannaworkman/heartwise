export function parseJson(text) {
  const cleaned = text.replace(/```(?:json)?/gi, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('The model did not return JSON')
  return JSON.parse(cleaned.slice(start, end + 1))
}

const str = (v, max = 400) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'concept'
const shuffle = (list) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function normalizeExtract(raw) {
  if (raw.error) return { error: raw.error }
  const terms = (Array.isArray(raw.terms) ? raw.terms : [])
    .map((t) => ({ term: str(t?.term, 80), plain: str(t?.plain, 240) }))
    .filter((t) => t.term && t.plain)
    .slice(0, 6)
  if (!terms.length) throw new Error('No terms found in the reply')
  return { documentType: str(raw.documentType, 80) || 'Health document', summary: str(raw.summary, 240), terms }
}

// Validates the model's lesson and shuffles options so the right answer is not always first.
export function normalizeLesson(raw, id, min = 3) {
  const concepts = {}
  for (const [k, v] of Object.entries(raw.concepts ?? {})) {
    const key = slug(k)
    concepts[key] = { name: str(v?.name, 60) || key, review: str(v?.review, 500) }
  }
  const questions = []
  for (const q of Array.isArray(raw.questions) ? raw.questions : []) {
    const options = Array.isArray(q?.options) ? q.options.map((o) => str(o, 160)).filter(Boolean) : []
    const answer = Number(q?.answer)
    if (options.length < 3 || options.length > 4 || !Number.isInteger(answer) || answer < 0 || answer >= options.length || !str(q.prompt)) continue
    const correct = options[answer]
    const shuffled = shuffle(options)
    const key = slug(q.concept)
    if (!concepts[key]) concepts[key] = { name: key.replace(/-/g, ' '), review: str(q.explain, 500) }
    questions.push({
      id: `${id}-${questions.length + 1}`,
      concept: key,
      prompt: str(q.prompt, 300),
      options: shuffled,
      answer: shuffled.indexOf(correct),
      explain: str(q.explain, 300),
    })
  }
  if (questions.length < min) throw new Error('The lesson came back incomplete')
  return {
    id,
    title: str(raw.title, 80) || 'Your lesson',
    blurb: str(raw.blurb, 140) || 'Made from your document.',
    generated: true,
    concepts,
    questions: questions.slice(0, 5),
  }
}

export function normalizeReview(raw) {
  const notes = {}
  for (const [k, v] of Object.entries(raw.notes ?? {})) {
    const text = str(v, 600)
    if (text) notes[slug(k)] = text
  }
  if (!Object.keys(notes).length) throw new Error('No notes in the reply')
  return { notes }
}

export function normalizeAnswer(raw) {
  const answer = str(raw.answer, 900)
  if (!answer) throw new Error('No answer in the reply')
  return { answer }
}
