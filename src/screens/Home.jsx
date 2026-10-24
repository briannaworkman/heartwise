import { useState } from 'react'
import Icon from '../components/Icon'
import LessonPath from '../components/LessonPath'
import { topics } from '../data/topics'
import { XP_PER_CORRECT } from '../lib/storage'
import './Home.css'

function modelLine(health) {
  if (!health) return 'AI server offline. Pre-made lessons still work.'
  if (!health.hasKey) return 'AI server is running, but no API key is set.'
  if (health.backend === 'ollama') return `Running locally with ${health.model}.`
  if (health.backend === 'mock') return 'Test mode: canned AI replies.'
  return `Powered by ${health.model} through the Gemini API.`
}

// Unit 1 in path order. A step unlocks once every step before it is done.
function buildSteps(progress) {
  const [label, words, ask] = topics
  const lesson = (t, icon) => ({
    key: t.id, kind: 'lesson', topic: t, icon, title: t.title,
    blurb: `${t.blurb} ${t.questions.length} questions.`,
    done: progress.best[t.id] != null,
  })
  const steps = [
    lesson(label, 'pill'),
    lesson(words, 'book'),
    {
      key: 'scan', kind: 'scan', icon: 'camera', title: 'Scan your own label',
      blurb: "Snap a photo of a label and I'll turn it into a lesson just for you.",
      done: Object.keys(progress.best).some((k) => k.startsWith('scan-')),
    },
    lesson(ask, 'chat'),
  ]
  const allDone = steps.every((s) => s.done)
  steps.push({
    key: 'trophy', kind: 'trophy', icon: 'trophy', title: 'Unit 1 trophy', done: allDone,
    blurb: allDone ? 'You finished Unit 1. Be proud of yourself!' : 'Finish every step in this unit to earn it.',
  })
  const current = steps.findIndex((s) => !s.done)
  return steps.map((s, i) => {
    const xp = s.topic ? s.topic.questions.length * XP_PER_CORRECT : 0
    const action =
      s.kind === 'lesson' ? (s.done ? `Practice again +${xp} XP` : `Start +${xp} XP`)
        : s.kind === 'scan' ? (s.done ? 'Scan another label' : 'Scan a label')
          : null
    return { ...s, state: s.done ? 'done' : i === current ? 'current' : 'locked', action, cta: s.kind === 'scan' ? 'Scan' : 'Start' }
  })
}

export default function Home({ progress, health, onStart, onScan, onIntro }) {
  const [guide, setGuide] = useState(false)
  const steps = buildSteps(progress)
  const act = (s) => (s.kind === 'scan' ? onScan() : s.kind === 'lesson' && onStart(s.topic))

  return (
    <div className="home">
      <header className="home-top">
        <span className="home-brand"><img src="/favicon.svg" alt="" width="22" height="22" />Heartwise</span>
        <div className="home-stats" aria-label="Your progress">
          <span className="home-stat streak" title="Day streak" aria-label={`${progress.streak} day streak`}><Icon name="flame" size={22} />{progress.streak}</span>
          <span className="home-stat xp" title="Total XP" aria-label={`${progress.xp} XP`}><Icon name="bolt" size={22} />{progress.xp}</span>
        </div>
      </header>

      <main className="home-main">
        <section className="unit">
          <div>
            <p className="unit-kicker">Unit 1</p>
            <h2 className="unit-title">Understand your medicine</h2>
            <p className="unit-sub">Labels, health words, and speaking up</p>
          </div>
          <button className="unit-guide" aria-label="Unit guide" aria-expanded={guide} onClick={() => setGuide((g) => !g)}>
            <Icon name="guide" size={26} />
          </button>
          {guide && (
            <div className="unit-tip" role="note">
              <strong>Heartwise guide</strong>
              <p>Each step helps you read and understand health information. It isn't medical advice. Your pharmacist or care team has the final word.</p>
              <button className="unit-tip-link" onClick={onIntro}>Replay the intro</button>
            </div>
          )}
        </section>

        <LessonPath steps={steps} onAction={act} />

        <p className="note">Lesson content is a draft that hasn't been clinician-reviewed.</p>
        <p className="note status">{modelLine(health)}</p>
      </main>

      <nav className="tabbar" aria-label="Main">
        <button className="tab active" aria-current="page"><Icon name="home" size={26} /><span>Learn</span></button>
        <button className="tab" onClick={onScan}><Icon name="camera" size={26} /><span>Scan</span></button>
      </nav>
    </div>
  )
}
