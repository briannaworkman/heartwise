// Progress lives only in this browser. Swap this module out for an API when accounts are added.
const KEY = 'heartwise.progress.v1'
const EMPTY = { xp: 0, streak: 0, lastDay: null, best: {} }
export const XP_PER_CORRECT = 10

const today = () => new Date().toLocaleDateString('en-CA')
const yesterday = () => new Date(Date.now() - 864e5).toLocaleDateString('en-CA')

export function loadProgress() {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { ...EMPTY }
  }
}

function save(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // storage blocked or full: progress just won't persist
  }
}

export function recordLesson(topicId, { correct, total }) {
  const p = loadProgress()
  const t = today()
  const streak = p.lastDay === t ? p.streak : p.lastDay === yesterday() ? p.streak + 1 : 1
  const next = {
    xp: p.xp + correct * XP_PER_CORRECT,
    streak,
    lastDay: t,
    best: { ...p.best, [topicId]: Math.max(p.best[topicId] ?? 0, correct) },
    total: { ...p.total, [topicId]: total },
  }
  save(next)
  return next
}
