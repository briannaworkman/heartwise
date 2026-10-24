import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generate, httpError, info } from './model.js'
import { SYSTEM, askPrompt, extractPrompt, lessonPrompt, reviewPrompt } from './prompts.js'
import { parseJson, normalizeAnswer, normalizeExtract, normalizeLesson, normalizeReview } from './lesson.js'
import { topics } from '../src/data/topics.js'
import { careTopics } from '../src/data/careVisits.js'
import { costTopics } from '../src/data/insurance.js'

// The only facts the "Ask Hugo" feature may use: the concept notes from every lesson.
const REFERENCE = [...topics, ...careTopics, ...costTopics]
  .flatMap((t) => Object.values(t.concepts).map((c) => `- ${c.name}: ${c.review}`))
  .join('\n')

// Questions that may describe an emergency never reach the model.
const EMERGENCY = /\b(chest pain|can'?t breathe|cannot breathe|trouble breathing|overdos\w*|poison\w*|suicid\w*|kill myself|end my life|want to die|severe bleeding|unconscious|heart attack|having a stroke)\b/i
const EMERGENCY_MESSAGE = 'This could be an emergency. Please call 911 right now, or go to the nearest emergency room. If you are thinking about harming yourself, call or text 988 (Suicide and Crisis Lifeline) to reach a person any time. Heartwise cannot help with emergencies.'

const PORT = Number(process.env.PORT || 8787)
const MAX_BODY = 8 * 1024 * 1024
const LANGUAGES = ['English', 'Spanish', 'Arabic']
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const DEMO_FILE = new URL('./demo/sample-label.json', import.meta.url)

const language = (v) => (LANGUAGES.includes(v) ? v : 'English')

function readJson(req) {
  // Vercel parses JSON bodies before the function runs, so the stream is already consumed.
  if (req.body !== undefined) return Promise.resolve(typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {})
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_BODY) {
        reject(httpError(413, 'That image is too large.'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}'))
      } catch {
        reject(httpError(400, 'Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

// The built-in sample label is answered from a recorded Gemma 4 response (server/demo/sample-label.json),
// so a demo is instant and works when the hosted API is slow. Real photos always go to the model, and
// nothing derived from them is ever written to disk.
const SAMPLE = 'sample-label'
function recordedDemo(body, part) {
  if (body.demo !== SAMPLE || language(body.language) !== 'English') return null
  try {
    return JSON.parse(fs.readFileSync(DEMO_FILE, 'utf8'))[part] ?? null
  } catch {
    return null
  }
}

// Retries once when the reply is not usable JSON. API errors (which carry a status) are not retried.
async function askJson(args, normalize) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return normalize(parseJson(await generate(args)))
    } catch (err) {
      if (err.status) throw err
    }
  }
  throw httpError(502, 'The AI reply was not usable. Please try again.')
}

const routes = {
  'GET /api/health': async () => info(),

  'POST /api/extract': async (body) => {
    const image = body.image
    if (!image || !IMAGE_TYPES.includes(image.mimeType) || typeof image.data !== 'string') throw httpError(400, 'Please send a JPG, PNG or WebP image.')
    const recorded = recordedDemo(body, 'extract')
    if (recorded) return recorded
    const lang = language(body.language)
    const result = await askJson({ task: 'extract', system: SYSTEM, text: extractPrompt(lang), image, maxTokens: 900 }, normalizeExtract)
    if (result.error) throw httpError(422, "That doesn't look like a medication label or health document. Try another photo.")
    return result
  },

  'POST /api/lesson': async (body) => {
    const terms = Array.isArray(body.terms) ? body.terms.slice(0, 6) : []
    if (!terms.length) throw httpError(400, 'No terms to build a lesson from.')
    const recorded = recordedDemo(body, 'lesson')
    if (recorded) return recorded
    const lang = language(body.language)
    const doc = { documentType: String(body.documentType ?? 'health document').slice(0, 80), terms }
    const id = `scan-${crypto.randomBytes(3).toString('hex')}`
    // One call by default. LESSON_PARALLEL=1 splits it in two to cut the wait, but hosted Gemma
    // returned more 500s with concurrent requests when this was tested.
    const split = process.env.LESSON_PARALLEL === '1' && terms.length > 3
    const groups = split ? [terms.slice(0, 3), terms.slice(3)] : [terms]
    const parts = await Promise.all(
      groups.map((g, i) =>
        askJson(
          { task: 'lesson', system: SYSTEM, text: lessonPrompt({ ...doc, terms: g }, lang, Math.max(g.length, 2)), maxTokens: 1200 },
          (raw) => normalizeLesson(raw, `${id}${'ab'[i]}`, 2),
        ),
      ),
    )
    const topic = {
      ...parts[0],
      id,
      concepts: Object.assign({}, ...parts.map((p) => p.concepts)),
      questions: parts.flatMap((p) => p.questions).slice(0, 5),
    }
    return { topic }
  },

  'POST /api/ask': async (body) => {
    const question = typeof body.question === 'string' ? body.question.trim().slice(0, 300) : ''
    if (question.length < 3) throw httpError(400, 'Type a question first.')
    if (EMERGENCY.test(question)) return { answer: EMERGENCY_MESSAGE, emergency: true }
    // Tapped suggestions are answered from recorded Gemma 4 replies (see record-ask.mjs).
    if (body.demo === 'suggested') {
      try {
        const saved = JSON.parse(fs.readFileSync(new URL('./demo/ask.json', import.meta.url), 'utf8'))[question.toLowerCase()]
        if (saved) return { answer: saved, recorded: true }
      } catch { /* no recordings yet: fall through to the live model */ }
    }
    return askJson({ task: 'ask', system: SYSTEM, text: askPrompt({ question, reference: REFERENCE }, language(body.language)), maxTokens: 500 }, normalizeAnswer)
  },

  'POST /api/review': async (body) => {
    const missed = Array.isArray(body.missed) ? body.missed.slice(0, 8) : []
    if (!missed.length) throw httpError(400, 'Nothing to review.')
    return askJson({ task: 'review', system: SYSTEM, text: reviewPrompt({ missed, source: body.source ?? {} }, language(body.language)), maxTokens: 900 }, normalizeReview)
  },
}

// Used by the local server below and by the Vercel function in api/.
export async function handle(req, res) {
    const send = (status, payload) => {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      res.end(JSON.stringify(payload))
    }
    const handler = routes[`${req.method} ${req.url?.split('?')[0]}`]
    if (!handler) return send(404, { error: 'Not found' })
    try {
      send(200, await handler(req.method === 'POST' ? await readJson(req) : {}))
    } catch (err) {
      // Never log request bodies: they can contain health information.
      console.error(`[${req.url}]`, err.status ?? 500, err.message)
      send(err.status ?? 500, { error: err.status ? err.message : 'Something went wrong on the server.' })
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  http.createServer(handle).listen(PORT, '127.0.0.1', () => {
    const i = info()
    console.log(`Heartwise server on http://127.0.0.1:${PORT}  backend=${i.backend} model=${i.model} key=${i.hasKey ? 'set' : 'MISSING'}`)
  })
}
