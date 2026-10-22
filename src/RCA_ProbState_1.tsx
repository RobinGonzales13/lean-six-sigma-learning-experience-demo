import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

// Phrase starts in ProbState_1.wav, based on the narration's recorded pauses.
const CUES = {
  intro: 0.2,
  prompt: 3.8,
  questions: [5.78, 8.78, 11.58, 13.22],
  measurable: 14.98,
  vague: 18.62,
  clear: 20.78,
}

const questions = [
  'What is happening?',
  'Where is it happening?',
  'When does it occur?',
  'What is the impact?',
]

export default function RcaProblemStatementPage({ onBack }: { onBack: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [time, setTime] = useState(0)
  const shown = (cue: number) => (time >= cue ? ' is-shown' : '')

  useEffect(() => {
    const audio = audioRef.current
    let frame = 0
    const tick = () => {
      if (audio) setTime(audio.ended ? Infinity : audio.currentTime)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    void audio?.play()
      .then(() => setNeedsPlay(false))
      .catch(() => setNeedsPlay(true))

    return () => {
      cancelAnimationFrame(frame)
      audio?.pause()
    }
  }, [])

  function playNarration() {
    void audioRef.current?.play()
      .then(() => setNeedsPlay(false))
      .catch(() => setNeedsPlay(true))
  }

  return (
    <main className="rca-page rca-grid-page rca-probstate-page" aria-label="Root Cause Analysis: problem statement">
      <audio ref={audioRef} src={`${base}/sound/ProbState_1.wav`} preload="auto" autoPlay />
      <div className="rca-grid-scene" aria-hidden="true">
        <div className="rca-grid-glow" />
        <div className="rca-grid-lines" />
        <div className="rca-grid-sweep" />
      </div>
      <section className="rca-board rca-probstate-board" aria-labelledby="rca-probstate-title">
        <header className="rca-board-header">
          <p className="rca-board-kicker"><span /> ROOT CAUSE ANALYSIS / PLAN</p>
          <h1 id="rca-probstate-title">PROBLEM STATEMENT</h1>
          <span className="rca-board-rule" aria-hidden="true" />
        </header>
        <div className="rca-board-content rca-probstate-content">
          <p className={`rca-probstate-intro rca-cue${shown(CUES.intro)}`}>
            The first step in PDCA is creating a <strong>strong problem statement.</strong>
          </p>
          <h2 className={`rca-probstate-prompt rca-cue${shown(CUES.prompt)}`}>
            A clear problem statement should answer:
          </h2>
          <ol className="rca-probstate-questions">
            {questions.map((question, index) => (
              <li className={`rca-probstate-question rca-cue${shown(CUES.questions[index])}`} key={question}>
                <span className="rca-probstate-number">0{index + 1}</span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
          <p className={`rca-probstate-measurable rca-cue${shown(CUES.measurable)}`}>
            <span aria-hidden="true">◎</span> It should be specific and measurable.
          </p>
          <div className="rca-probstate-outcomes">
            <p className={`rca-probstate-outcome rca-probstate-vague rca-cue${shown(CUES.vague)}`}>
              <span aria-hidden="true">×</span>
              <span><strong>A vague problem</strong> leads to unclear solutions.</span>
            </p>
            <p className={`rca-probstate-outcome rca-probstate-clear rca-cue${shown(CUES.clear)}`}>
              <span aria-hidden="true">✓</span>
              <span><strong>A clear problem</strong> creates direction and focus.</span>
            </p>
          </div>
        </div>
      </section>
      <button className="back-button rca-back" type="button" onClick={onBack}>
        <span aria-hidden="true">&lt;</span> Back
      </button>
      {needsPlay && (
        <button className="begin-button rca-play" type="button" onClick={playNarration}>
          Play narration
        </button>
      )}
    </main>
  )
}
