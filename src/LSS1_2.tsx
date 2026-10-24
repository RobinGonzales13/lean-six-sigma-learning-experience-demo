import { useEffect, useRef, type CSSProperties } from 'react'
import { CorridorScene } from './LSS1_1'

type LessonPageProps = {
  onNext: () => void
  onBack: () => void
}

type TrainingShellProps = {
  stage: string
  narration?: string
  children: React.ReactNode
}

function PageNarration({ fileName }: { fileName: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const src = `${import.meta.env.BASE_URL}audio/${fileName}`

  useEffect(() => {
    const player = audioRef.current
    if (!player) return

    void player.play().catch(() => {})

    return () => {
      player.pause()
      player.currentTime = 0
    }
  }, [src])

  return (
    <audio
      ref={audioRef}
      hidden
      autoPlay
      preload="auto"
      src={src}
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}

const principles = [
  'Reduce Waste',
  'Solve Problems',
  'Improve Processes',
  'Value vs Waste',
  'DMAIC Framework',
  'Simple Tools',
]

export function TrainingShell({ stage, narration, children }: TrainingShellProps) {
  return (
    <main className="wireframe-intro training-screen">
      <div className="fallback-grid" aria-hidden="true" />
      <CorridorScene />
      <div className="intro-vignette" aria-hidden="true" />
      <div className="training-shell">
        <header className="training-topbar">
          <span className="training-brand">LEAN SIX SIGMA / WHITE BELT</span>
          {narration && <PageNarration fileName={narration} />}
          <span className="training-stage">{stage}</span>
        </header>
        {children}
      </div>
    </main>
  )
}

export function LeanSixSigmaPage({ onNext, onBack }: LessonPageProps) {
  return (
    <TrainingShell stage="FOUNDATIONS / 01" narration="Intro_2.wav">
      <section className="lesson-layout" aria-labelledby="lean-title">
        <div className="lesson-copy">
          <p className="training-kicker"><span />THE BIG PICTURE</p>
          <h1 id="lean-title" className="lesson-title">Lean Six Sigma</h1>
          <ul className="principles-list">
            {principles.map((principle, index) => (
              <li
                className="principle-item"
                key={principle}
                style={{ animationDelay: `${280 + index * 180}ms` } as CSSProperties}
              >
                <span className="principle-index">0{index + 1}</span>
                <span className="principle-text">{principle}</span>
                <span className="principle-arrow" aria-hidden="true">+</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="lesson-art lesson-art-lean">
          <img
            src={`${import.meta.env.BASE_URL}logos/Intro_2.png`}
            alt="Lean Six Sigma gear emblem"
          />
          <figcaption>ONE SYSTEM. CONTINUOUS IMPROVEMENT.</figcaption>
        </figure>
      </section>
      <footer className="lesson-navigation">
        <button className="back-button" type="button" onClick={onBack}>
          <span aria-hidden="true">&lt;</span> Back
        </button>
        <span className="page-index">01 <i /> 03</span>
        <button className="next-button" type="button" onClick={onNext}>
          Next <span aria-hidden="true">&gt;</span>
        </button>
      </footer>
    </TrainingShell>
  )
}

export function WhiteBeltPage({ onNext, onBack }: LessonPageProps) {
  return (
    <TrainingShell stage="YOUR ROLE / 02" narration="Intro_3.wav">
      <section className="whitebelt-layout" aria-labelledby="whitebelt-title">
        <div className="whitebelt-copy">
          <p className="training-kicker"><span />START SMALL. MAKE IT BETTER.</p>
          <h1 id="whitebelt-title" className="lesson-title">White Belt</h1>
          <p className="whitebelt-body">
            As a whitebelt your role is to spot opportunities for improvements and support your team in making work better.
          </p>
          <p className="whitebelt-mantra">Remember, <strong>Big Change Starts with Small Steps.</strong></p>
        </div>
        <figure className="lesson-art lesson-art-whitebelt">
          <img
            src={`${import.meta.env.BASE_URL}logos/Intro_3.png`}
            alt="Blue digital process emblem"
          />
          <figcaption>NOTICE THE OPPORTUNITY IN THE EVERYDAY.</figcaption>
        </figure>
      </section>
      <footer className="lesson-navigation">
        <button className="back-button" type="button" onClick={onBack}>
          <span aria-hidden="true">&lt;</span> Back
        </button>
        <span className="page-index">02 <i /> 03</span>
        <button className="next-button" type="button" onClick={onNext}>
          Next <span aria-hidden="true">&gt;</span>
        </button>
      </footer>
    </TrainingShell>
  )
}
