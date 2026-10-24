import Icon from '../components/Icon'
import { FINDERS } from '../data/careFinders'

export default function Nearby({ onBack }) {
  return (
    <div className="ask">
      <header className="ask-top">
        <button className="close" onClick={onBack} aria-label="Back to lessons">×</button>
        <h1>Find care nearby</h1>
      </header>

      <p className="ask-note">These are official sites. Each one asks for your location itself. Heartwise never sees or stores where you are.</p>

      <div className="emergency-box" role="note">
        <strong>In an emergency</strong>
        <p>Call 911 or go to the nearest emergency room. For a mental health crisis, call or text 988.</p>
      </div>

      <ul className="finders">
        {FINDERS.map((f) => (
          <li key={f.id}>
            <a className="finder" href={f.url} target="_blank" rel="noopener noreferrer">
              <span className="finder-icon"><Icon name={f.icon} size={22} /></span>
              <span className="finder-text">
                <strong>{f.title}</strong>
                <span>{f.blurb}</span>
                <span className="finder-cta">{f.cta}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="ask-note">Your pharmacist is also a great first stop for medicine questions, and no appointment is needed.</p>
    </div>
  )
}
