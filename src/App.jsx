import { useEffect, useState } from 'react'
import Home from './screens/Home'
import Lesson from './screens/Lesson'
import Results from './screens/Results'
import Scan from './screens/Scan'
import { getHealth } from './lib/api'
import { loadProgress, recordLesson } from './lib/storage'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [topic, setTopic] = useState(null)
  const [isPractice, setIsPractice] = useState(false)
  const [answers, setAnswers] = useState([])
  const [progress, setProgress] = useState(loadProgress)
  const [lessonKey, setLessonKey] = useState(0)
  const [health, setHealth] = useState(null)

  useEffect(() => {
    getHealth().then(setHealth)
  }, [])

  function start(t, practice = false) {
    setTopic(t)
    setIsPractice(practice)
    setLessonKey((k) => k + 1)
    setScreen('lesson')
  }

  function finish(result) {
    setAnswers(result)
    if (!isPractice) {
      const correct = result.filter((a) => a.correct).length
      setProgress(recordLesson(topic.id, { correct, total: result.length }))
    }
    setScreen('results')
  }

  function practiceMissed(ids) {
    const full = topic.fullTopic ?? topic
    start({ ...full, fullTopic: full, questions: full.questions.filter((q) => ids.includes(q.id)) }, true)
  }

  if (screen === 'scan') return <Scan health={health} onBack={() => setScreen('home')} onStart={(t) => start(t)} />
  if (screen === 'lesson') return <Lesson key={lessonKey} topic={topic} onExit={() => setScreen('home')} onFinish={finish} />
  if (screen === 'results') {
    return <Results key={lessonKey} topic={topic.fullTopic ?? topic} answers={answers} isPractice={isPractice} onHome={() => setScreen('home')} onPractice={practiceMissed} />
  }
  return <Home progress={progress} health={health} onStart={(t) => start(t)} onScan={() => setScreen('scan')} />
}
