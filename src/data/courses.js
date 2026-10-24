import { topics } from './topics'
import { careTopics } from './careVisits'
import { costTopics } from './insurance'

const find = (list, id) => list.find((t) => t.id === id)

// A step is { topic, icon } for a lesson, or { kind: 'scan' } for the photo step.
export const courses = [
  {
    id: 'meds',
    title: 'Medications',
    icon: 'pill',
    unit: 'Understand your medicine',
    sub: 'Labels, health words, and speaking up',
    steps: [
      { topic: find(topics, 'label'), icon: 'pill' },
      { topic: find(topics, 'words'), icon: 'book' },
      { kind: 'scan' },
      { topic: find(topics, 'ask'), icon: 'chat' },
    ],
  },
  {
    id: 'care',
    title: 'Care visits',
    icon: 'heart',
    unit: 'Get more from every visit',
    sub: 'Teach-back, checkups, and getting ready',
    steps: [
      { topic: find(careTopics, 'teach'), icon: 'chat' },
      { topic: find(careTopics, 'checkups'), icon: 'heart' },
      { topic: find(careTopics, 'prepare'), icon: 'calendar' },
    ],
  },
  {
    id: 'cost',
    title: 'Insurance costs',
    icon: 'receipt',
    unit: 'Make sense of costs',
    sub: 'Plan terms, networks, and bills',
    steps: [
      { topic: find(costTopics, 'terms'), icon: 'receipt' },
      { topic: find(costTopics, 'network'), icon: 'shield' },
      { topic: find(costTopics, 'bills'), icon: 'clipboard' },
    ],
  },
]

// Shown as locked tiles. Content for these needs expert review before it is published.
export const comingSoon = ['Conditions', 'Sexual health']
