import { useEffect, useRef, useState, type FormEvent } from 'react'
import WireframeIntro, { type NarrationAudio } from './WireframeIntro'
import './App.css'

const answers = [
  {
    id: 'map',
    letter: 'A',
    text: 'Map the current process and measure where orders wait.',
  },
  {
    id: 'batch',
    letter: 'B',
    text: 'Increase the batch size so production stays busy.',
  },
  {
    id: 'inspect',
    letter: 'C',
    text: 'Add another inspection at the end of the process.',
  },
  {
    id: 'target',
    letter: 'D',
    text: 'Set a time-reduction target before collecting baseline data.',
  },
]

const correctAnswer = 'map'
const phases = ['Define', 'Measure', 'Analyze', 'Improve', 'Control']
const defaultNarration: NarrationAudio = {
  name: 'Intro_1.wav',
  url: `${import.meta.env.BASE_URL}audio/Intro_1.wav`,
}

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [narration, setNarration] = useState<NarrationAudio | null>(defaultNarration)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const narrationUrlRef = useRef<string | null>(null)
  const isCorrect = selectedAnswer === correctAnswer

  useEffect(() => () => {
    if (narrationUrlRef.current) URL.revokeObjectURL(narrationUrlRef.current)
  }, [])

  function handleNarrationSelect(file: File | null) {
    if (narrationUrlRef.current) URL.revokeObjectURL(narrationUrlRef.current)
    narrationUrlRef.current = null

    if (!file) {
      setNarration(null)
      return
    }

    const url = URL.createObjectURL(file)
    narrationUrlRef.current = url
    setNarration({ name: file.name, url })
  }

  function handleBegin() {
    if (narrationUrlRef.current) URL.revokeObjectURL(narrationUrlRef.current)
    narrationUrlRef.current = null
    setNarration(null)
    setShowIntro(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (selectedAnswer) setHasSubmitted(true)
  }

  function handleReset() {
    setSelectedAnswer(null)
    setHasSubmitted(false)
  }

  if (showIntro) {
    return (
      <WireframeIntro
        narration={narration}
        onSelectNarration={handleNarrationSelect}
        onBegin={handleBegin}
      />
    )
  }

  return (
    <div className="app-shell">
      <aside className="phase-rail">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">L</span>
          <span className="brand-name">PROCESS<br />FIELD GUIDE</span>
        </div>

        <div className="rail-caption">LEAN SIX SIGMA / 01</div>
        <h2 className="rail-title">Improve the<br />way work flows.</h2>

        <nav aria-label="DMAIC phases">
          <ol className="phase-list">
            {phases.map((phase, index) => (
              <li
                className={phase === 'Measure' ? 'phase-item is-current' : 'phase-item'}
                aria-current={phase === 'Measure' ? 'step' : undefined}
                key={phase}
              >
                <span className="phase-index">0{index + 1}</span>
                <span>{phase}</span>
                {phase === 'Measure' && <span className="phase-current-label">YOU ARE HERE</span>}
              </li>
            ))}
          </ol>
        </nav>

        <div className="rail-footer">
          <span className="rail-footer-line" />
          <span>OBSERVE FIRST.<br />IMPROVE WITH EVIDENCE.</span>
        </div>
      </aside>

      <main className="workspace">
        <div className="workspace-inner">
          <header className="topbar">
            <div className="breadcrumb"><span>FIELD NOTES</span><span aria-hidden="true">/</span><span>MEASURE</span></div>
            <div className="question-count"><span className="count-dot" />QUESTION 01 <span className="count-divider">/</span> 01</div>
          </header>

          <section className="lesson-intro" aria-labelledby="page-title">
            <div className="intro-copy">
              <p className="eyebrow"><span className="eyebrow-rule" />DMAIC / PHASE 02</p>
              <h1 id="page-title">Where is the time <em>hiding?</em></h1>
              <p className="scenario-copy">
                A made-to-order unit spends <strong>14 hours waiting</strong> after approval,
                while hands-on processing takes just <strong>18 minutes</strong>.
              </p>
            </div>

            <aside className="process-panel" aria-labelledby="snapshot-title">
              <div className="panel-heading">
                <span className="panel-kicker">CURRENT STATE / ORDER 047</span>
                <span className="panel-marker" aria-hidden="true">+</span>
              </div>
              <h2 id="snapshot-title">Most lead time isn't active work.</h2>

              <div className="time-stats">
                <div className="time-stat wait-stat">
                  <span className="stat-label"><span className="stat-swatch" />WAITING</span>
                  <strong>14<span>h</span></strong>
                </div>
                <div className="time-stat work-stat">
                  <span className="stat-label"><span className="stat-swatch" />TOUCH TIME</span>
                  <strong>18<span>min</span></strong>
                </div>
              </div>

              <div className="flow-visual" role="img" aria-label="Order flow: approval, a long 14-hour wait, then 18 minutes of production work.">
                <div className="flow-endpoint">
                  <span className="endpoint-dot" />
                  <span>APPROVAL</span>
                </div>
                <div className="flow-track">
                  <span className="wait-segment"><span>QUEUE / 14H</span></span>
                  <span className="work-segment" />
                </div>
                <div className="flow-endpoint flow-end">
                  <span className="endpoint-dot" />
                  <span>PRODUCTION</span>
                </div>
              </div>
              <p className="panel-note">The queue is visible. The cause isn't. <span aria-hidden="true">&gt;</span></p>
            </aside>
          </section>

          <section className="knowledge-check" aria-labelledby="question-title">
            <div className="question-heading">
              <span className="question-number">01</span>
              <div>
                <p className="question-kicker">KNOWLEDGE CHECK <span>/</span> ABOUT 30 SECONDS</p>
                <h2 id="question-title">Before suggesting a fix, what should the team do next?</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <fieldset className="answer-list" disabled={hasSubmitted}>
                <legend className="visually-hidden">Choose the best next step</legend>
                {answers.map((answer) => {
                  const answerClass = [
                    'answer-option',
                    selectedAnswer === answer.id ? 'is-selected' : '',
                    hasSubmitted && answer.id === correctAnswer ? 'is-correct' : '',
                    hasSubmitted && selectedAnswer === answer.id && !isCorrect ? 'is-incorrect' : '',
                  ].filter(Boolean).join(' ')

                  return (
                    <label className={answerClass} key={answer.id}>
                      <input
                        type="radio"
                        name="next-step"
                        value={answer.id}
                        checked={selectedAnswer === answer.id}
                        onChange={() => setSelectedAnswer(answer.id)}
                      />
                      <span className="answer-letter" aria-hidden="true">{answer.letter}</span>
                      <span className="answer-text">{answer.text}</span>
                      <span className="answer-indicator" aria-hidden="true" />
                    </label>
                  )
                })}
              </fieldset>

              <div className="form-actions">
                <button className="submit-button" type="submit" disabled={!selectedAnswer || hasSubmitted}>
                  Check answer <span aria-hidden="true">&gt;</span>
                </button>
                <span className="privacy-note">Your choice stays on this screen.</span>
              </div>
            </form>

            {hasSubmitted && (
              <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-review'}`} role="status" aria-live="polite">
                <span className="feedback-mark" aria-hidden="true">{isCorrect ? 'OK' : 'NOTE'}</span>
                <div className="feedback-copy">
                  <strong>{isCorrect ? 'Good call. Make the current flow visible.' : 'Start by making the current flow visible.'}</strong>
                  <p>
                    In the Measure phase, map the end-to-end process and establish what is happening now.
                    That gives the team evidence to investigate before choosing a change.
                  </p>
                </div>
                <button className="reset-button" type="button" onClick={handleReset}>Try again</button>
              </div>
            )}
          </section>

          <footer className="page-footer">
            <span>LEAN SIX SIGMA / PRACTICE 01</span>
            <span>NOTICE THE GAP BETWEEN WORK AND WAIT.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App