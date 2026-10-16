import { useState } from 'react'
import { LeanSixSigmaPage, PrinciplesQuizPage, WhiteBeltPage } from './TrainingPages'
import RcaTrainingPage from './RcaTrainingPage'
import WireframeIntro, { type NarrationAudio } from './WireframeIntro'
import './App.css'

const defaultNarration: NarrationAudio = {
  name: 'Intro_1.wav',
  url: `${import.meta.env.BASE_URL}audio/Intro_1.wav`,
}

function App() {
  const [page, setPage] = useState<'intro' | 'rca' | 'lean' | 'whitebelt' | 'quiz'>('intro')

  if (page === 'intro') {
    return (
      <WireframeIntro
        narration={defaultNarration}
        onBegin={() => setPage('lean')}
        onRca={() => setPage('rca')}
      />
    )
  }

  if (page === 'rca') {
    return <RcaTrainingPage onBack={() => setPage('intro')} />
  }

  if (page === 'lean') {
    return <LeanSixSigmaPage onBack={() => setPage('intro')} onNext={() => setPage('whitebelt')} />
  }

  if (page === 'whitebelt') {
    return <WhiteBeltPage onBack={() => setPage('lean')} onNext={() => setPage('quiz')} />
  }

  return <PrinciplesQuizPage onBack={() => setPage('whitebelt')} />
}

export default App
