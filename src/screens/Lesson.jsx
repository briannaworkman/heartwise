import { useState } from 'react'
import Heartwise from '../components/Heartwise'

const CHEERS = ['Yes! You\'ve got it.', 'Nice work!', 'Exactly right.', 'You\'re getting the hang of this.']
const NUDGES = ['Close! This one trips up lots of people.', 'Good try. Let\'s look at it together.', 'Not quite, and that\'s okay.']
const pick = (list, i) => list[i % list.length]

export default function Lesson({ topic, onExit, onFinish }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState([])
  const [mood, setMood] = useState({ state: 'idle', n: 0 })

  const total = topic.questions.length
  const q = topic.questions[index]
  const isCorrect = checked && picked === q.answer

  function check() {
    if (picked == null) return
    const ok = picked === q.answer
    setChecked(true)
    setAnswers((a) => [...a, { id: q.id, concept: q.concept, correct: ok, picked }])
    setMood((m) => ({ state: ok ? 'correct' : 'wrong', n: m.n + 1 }))
  }

  function next() {
    if (index + 1 >= total) return onFinish(answers)
    setIndex(index + 1)
    setPicked(null)
    setChecked(false)
    setMood((m) => ({ state: 'idle', n: m.n + 1 }))
  }

  return (
    <div className="screen lesson">
      <header className="lesson-top">
        <button className="close" onClick={onExit} aria-label="Exit lesson">×</button>
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index + (checked ? 1 : 0)}>
          <div className="bar-fill" style={{ width: `${((index + (checked ? 1 : 0)) / total) * 100}%` }} />
        </div>
      </header>

      <main className="lesson-body">
        <Heartwise size={130} state={mood.state} nonce={mood.n} />
        <h2 className="prompt">{q.prompt}</h2>
        <div className="options" role="radiogroup" aria-label="Answer choices">
          {q.options.map((opt, i) => {
            let cls = 'option'
            if (picked === i) cls += ' picked'
            if (checked && i === q.answer) cls += ' right'
            if (checked && picked === i && i !== q.answer) cls += ' miss'
            return (
              <button key={i} className={cls} role="radio" aria-checked={picked === i} disabled={checked} onClick={() => setPicked(i)}>
                <span className="key" aria-hidden="true">{i + 1}</span>{opt}
              </button>
            )
          })}
        </div>
      </main>

      {checked ? (
        <footer className={`sheet ${isCorrect ? 'ok' : 'nope'}`} role="status">
          <div className="sheet-text">
            <strong>{isCorrect ? pick(CHEERS, index) : pick(NUDGES, index)}</strong>
            <p>{!isCorrect && <><b>Answer:</b> {q.options[q.answer]}. </>}{q.explain}</p>
          </div>
          <button className="primary" onClick={next}>{index + 1 >= total ? 'Finish' : 'Continue'}</button>
        </footer>
      ) : (
        <footer className="sheet idle">
          <button className="primary" disabled={picked == null} onClick={check}>Check</button>
        </footer>
      )}
    </div>
  )
}
