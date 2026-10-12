import { useState } from 'react'
import { LeanSixSigmaPage, PrinciplesQuizPage, WhiteBeltPage } from './TrainingPages'
import WireframeIntro, { type NarrationAudio } from './WireframeIntro'
import './App.css'

const defaultNarration: NarrationAudio = {
  name: 'Intro_1.wav',
  url: `${import.meta.env.BASE_URL}audio/Intro_1.wav`,
}

function App() {
  const [page, setPage] = useState<'intro' | 'lean' | 'whitebelt' | 'quiz'>('intro')

  if (page === 'intro') {
    return <WireframeIntro narration={defaultNarration} onBegin={() => setPage('lean')} />
  }

  if (page === 'lean') {
    return <LeanSixSigmaPage onNext={() => setPage('whitebelt')} />
  }

  if (page === 'whitebelt') {
    return <WhiteBeltPage onNext={() => setPage('quiz')} />
  }

  return <PrinciplesQuizPage />
}

export default App
