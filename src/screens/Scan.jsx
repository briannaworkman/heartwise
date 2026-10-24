import { useRef, useState } from 'react'
import Heartwise from '../components/Heartwise'
import { extractDoc, buildLesson } from '../lib/api'
import { fileToJpeg } from '../lib/image'
import { makeSampleLabel } from '../lib/sampleLabel'

export default function Scan({ health, onBack, onStart }) {
  const [phase, setPhase] = useState('pick') // pick | reading | found | error
  const [preview, setPreview] = useState(null)
  const [doc, setDoc] = useState(null)
  const [lesson, setLesson] = useState({ status: 'idle' }) // idle | loading | ready | error
  const [error, setError] = useState('')
  const [isSample, setIsSample] = useState(false)
  const fileRef = useRef(null)
  const runId = useRef(0)
  const local = health?.backend === 'ollama'

  async function process(image, demo) {
    const id = ++runId.current
    const opts = { demo, language: 'English' }
    setPreview(image.dataUrl)
    setIsSample(demo === 'sample-label')
    setError('')
    setDoc(null)
    setLesson({ status: 'idle' })
    setPhase('reading')
    try {
      const found = await extractDoc({ data: image.data, mimeType: image.mimeType }, opts)
      if (id !== runId.current) return
      setDoc(found)
      setPhase('found')
      setLesson({ status: 'loading' })
      // Start building the lesson now. The learner reads what we found while it generates.
      buildLesson(found, opts)
        .then((r) => id === runId.current && setLesson({ status: 'ready', topic: r.topic }))
        .catch((e) => id === runId.current && setLesson({ status: 'error', message: e.message }))
    } catch (e) {
      if (id !== runId.current) return
      setError(e.message)
      setPhase('error')
    }
  }

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      await process(await fileToJpeg(file), false)
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }

  function reset() {
    runId.current++
    setPhase('pick')
    setPreview(null)
    setDoc(null)
    setLesson({ status: 'idle' })
  }

  const mood = phase === 'reading' || lesson.status === 'loading' ? 'thinking' : lesson.status === 'ready' ? 'celebrate' : 'idle'

  return (
    <div className="screen">
      <header className="lesson-top">
        <button className="close" onClick={onBack} aria-label="Back to lessons">×</button>
        <h1 className="scan-title">Scan your label</h1>
      </header>

      <main className="lesson-body">
        <Heartwise size={150} state={mood} />

        {phase === 'pick' && (
          <>
            <h2 className="prompt">Take or choose a photo of a medication label or health paperwork.</h2>
            <p className="notice">
              {local
                ? 'Your photo is read by a model running on this computer and is not saved.'
                : health?.backend === 'mock'
                  ? 'Test mode: nothing is sent to an AI. Replies are canned.'
                  : 'Your photo is sent to Gemma 4 through the Gemini API to be read. Heartwise does not save it. Cover your name, address and ID numbers first.'}
            </p>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            <button className="primary wide" onClick={() => fileRef.current?.click()}>Choose a photo</button>
            <button className="secondary wide" onClick={() => process(makeSampleLabel(), 'sample-label')}>Try a sample label</button>
          </>
        )}

        {phase === 'reading' && (
          <>
            {preview && <img className="thumb" src={preview} alt="The photo you chose" />}
            <h2 className="prompt">Taking a careful look at your label…</h2>
          </>
        )}

        {phase === 'found' && doc && (
          <>
            <h2 className="prompt">Here's what I found</h2>
            <p className="notice">{doc.documentType}. {doc.summary}</p>
            {isSample && <p className="notice">Sample label: this is a saved Gemma 4 response so the demo is instant. Your own photos are read live.</p>}
            <ul className="terms" aria-label="Key terms">
              {doc.terms.map((t) => (
                <li key={t.term}>
                  <strong>{t.term}</strong>
                  <span>{t.plain}</span>
                </li>
              ))}
            </ul>
            {lesson.status === 'error' && <p className="error" role="alert">{lesson.message}</p>}
          </>
        )}

        {phase === 'error' && (
          <>
            <h2 className="prompt">Hmm, that didn't work.</h2>
            <p className="error" role="alert">{error}</p>
            <button className="primary wide" onClick={reset}>Try again</button>
          </>
        )}
      </main>

      {phase === 'found' && (
        <footer className="sheet idle stack">
          {lesson.status === 'ready' ? (
            <button className="primary" onClick={() => onStart(lesson.topic)}>Start my lesson</button>
          ) : lesson.status === 'error' ? (
            <button className="primary" onClick={reset}>Start over</button>
          ) : (
            <button className="primary" disabled>Building your lesson…</button>
          )}
        </footer>
      )}
    </div>
  )
}
