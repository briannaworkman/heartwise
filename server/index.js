import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { generate, httpError, info } from './model.js'
import { SYSTEM, extractPrompt, lessonPrompt, reviewPrompt } from './prompts.js'
import { parseJson, normalizeExtract, normalizeLesson, normalizeReview } from './lesson.js'

const PORT = Number(process.env.PORT || 8787)
const MAX_BODY = 8 * 1024 * 1024
const LANGUAGES = ['English', 'Spanish', 'Arabic']
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const CACHE_DIR = new URL('./cache/', import.meta.url)

const language = (v) => (LANGUAGES.includes(v) ? v : 'English')

function readJson(req) {
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

// Only the built-in sample label is ever cached, so a demo can replay offline.
// Real photos and anything derived from them are never written to disk.
const cacheFile = (key) => new URL(`${key}.json`, CACHE_DIR)
const cacheGet = (key) => { try { return JSON.parse(fs.readFileSync(cacheFile(key), 'utf8')) } catch { return null } }
const cachePut = (key, value) => { try { fs.mkdirSync(CACHE_DIR, { recursive: true }); fs.writeFileSync(cacheFile(key), JSON.stringify(value)) } catch { /* cache is optional */ } }
const PROMPT_VERSION = 2 // bump when prompts change so stale cached replies are not reused
const cacheKey = (...parts) => crypto.createHash('sha256').update(JSON.stringify([PROMPT_VERSION, info(), ...parts])).digest('hex')

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
    const lang = language(body.language)
    const key = body.demo ? cacheKey('extract', lang, image.data) : null
    if (key) { const hit = cacheGet(key); if (hit) return hit }
    const result = await askJson({ task: 'extract', system: SYSTEM, text: extractPrompt(lang), image, maxTokens: 900 }, normalizeExtract)
    if (result.error) throw httpError(422, "That doesn't look like a medication label or health document. Try another photo.")
    if (key) cachePut(key, result)
    return result
  },

  'POST /api/lesson': async (body) => {
    const terms = Array.isArray(body.terms) ? body.terms.slice(0, 6) : []
    if (!terms.length) throw httpError(400, 'No terms to build a lesson from.')
    const lang = language(body.language)
    const doc = { documentType: String(body.documentType ?? 'health document').slice(0, 80), terms }
    const key = body.demo ? cacheKey('lesson', lang, doc) : null
    if (key) { const hit = cacheGet(key); if (hit) return hit }
    const id = `scan-${crypto.randomBytes(3).toString('hex')}`
    // Two parallel calls (about half the wait): each covers a share of the terms.
    const groups = terms.length > 3 ? [terms.slice(0, 3), terms.slice(3)] : [terms]
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
    const result = { topic }
    if (key) cachePut(key, result)
    return result
  },

  'POST /api/review': async (body) => {
    const missed = Array.isArray(body.missed) ? body.missed.slice(0, 8) : []
    if (!missed.length) throw httpError(400, 'Nothing to review.')
    return askJson({ task: 'review', system: SYSTEM, text: reviewPrompt({ missed, source: body.source ?? {} }, language(body.language)), maxTokens: 900 }, normalizeReview)
  },
}

http
  .createServer(async (req, res) => {
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
  })
  .listen(PORT, '127.0.0.1', () => {
    const i = info()
    console.log(`Heartwise server on http://127.0.0.1:${PORT}  backend=${i.backend} model=${i.model} key=${i.hasKey ? 'set' : 'MISSING'}`)
  })
