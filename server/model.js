// One function, three backends. Set MODEL_BACKEND=gemini (default) | ollama | mock.
// `mock` returns canned JSON so the UI can be tested offline. It never touches a real model.
export function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

const BACKEND = process.env.MODEL_BACKEND || 'gemini'
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemma-4-31b-it'
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemma-4-26b-a4b-it'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma4:e4b'
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434'
const TIMEOUT_MS = 90_000

export const info = () => ({
  backend: BACKEND,
  model: BACKEND === 'ollama' ? OLLAMA_MODEL : BACKEND === 'mock' ? 'mock' : GEMINI_MODEL,
  hasKey: BACKEND !== 'gemini' || Boolean(process.env.GEMINI_API_KEY),
})

// task: 'extract' | 'lesson' | 'review' (only used by the mock backend)
export async function generate({ task, system, text, image, maxTokens = 1400 }) {
  if (BACKEND === 'mock') return mock(task)
  if (BACKEND === 'ollama') return ollama({ system, text, image, maxTokens })
  return gemini({ system, text, image, maxTokens })
}

async function gemini({ system, text, image, maxTokens }) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw httpError(500, 'GEMINI_API_KEY is not set on the server.')
  const urlFor = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const parts = []
  if (image) parts.push({ inline_data: { mime_type: image.mimeType, data: image.data } }) // image before text
  parts.push({ text })
  const body = {
    contents: [{ role: 'user', parts }],
    systemInstruction: { parts: [{ text: system }] },
    generationConfig: { temperature: 1.0, topP: 0.95, topK: 64, maxOutputTokens: maxTokens },
  }
  const call = (model, b) =>
    fetch(urlFor(model), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(b),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

  // Ask for minimal thinking to keep replies fast; retry without it if the API rejects the field.
  const fast = { ...body, generationConfig: { ...body.generationConfig, thinkingConfig: { thinkingLevel: 'minimal' } } }
  // Hosted Gemma sometimes answers 500/503/429 under load. Back off and retry, then fall back to the
  // second Gemma 4 model. Both go through the Gemini API.
  let res
  for (const model of [GEMINI_MODEL, GEMINI_FALLBACK_MODEL]) {
    res = await call(model, fast).catch((err) => (err.name === 'TimeoutError' ? { ok: false, status: 504, text: async () => 'timed out' } : Promise.reject(err)))
    if (res.status === 400) res = await call(model, body)
    for (const waitMs of [1500, 4000]) {
      if (![429, 500, 503, 504].includes(res.status)) break
      await new Promise((r) => setTimeout(r, waitMs))
      res = await call(model, fast).catch((err) => (err.name === 'TimeoutError' ? { ok: false, status: 504, text: async () => 'timed out' } : Promise.reject(err)))
    }
    if (res.ok) break
    console.error(`[model] ${model} failed with ${res.status}${model === GEMINI_MODEL ? ', trying fallback' : ''}`)
  }
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300)
    throw httpError(502, `Gemini API error ${res.status}: ${detail}`)
  }
  const json = await res.json()
  const out = (json.candidates?.[0]?.content?.parts ?? []).filter((p) => !p.thought).map((p) => p.text ?? '').join('')
  if (!out.trim()) throw httpError(502, 'The model returned an empty reply.')
  return out
}

async function ollama({ system, text, image, maxTokens }) {
  let res
  try {
    res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS * 2),
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        think: false,
        format: 'json',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: text, ...(image ? { images: [image.data] } : {}) },
        ],
        options: { temperature: 1.0, top_p: 0.95, top_k: 64, num_predict: maxTokens },
      }),
    })
  } catch {
    throw httpError(502, 'Could not reach Ollama. Is it running?')
  }
  if (!res.ok) throw httpError(502, `Ollama error ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const json = await res.json()
  const out = json.message?.content ?? ''
  if (!out.trim()) throw httpError(502, 'The model returned an empty reply.')
  return out
}

function mock(task) {
  const canned = {
    extract: {
      documentType: 'Prescription bottle label (mock)',
      summary: 'A prescription label with directions, a refill count and an expiration date.',
      terms: [
        { term: 'TAKE 1 TABLET TWICE DAILY', plain: 'One tablet, two times a day, spaced out.' },
        { term: 'WITH FOOD', plain: 'Take it with a meal or snack, which can be gentler on your stomach.' },
        { term: 'REFILLS: 2', plain: 'You can fill this same prescription two more times without a new one.' },
        { term: 'DISCARD AFTER', plain: 'The date after which the maker no longer stands behind the medicine.' },
      ],
    },
    lesson: {
      title: 'Your prescription label',
      blurb: 'Made from the label you scanned.',
      concepts: {
        directions: { name: 'Directions', review: 'The directions line tells you how many to take and how often. "Twice daily" means two separate doses in a day.' },
        food: { name: 'With food', review: 'Some medicines are gentler on the stomach with food. Follow the food instruction on your label.' },
        refills: { name: 'Refills', review: 'Refills are extra fills of the same prescription, so you do not need a new one each time.' },
        discard: { name: 'Discard date', review: 'After the discard date, the maker no longer stands behind the medicine. Ask your pharmacist how to dispose of it.' },
      },
      questions: [
        { concept: 'directions', prompt: 'Your label says "Take 1 tablet twice daily." What does that mean?', options: ['One tablet, two times a day', 'Two tablets at once', 'One tablet every other day', 'Only when you feel unwell'], answer: 0, explain: 'Twice daily means two separate doses, spaced out through the day.' },
        { concept: 'food', prompt: 'The label says "With food." Why might that matter?', options: ['It can be gentler on your stomach', 'It means water is not allowed', 'It means you should skip meals', 'It is only decoration'], answer: 0, explain: 'Food can reduce stomach upset for many medicines.' },
        { concept: 'refills', prompt: '"Refills: 2" means...', options: ['Two more fills without a new prescription', 'Take two pills more', 'It was filled twice already', 'It lasts two days'], answer: 0, explain: 'Refills are extra fills of the same prescription.' },
        { concept: 'discard', prompt: 'What does a "discard after" date tell you?', options: ['When the maker stops standing behind the medicine', 'When to start taking it', 'When the pharmacy opens', 'How many pills are left'], answer: 0, explain: 'After that date the maker cannot promise it works as intended.' },
        { concept: 'directions', prompt: 'You are unsure about the directions. A good next step is to...', options: ['Ask your pharmacist', 'Guess', 'Ask a stranger online', 'Skip the dose'], answer: 0, explain: 'Pharmacists are happy to explain a label.' },
      ],
    },
    review: { notes: { directions: 'Nice effort! Remember "twice daily" is two separate doses across the day. If it ever feels unclear, your pharmacist can walk you through it.', food: 'Food can be gentler on your stomach, which is why labels mention it. Follow the instruction on your label.' } },
  }
  return new Promise((resolve) => setTimeout(() => resolve(JSON.stringify(canned[task])), 900))
}
