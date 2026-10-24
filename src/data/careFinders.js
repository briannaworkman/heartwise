import { courses } from './courses'

// Official finders we link out to. Heartwise never asks for or stores a location: the finder asks you.
// Every URL here was checked to load on 2026-10-24. `for` lists the courses it helps most.
export const FINDERS = [
  {
    id: 'health-center',
    title: 'Community health centers',
    blurb: 'Find a health center near you. Many offer care on a sliding fee scale based on income, so ask when you call.',
    url: 'https://findahealthcenter.hrsa.gov/',
    cta: 'Open HRSA Find a Health Center',
    icon: 'heart',
    for: ['care', 'meds', 'cost'],
  },
  {
    id: 'coverage-help',
    title: 'Free help with health insurance',
    blurb: 'Find trained people near you who can help you understand plans and apply for coverage.',
    url: 'https://www.healthcare.gov/find-local-help/',
    cta: 'Open Healthcare.gov local help',
    icon: 'shield',
    for: ['cost'],
  },
  {
    id: 'mi-bridges',
    title: 'Michigan benefits',
    blurb: 'Apply for and manage Michigan state benefits in one place.',
    url: 'https://newmibridges.michigan.gov/',
    cta: 'Open MI Bridges',
    icon: 'clipboard',
    for: ['cost'],
  },
  {
    id: '211',
    title: 'Local help for everyday needs',
    blurb: 'Call 211 or use the site to find local services like food, housing and utilities help.',
    url: 'https://211.org/',
    cta: 'Open 211',
    icon: 'calendar',
    for: ['cost', 'care'],
  },
  {
    id: 'medicare',
    title: 'Compare Medicare providers',
    blurb: 'Compare doctors, hospitals and other providers that accept Medicare.',
    url: 'https://www.medicare.gov/care-compare/',
    cta: 'Open Medicare Care Compare',
    icon: 'receipt',
    for: ['care'],
  },
]

export const courseIdFor = (topicId) =>
  courses.find((c) => c.steps.some((s) => s.topic?.id === topicId))?.id ?? 'meds'

// Finders most useful for a course, best matches first. Medications also points to your pharmacist.
export const findersFor = (courseId) => FINDERS.filter((f) => f.for.includes(courseId)).slice(0, 2)
