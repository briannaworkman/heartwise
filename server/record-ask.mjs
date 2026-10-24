// Records real Gemma 4 answers for the suggested questions into server/demo/ask.json.
// Run with the API server up:  node server/record-ask.mjs
import fs from 'node:fs'
import { SUGGESTIONS } from '../src/data/askSuggestions.js'

const OUT = new URL('./demo/ask.json', import.meta.url)
const URL_ASK = process.env.ASK_URL || 'http://127.0.0.1:8787/api/ask'
const recorded = (() => { try { return JSON.parse(fs.readFileSync(OUT, 'utf8')) } catch { return {} } })()

for (const question of SUGGESTIONS) {
  const key = question.trim().toLowerCase()
  if (recorded[key]) { console.log('have   ', question); continue }
  for (let attempt = 1; attempt <= 3; attempt++) {
    const t = Date.now()
    try {
      const res = await fetch(URL_ASK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }), signal: AbortSignal.timeout(300_000) })
      const json = await res.json()
      if (!res.ok || json.emergency || !json.answer) throw new Error(json.error || `HTTP ${res.status}`)
      recorded[key] = json.answer
      fs.mkdirSync(new URL('./demo/', import.meta.url), { recursive: true })
      fs.writeFileSync(OUT, JSON.stringify(recorded, null, 2))
      console.log(`saved  ${((Date.now() - t) / 1000).toFixed(0)}s`, question)
      break
    } catch (err) {
      console.log(`try ${attempt} failed (${((Date.now() - t) / 1000).toFixed(0)}s): ${err.message.slice(0, 120)}`)
    }
  }
}
console.log('done:', Object.keys(recorded).length, 'of', SUGGESTIONS.length)
