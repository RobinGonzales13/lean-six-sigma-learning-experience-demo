import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CorridorScene } from './LSS_Opening_1'

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
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const src = `${import.meta.env.BASE_URL}audio/${fileName}`

  useEffect(() => {
    const player = audioRef.current
    if (!player) return
    let active = true

    void player.play()
      .then(() => { if (active) setAutoplayBlocked(false) })
      .catch(() => { if (active) setAutoplayBlocked(true) })

    return () => {
      active = false
      player.pause()
      player.currentTime = 0
    }
  }, [src])

  function handlePlay() {
    const player = audioRef.current
    if (!player) return
    void player.play()
      .then(() => setAutoplayBlocked(false))
      .catch(() => setAutoplayBlocked(true))
  }

  return (
    <div className="page-narration">
      <span className="page-narration-name">{fileName}</span>
      <audio
        ref={audioRef}
        controls
        autoPlay
        preload="auto"
        src={src}
        aria-label={`${fileName} narration`}
        onPlay={() => setAutoplayBlocked(false)}
      />
      {autoplayBlocked && (
        <button className="narration-retry-button" type="button" onClick={handlePlay}>
          Play narration
        </button>
      )}
    </div>
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

const quizOptions = [
  'Reduce waste, solve problems, and improve processes.',
  'Focus only on speed and ignore customer value.',
  'Add more steps so every task has extra checks.',
  'Use complex tools before understanding the process.',
]

function TrainingShell({ stage, narration, children }: TrainingShellProps) {
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

export function PrinciplesQuizPage({ onBack }: { onBack: () => void }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  return (
    <TrainingShell stage="KNOWLEDGE CHECK / 03">
      <section className="quiz-layout" aria-labelledby="quiz-title">
        <div className="quiz-heading">
          <p className="training-kicker"><span />FINAL CHECK</p>
          <h1 id="quiz-title" className="lesson-title">Put the principles together.</h1>
          <p className="quiz-question">What is the main aim of Lean Six Sigma?</p>
        </div>

        <fieldset className="quiz-options">
          <legend className="visually-hidden">Choose one answer</legend>
          {quizOptions.map((option, index) => (
            <label
              className={`quiz-option${selectedOption === index ? ' is-selected' : ''}`}
              key={option}
              style={{ animationDelay: `${160 + index * 120}ms` } as CSSProperties}
            >
              <input
                type="radio"
                name="lean-six-sigma-answer"
                value={index}
                checked={selectedOption === index}
                onChange={() => setSelectedOption(index)}
              />
              <span className="quiz-option-index">0{index + 1}</span>
              <span className="quiz-option-text">{option}</span>
              <span className="quiz-option-indicator" aria-hidden="true" />
            </label>
          ))}
        </fieldset>

        <footer className="quiz-actions">
          <span className="quiz-note">SELECT ONE RESPONSE</span>
          <div className="quiz-action-buttons">
            <button className="back-button" type="button" onClick={onBack}>
              <span aria-hidden="true">&lt;</span> Back
            </button>
            <button className="submit-answer-button" type="button">
              Submit answer <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </footer>
      </section>
      <div className="quiz-endmark"><span />END OF DEMO<span /></div>
    </TrainingShell>
  )
}
