import Heartwise from '../components/Heartwise'
import { topics } from '../data/topics'

function modelLine(health) {
  if (!health) return 'AI server offline. Pre-made lessons still work.'
  if (!health.hasKey) return 'AI server is running, but no API key is set.'
  if (health.backend === 'ollama') return `Running locally with ${health.model}.`
  if (health.backend === 'mock') return 'Test mode: canned AI replies.'
  return `Powered by ${health.model} through the Gemini API.`
}

export default function Home({ progress, health, onStart, onScan }) {
  return (
    <div className="screen">
      <header className="topbar">
        <h1 className="brand">Heartwise</h1>
        <div className="stats" aria-label="Your progress">
          <span className="stat">Streak <b>{progress.streak}</b></span>
          <span className="stat">XP <b>{progress.xp}</b></span>
        </div>
      </header>
      <section className="hero">
        <Heartwise size={170} />
        <p className="speech">Hi, I'm Heartwise. Understanding your health doesn't have to be scary. Let's take it one small step at a time.</p>
      </section>

      <button className="scan-card" onClick={onScan}>
        <span className="scan-text">
          <span className="topic-title">Scan your own label</span>
          <span className="scan-sub">Snap a photo and I'll turn it into a lesson just for you.</span>
        </span>
        <span className="scan-go" aria-hidden="true">→</span>
      </button>

      <ol className="path" aria-label="Lessons">
        {topics.map((t, i) => {
          const best = progress.best[t.id]
          return (
            <li key={t.id}>
              <button className="topic" onClick={() => onStart(t)}>
                <span className="topic-num" aria-hidden="true">{i + 1}</span>
                <span className="topic-text">
                  <span className="topic-title">{t.title}</span>
                  <span className="topic-blurb">{t.blurb}</span>
                </span>
                <span className="topic-best">{best != null ? `Best ${best}/${t.questions.length}` : 'Start'}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className="note">Heartwise teaches you to understand health information. It doesn't give medical advice. Your pharmacist or care team has the final word. Lesson content is a draft that hasn't been clinician-reviewed.</p>
      <p className="note status">{modelLine(health)}</p>
    </div>
  )
}
