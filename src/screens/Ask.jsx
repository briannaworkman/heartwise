import { useRef, useState } from 'react'
import Heartwise from '../components/Heartwise'
import { askQuestion } from '../lib/api'

import { SUGGESTIONS } from '../data/askSuggestions'

export default function Ask({ onBack }) {
  const [text, setText] = useState('')
  const [log, setLog] = useState([]) // { q, a, kind: 'ok' | 'emergency' | 'error' }
  const [busy, setBusy] = useState(false)
  const [mood, setMood] = useState({ state: 'idle', n: 0 })
  const runId = useRef(0)

  async function send(question, suggested = false) {
    const q = question.trim()
    if (q.length < 3 || busy) return
    const id = ++runId.current
    setBusy(true)
    setText('')
    setMood((m) => ({ state: 'thinking', n: m.n + 1 }))
    try {
      // A saved answer returns instantly, so pace it like a real reply. Typed questions go to the live model.
      const [r] = await Promise.all([askQuestion(q, { demo: suggested ? 'suggested' : false }), new Promise((res) => setTimeout(res, suggested ? 2500 : 0))])
      if (id !== runId.current) return
      setLog((l) => [{ q, a: r.answer, kind: r.emergency ? 'emergency' : 'ok', saved: Boolean(r.recorded) }, ...l])
      setMood((m) => ({ state: r.emergency ? 'idle' : 'correct', n: m.n + 1 }))
    } catch (e) {
      if (id !== runId.current) return
      setLog((l) => [{ q, a: e.message, kind: 'error' }, ...l])
      setMood((m) => ({ state: 'idle', n: m.n + 1 }))
    } finally {
      if (id === runId.current) setBusy(false)
    }
  }

  return (
    <div className="ask">
      <header className="ask-top">
        <button className="close" onClick={onBack} aria-label="Back to lessons">×</button>
        <h1>Ask Hugo</h1>
      </header>

      <section className="ask-hero">
        <Heartwise size={130} state={mood.state} nonce={mood.n} />
        <p>Ask a question about medicines, care visits or insurance costs. I answer from the Heartwise lessons.</p>
      </section>

      {log.length === 0 && (
        <div className="ask-chips" aria-label="Question ideas">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="ask-chip" disabled={busy} onClick={() => send(s, true)}>{s}</button>
          ))}
        </div>
      )}

      <form className="ask-form" onSubmit={(e) => { e.preventDefault(); send(text) }}>
        <textarea
          className="ask-input"
          value={text}
          maxLength={300}
          placeholder="Type your question…"
          aria-label="Your question"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(text) } }}
        />
        <button className="primary" type="submit" disabled={busy || text.trim().length < 3}>{busy ? 'Hugo is thinking…' : 'Ask'}</button>
      </form>

      {busy && <p className="ask-wait" role="status">Looking through the lessons. This can take up to a minute.</p>}

      <div className="ask-log" aria-live="polite">
        {log.map((m, i) => (
          <div key={`${log.length - i}`} className="ask-log-item">
            <p className="ask-q">{m.q}</p>
            <p className={`ask-a ${m.kind === 'ok' ? '' : m.kind}`}>{m.a}</p>
            {m.saved && <p className="ask-note">Saved Gemma 4 answer, so the demo is instant. Questions you type are answered live.</p>}
          </div>
        ))}
      </div>

      <p className="ask-note">Heartwise teaches. It doesn't give medical advice. Answers come from our draft lesson notes and may be incomplete, so check with your pharmacist or care team. In an emergency, call 911.</p>
    </div>
  )
}
