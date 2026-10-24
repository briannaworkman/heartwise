import { useEffect, useRef, useState } from 'react'
import Heartwise from '../components/Heartwise'
import { courseIdFor, findersFor } from '../data/careFinders'
import { reviewMissed } from '../lib/api'
import { XP_PER_CORRECT } from '../lib/storage'

export default function Results({ topic, answers, isPractice, onHome, onPractice, onNearby }) {
  const finders = findersFor(courseIdFor(topic.id))
  const correct = answers.filter((a) => a.correct).length
  const total = answers.length
  const missed = answers.filter((a) => !a.correct)
  const missedConcepts = [...new Set(missed.map((a) => a.concept))]
  const great = correct / total >= 0.6

  // Gemma personalizes each note, but only from the trusted concept text. If it fails, the
  // pre-written review stays on screen.
  const [notes, setNotes] = useState({})
  const [noteState, setNoteState] = useState(missed.length ? 'loading' : 'idle')
  const asked = useRef(false)
  useEffect(() => {
    const wrong = answers.filter((a) => !a.correct)
    if (asked.current || !wrong.length) return
    asked.current = true
    const byId = Object.fromEntries(topic.questions.map((q) => [q.id, q]))
    const concepts = [...new Set(wrong.map((a) => a.concept))]
    const payload = {
      language: 'English',
      missed: wrong.map((a) => {
        const q = byId[a.id]
        return { concept: a.concept, question: q.prompt, learnerPicked: q.options[a.picked], correctAnswer: q.options[q.answer] }
      }),
      source: Object.fromEntries(concepts.map((c) => [c, topic.concepts[c].review])),
    }
    reviewMissed(payload)
      .then((r) => { setNotes(r.notes); setNoteState('ready') })
      .catch(() => setNoteState('failed'))
  }, [answers, topic])

  return (
    <div className="screen results">
      <main className="lesson-body">
        <Heartwise size={170} state={great ? 'celebrate' : 'idle'} />
        <h2 className="prompt">{missed.length === 0 ? 'Perfect! You really know this.' : great ? 'Lesson complete. Nice work!' : 'Good effort. You learned something new.'}</h2>
        <div className="score-row">
          <span className="score"><b>{correct}/{total}</b> correct</span>
          {!isPractice && <span className="score"><b>+{correct * XP_PER_CORRECT}</b> XP</span>}
        </div>

        {missedConcepts.length > 0 && (
          <section className="study" aria-labelledby="study-title">
            <h3 id="study-title">Study this more</h3>
            <p className="study-sub">
              {noteState === 'loading' && 'Hugo is writing your notes…'}
              {noteState === 'ready' && 'Personalized by Gemma from your answers. Check anything important with your care team.'}
              {(noteState === 'failed' || noteState === 'idle') && 'A little more on the ones that tripped you up. No pressure.'}
            </p>
            <ul>
              {missedConcepts.map((c) => (
                <li key={c}>
                  <strong>{topic.concepts[c].name}</strong>
                  <p>{notes[c] ?? topic.concepts[c].review}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="nearby" aria-labelledby="nearby-title">
          <h3 id="nearby-title">Find help nearby</h3>
          <ul>
            {finders.map((f) => (
              <li key={f.id}>
                <a href={f.url} target="_blank" rel="noopener noreferrer"><strong>{f.title}</strong><span>{f.blurb}</span></a>
              </li>
            ))}
          </ul>
          <button className="nearby-more" onClick={onNearby}>See all places to get help</button>
        </section>
      </main>
      <footer className="sheet idle stack">
        {missed.length > 0 && <button className="secondary" onClick={() => onPractice(missed.map((a) => a.id))}>Practice these again</button>}
        <button className="primary" onClick={onHome}>Back to lessons</button>
      </footer>
    </div>
  )
}
