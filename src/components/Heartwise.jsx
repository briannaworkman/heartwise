import { useEffect, useRef } from 'react'
import './Heartwise.css'

const NS = 'http://www.w3.org/2000/svg'
const MAP = [
  '.BBB...BBS.',
  'BHHBB.BBBBS',
  'BHBBBBBBBBS',
  'BBBEBBBEBBS',
  'BBBEBBBEBBS',
  '.BCBMBMBCS.',
  '..BBBMBBS..',
  '...BBBBS...',
  '....BBS....',
  '.....S.....',
]
const COLORS = { B: '#e5484d', H: '#ff9aa5', S: '#c9363b', C: '#ff8fa3', E: '#e5484d', M: '#e5484d' }
const PIXELS = MAP.flatMap((row, r) =>
  [...row].flatMap((ch, c) => (ch === '.' ? [] : [{ x: c * 12, y: r * 12, fill: COLORS[ch], key: `${r}-${c}` }])),
)
const CONFETTI = ['#e5484d', '#ffb800', '#58cc02', '#1cb0f6', '#ce82ff', '#ff9600']
const RETURN_TO_IDLE_MS = { correct: 900, wrong: 1300, celebrate: 1900 }

function burst(group, count, power) {
  if (!group || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  for (let i = 0; i < count; i++) {
    const size = i % 2 ? 6 : 10
    const piece = document.createElementNS(NS, 'rect')
    piece.setAttribute('width', size)
    piece.setAttribute('height', size)
    piece.setAttribute('x', 66 - size / 2)
    piece.setAttribute('y', 30)
    piece.setAttribute('fill', CONFETTI[i % CONFETTI.length])
    piece.style.transformBox = 'fill-box'
    piece.style.transformOrigin = 'center'
    group.appendChild(piece)
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3
    const dist = 50 + Math.random() * power
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist
    const anim = piece.animate(
      [
        { transform: 'translate(0px,0px) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx * 1.1}px,${dy + 60}px) rotate(${Math.random() * 540}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)', delay: Math.random() * 120, fill: 'forwards' },
    )
    anim.onfinish = () => piece.remove()
  }
}

// state: idle | thinking | correct | wrong | celebrate. Bump `nonce` to replay the same state.
export default function Heartwise({ state = 'idle', nonce = 0, size = 220 }) {
  const svgRef = useRef(null)
  const confettiRef = useRef(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    el.dataset.state = 'idle'
    void el.getBoundingClientRect()
    el.dataset.state = state
    const timers = []
    if (state === 'correct') timers.push(setTimeout(() => burst(confettiRef.current, 18, 60), 230))
    if (state === 'celebrate') [300, 800, 1450].forEach((ms) => timers.push(setTimeout(() => burst(confettiRef.current, 26, 90), ms)))
    if (RETURN_TO_IDLE_MS[state]) timers.push(setTimeout(() => { el.dataset.state = 'idle' }, RETURN_TO_IDLE_MS[state]))
    return () => timers.forEach(clearTimeout)
  }, [state, nonce])

  return (
    <svg ref={svgRef} className="hw" style={{ width: size }} viewBox="-30 -60 192 230" role="img" aria-label="Hugo, a friendly pixel heart" data-state="idle" shapeRendering="crispEdges">
      <ellipse className="hw-shadow" cx="66" cy="136" rx="40" ry="5" fill="#000" opacity=".12" />
      <g ref={confettiRef} />
      <g className="hw-jumper">
        <g className="hw-body">
          <g>{PIXELS.map((p) => <rect key={p.key} x={p.x} y={p.y} width="12" height="12" fill={p.fill} />)}</g>
          <g fill="#2b2b3a">
            <g className="hw-eyes">
              <g data-e="normal"><rect className="hw-eye" x="36" y="36" width="12" height="24" /><rect className="hw-eye" x="84" y="36" width="12" height="24" /></g>
              <g data-e="happy">
                <rect x="24" y="48" width="12" height="12" /><rect x="36" y="36" width="12" height="12" /><rect x="48" y="48" width="12" height="12" />
                <rect x="72" y="48" width="12" height="12" /><rect x="84" y="36" width="12" height="12" /><rect x="96" y="48" width="12" height="12" />
              </g>
            </g>
            <g data-m="smile"><rect x="48" y="60" width="12" height="12" /><rect x="72" y="60" width="12" height="12" /><rect x="60" y="72" width="12" height="12" /></g>
            <g data-m="open"><rect x="48" y="60" width="36" height="12" /><rect x="60" y="72" width="12" height="12" /><rect x="60" y="72" width="12" height="12" fill="#ff8fa3" /></g>
            <g data-m="flat"><rect x="48" y="66" width="36" height="6" /></g>
            <g data-m="o"><rect x="60" y="60" width="12" height="12" /></g>
          </g>
        </g>
      </g>
      <g className="hw-dots" fill="#e5484d"><rect x="50" y="146" width="8" height="8" /><rect x="62" y="146" width="8" height="8" /><rect x="74" y="146" width="8" height="8" /></g>
    </svg>
  )
}
