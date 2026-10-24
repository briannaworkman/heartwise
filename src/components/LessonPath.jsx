import { useEffect, useRef, useState } from 'react'
import Heartwise from './Heartwise'
import Icon from './Icon'
import './LessonPath.css'

// Nodes zigzag like a winding trail. Pixel offsets from the center line, repeating.
const OFFSETS = [0, -56, -84, -56, 0, 56, 84, 56]
const ROW = 104
const STATE_LABEL = { done: 'Completed', current: 'Up next', locked: 'Locked' }

function nodeIcon(step) {
  if (step.state === 'done') return step.kind === 'trophy' ? 'trophy' : 'check'
  if (step.state === 'locked' && step.kind !== 'trophy') return 'lock'
  return step.icon
}

// steps: [{ key, kind, icon, title, blurb, state: done|current|locked, action, cta }]
export default function LessonPath({ steps, onAction }) {
  const [open, setOpen] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (open == null) return
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(null) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = steps.findIndex((s) => s.state === 'current')
  const mascotRow = Math.max(1, Math.min(current < 0 ? 2 : current + 1, steps.length - 1))

  return (
    <div className="lp" ref={ref} style={{ height: steps.length * ROW + 24 }} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
      <div className={`lp-mascot ${OFFSETS[mascotRow % OFFSETS.length] > 0 ? 'left' : 'right'}`} style={{ top: mascotRow * ROW - 28 }} aria-hidden="true">
        <Heartwise size={110} />
      </div>
      <ol className="lp-list" aria-label="Unit steps">
        {steps.map((s, i) => {
          const x = OFFSETS[i % OFFSETS.length]
          const isOpen = open === s.key
          return (
            <li key={s.key} className="lp-row" style={{ top: i * ROW, zIndex: isOpen ? 10 : 1 }}>
              <div className="lp-node-wrap" style={{ transform: `translateX(${x}px)` }}>
                {s.state === 'current' && !isOpen && <span className="lp-start" aria-hidden="true">{s.cta}</span>}
                <button
                  className={`lp-node ${s.state} ${s.kind}`}
                  aria-label={`${s.title}. ${STATE_LABEL[s.state]}`}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : s.key)}
                >
                  <Icon name={nodeIcon(s)} size={34} stroke={2.6} />
                </button>
              </div>
              {isOpen && (
                <div className={`lp-pop ${s.state}`} role="dialog" aria-label={s.title} style={{ '--arrow-x': `calc(50% + ${x}px)` }}>
                  <strong>{s.title}</strong>
                  <p>{s.state === 'locked' && s.kind !== 'trophy' ? 'Finish the steps above to unlock this one.' : s.blurb}</p>
                  {s.state !== 'locked' && s.action && (
                    <button className="lp-pop-btn" onClick={() => { setOpen(null); onAction(s) }}>{s.action}</button>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
