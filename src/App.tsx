import { useState } from 'react'
import { LeanSixSigmaPage, PrinciplesQuizPage, WhiteBeltPage } from './TrainingPages'
import ILE_Dashboard from './ILE_Dashboard'
import LogInPage from './LogInPage'
import MyProfile from './MyProfile'
import RcaTrainingPage from './RCA/Rca_Opening_1'
import RcaProblemPage from './RCA/Rca_Opening_2'
import RcaOpeningThree from './RCA/RCA_Opening_3'
import RcaAgendaPage from './RCA/RCA_Agenda_1'
import RcaExperienceOutcomes from './RCA/RCA_ExpOut_1'
import RcaReflectionPage from './RCA/RCA_Ref_1'
import RcaWhatPage from './RCA/RCA_What_1'
import RcaWhatTwo from './RCA/RCA_What_2'
import RcaPdcaPage from './RCA/RCA_Pdca_1'
import RcaProblemStatementPage from './RCA/RCA_ProbState_1'
import DevNav from './DevNav'
import type { Page } from './pages'
import WireframeIntro, { type NarrationAudio } from './LSS_Opening_1'
import './App.css'

const defaultNarration: NarrationAudio = {
  name: 'Intro_1.wav',
  url: `${import.meta.env.BASE_URL}audio/Intro_1.wav`,
}

function Pages({ page, setPage }: { page: Page; setPage: (page: Page) => void }) {
  if (page === 'intro') {
    return (
      <WireframeIntro
        narration={defaultNarration}
        onBegin={() => setPage('lean')}
        onBack={() => setPage('ile-dashboard')}
      />
    )
  }

  if (page === 'ile-dashboard') {
    return (
      <ILE_Dashboard
        onRca={() => setPage('rca')}
        onWhiteBelt={() => setPage('intro')}
        onLogin={() => setPage('login')}
      />
    )
  }

  if (page === 'my-profile') {
    return <MyProfile onBack={() => setPage('ile-dashboard')} />
  }

  if (page === 'login') {
    return <LogInPage onBack={() => setPage('ile-dashboard')} />
  }

  if (page === 'rca') {
    return <RcaTrainingPage onBack={() => setPage('ile-dashboard')} onStart={() => setPage('rca-problem')} />
  }

  if (page === 'rca-problem') {
    return <RcaProblemPage onBack={() => setPage('rca')} onNext={() => setPage('rca-opening-3')} />
  }

  if (page === 'rca-opening-3') {
    return <RcaOpeningThree onBack={() => setPage('rca-problem')} onNext={() => setPage('rca-agenda')} />
  }

  if (page === 'rca-agenda') {
    return <RcaAgendaPage onBack={() => setPage('rca-opening-3')} onNext={() => setPage('rca-expout')} />
  }

  if (page === 'rca-expout') {
    return <RcaExperienceOutcomes onBack={() => setPage('rca-agenda')} onNext={() => setPage('rca-ref')} />
  }

  if (page === 'rca-ref') {
    return <RcaReflectionPage onBack={() => setPage('rca-expout')} onNext={() => setPage('rca-what')} />
  }

  if (page === 'rca-what') {
    return <RcaWhatPage onBack={() => setPage('rca-ref')} onNext={() => setPage('rca-what-2')} />
  }

  if (page === 'rca-what-2') {
    return <RcaWhatTwo onBack={() => setPage('rca-what')} onNext={() => setPage('rca-pdca-1')} />
  }

  if (page === 'rca-pdca-1') {
    return <RcaPdcaPage onBack={() => setPage('rca-what-2')} onNext={() => setPage('rca-probstate-1')} />
  }

  if (page === 'rca-probstate-1') {
    return <RcaProblemStatementPage onBack={() => setPage('rca-pdca-1')} />
  }

  if (page === 'lean') {
    return <LeanSixSigmaPage onBack={() => setPage('intro')} onNext={() => setPage('whitebelt')} />
  }

  if (page === 'whitebelt') {
    return <WhiteBeltPage onBack={() => setPage('lean')} onNext={() => setPage('quiz')} />
  }

  return <PrinciplesQuizPage onBack={() => setPage('whitebelt')} />
}

function App() {
  const [page, setPage] = useState<Page>('ile-dashboard')

  return (
    <>
      <Pages page={page} setPage={setPage} />
      <DevNav page={page} onGo={setPage} />
    </>
  )
}

export default App
