import { useState } from 'react'
import Heartwise from '../components/Heartwise'
import Icon from '../components/Icon'
import './Onboarding.css'

const SLIDES = [
  {
    mood: 'correct',
    title: "Hi, I'm Hugo!",
    body: 'Welcome to Heartwise. I help you understand medicine labels and health paperwork, one small step at a time. No question is too basic.',
  },
  {
    mood: 'thinking',
    title: 'Learn in bite-sized steps',
    points: [
      { icon: 'book', text: 'Quick lessons on labels, health words, and speaking up at appointments.' },
      { icon: 'camera', text: "Snap a photo of a label and I'll turn it into a lesson just for you." },
      { icon: 'flame', text: 'Earn XP and keep a streak going. A few minutes a day adds up.' },
    ],
  },
  {
    mood: 'idle',
    title: 'Your privacy comes first',
    points: [
      { icon: 'lock', text: 'Your progress stays on this device. No account needed.' },
      { icon: 'camera', text: "Photos are read by Gemma 4 through Google's Gemini API to make your lesson. Heartwise doesn't save them." },
      { icon: 'chat', text: "I explain things, but I don't give medical advice. Your pharmacist or care team has the final word." },
    ],
  },
]

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const slide = SLIDES[step]
  const last = step === SLIDES.length - 1

  return (
    <div className="screen intro">
      <header className="intro-top">
        <div className="intro-dots" aria-hidden="true">
          {SLIDES.map((s, i) => <span key={s.title} className={i <= step ? 'on' : ''} />)}
        </div>
        {!last && <button className="intro-skip" onClick={onDone}>Skip</button>}
      </header>

      <main className="intro-body" key={step} aria-live="polite">
        <p className="sr-only">Step {step + 1} of {SLIDES.length}</p>
        <Heartwise size={step === 0 ? 190 : 140} state={slide.mood} nonce={step} />
        <h1 className="intro-title">{slide.title}</h1>
        {slide.body && <p className="intro-text">{slide.body}</p>}
        {slide.points && (
          <ul className="intro-points">
            {slide.points.map((p) => (
              <li key={p.text}>
                <span className="intro-icon"><Icon name={p.icon} size={24} /></span>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="sheet idle">
        <button className="primary" onClick={() => (last ? onDone() : setStep(step + 1))}>{last ? "Let's start" : 'Continue'}</button>
      </footer>
    </div>
  )
}
