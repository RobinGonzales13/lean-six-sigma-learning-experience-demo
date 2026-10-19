import { useState } from 'react'
import { LeanSixSigmaPage, PrinciplesQuizPage, WhiteBeltPage } from './TrainingPages'
import ILE_Dashboard from './ILE_Dashboard'
import RcaTrainingPage from './Rca_Opening_1'
import RcaProblemPage from './Rca_Opening_2'
import WireframeIntro, { type NarrationAudio } from './LSS_Opening_1'
import './App.css'

const defaultNarration: NarrationAudio = {
  name: 'Intro_1.wav',
  url: `${import.meta.env.BASE_URL}audio/Intro_1.wav`,
}

function App() {
  const [page, setPage] = useState<'intro' | 'ile-dashboard' | 'rca' | 'rca-problem' | 'lean' | 'whitebelt' | 'quiz'>('ile-dashboard')

  if (page === 'intro') {
    return (
      <WireframeIntro
        narration={defaultNarration}
        onBegin={() => setPage('lean')}
      />
    )
  }

  if (page === 'ile-dashboard') {
    return (
      <ILE_Dashboard
        onRca={() => setPage('rca')}
        onWhiteBelt={() => setPage('intro')}
      />
    )
  }

  if (page === 'rca') {
    return <RcaTrainingPage onBack={() => setPage('intro')} onStart={() => setPage('rca-problem')} />
  }

  if (page === 'rca-problem') {
    return <RcaProblemPage onBack={() => setPage('rca')} />
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
