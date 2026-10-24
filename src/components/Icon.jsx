// Small stroke icons drawn on a 24px grid. They inherit color from the parent.
const PATHS = {
  check: 'M5 12l5 5l10-10',
  lock: ['M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  pill: ['M4.5 12.5l8-8a4.95 4.95 0 0 1 7 7l-8 8a4.95 4.95 0 0 1-7-7z', 'M8.5 8.5l7 7'],
  book: ['M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0', 'M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0', 'M3 6v13', 'M12 6v13', 'M21 6v13'],
  camera: ['M5 7h1a2 2 0 0 0 2-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2', 'M9 13a3 3 0 1 0 6 0a3 3 0 1 0-6 0'],
  chat: ['M8 9h8', 'M8 13h6', 'M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z'],
  trophy: ['M7 4h10v6a5 5 0 0 1-10 0z', 'M7 6H4a3 3 0 0 0 3 4', 'M17 6h3a3 3 0 0 1-3 4', 'M12 15v4', 'M8 21h8'],
  flame: 'M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6c1 1 2 2 2 3c0-3 1-5 1-7z',
  bolt: 'M13 3L4 14h7l-1 7l9-11h-7l1-7z',
  home: ['M5 12H3l9-9l9 9h-2', 'M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7', 'M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6'],
  guide: ['M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z', 'M9 8h5', 'M9 12h5'],
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  calendar: ['M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M4 10h16', 'M8 3v4', 'M16 3v4'],
  receipt: ['M6 3h12v18l-3-2l-3 2l-3-2l-3 2z', 'M9 8h6', 'M9 12h6'],
  shield: 'M12 3l7 3v5c0 5-3.5 8-7 10c-3.5-2-7-5-7-10V6z',
  clipboard: ['M9 4h6v3H9z', 'M7 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1', 'M9 12h6', 'M9 16h4'],
}

export default function Icon({ name, size = 24, stroke = 2.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {[].concat(PATHS[name]).map((d) => <path key={d} d={d} />)}
    </svg>
  )
}
