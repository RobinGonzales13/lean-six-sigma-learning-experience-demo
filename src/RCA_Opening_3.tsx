import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

// Seconds into voice_intro2.wav at which each word is spoken.
const CUES = {
  intro: 0.1, // "This training focuses..."
  identify: 3.1,
  analyze: 4.26,
  eliminate: 5.18,
  source: 5.98, // "at their source"
  conclusion: 7.32, // "so they do not come back."
  buttons: 8.3,
}

export default function RcaOpeningThree({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const voiceRef = useRef<HTMLAudioElement>(null)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [time, setTime] = useState(0)
  const shown = (cue: number) => (time >= cue ? ' is-shown' : '')

  // Narration starts on mount; text is revealed from the audio clock so it stays in sync.
  useEffect(() => {
    const voice = voiceRef.current
    let frame = 0
    const tick = () => {
      if (voice) setTime(voice.ended ? Infinity : voice.currentTime)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    void voice?.play().catch((error: unknown) => {
      // An aborted play (e.g. effect re-run) is not an autoplay block.
      if (error instanceof DOMException && error.name === 'NotAllowedError') setNeedsPlay(true)
    })

    return () => {
      cancelAnimationFrame(frame)
      voice?.pause()
    }
  }, [])

  function playVoice() {
    void voiceRef.current?.play().catch(() => {})
  }

  return (
    <main className="rca-page rca-grid-page" aria-label="Root Cause Analysis">
      <audio
        ref={voiceRef}
        src={`${base}/sound/voice_intro2.wav`}
        preload="auto"
        autoPlay
        onPlaying={() => setNeedsPlay(false)}
      />
      <div className="rca-grid-scene" aria-hidden="true">
        <div className="rca-grid-glow" />
        <div className="rca-grid-lines" />
        <div className="rca-grid-sweep" />
      </div>
      <section className="rca-board" aria-labelledby="rca-board-title">
        <header className="rca-board-header">
          <p className="rca-board-kicker"><span /> ROOT CAUSE ANALYSIS / TRAINING</p>
          <h1 id="rca-board-title">STRUCTURED PROBLEM-SOLVING APPROACH</h1>
          <span className="rca-board-rule" aria-hidden="true" />
        </header>
        <div className="rca-board-content">
          <p className={`rca-board-intro rca-cue${shown(CUES.intro)}`}>
            This training focuses on building a structured approach to
          </p>
          <ul className="rca-board-steps" aria-label="Problem-solving steps">
            <li className={`rca-board-step rca-cue${shown(CUES.identify)}`}>
              <img className="rca-board-step-icon" src={`${base}/img/Identify_logo.svg`} alt="" />
              <span>Identify</span>
              <span className="rca-board-step-mark" aria-hidden="true">+</span>
            </li>
            <li className={`rca-board-step rca-cue${shown(CUES.analyze)}`}>
              <img className="rca-board-step-icon" src={`${base}/img/Analyze_logo.svg`} alt="" />
              <span>Analyze</span>
              <span className="rca-board-step-mark" aria-hidden="true">+</span>
            </li>
            <li className={`rca-board-step rca-cue${shown(CUES.eliminate)}`}>
              <img className="rca-board-step-icon" src={`${base}/img/Eliminate_logo.svg`} alt="" />
              <span>Eliminate problems</span>
              <span className="rca-board-step-mark" aria-hidden="true">+</span>
            </li>
          </ul>
          <p className="rca-board-conclusion">
            <span className={`rca-cue${shown(CUES.source)}`}>at their source</span>{' '}
            <strong className={`rca-cue${shown(CUES.conclusion)}`}>so they do not come back.</strong>
          </p>
        </div>
      </section>
      {needsPlay && (
        <button className="begin-button rca-play" type="button" onClick={playVoice}>
          Play narration
        </button>
      )}
      <button className={`back-button rca-back rca-open-btn rca-cue${shown(CUES.buttons)}`} type="button" onClick={onBack}>
        <span aria-hidden="true">&lt;</span> Back
      </button>
      <button className={`next-button rca-next rca-open-btn rca-cue${shown(CUES.buttons)}`} type="button" onClick={onNext}>
        Next <span aria-hidden="true">&gt;</span>
      </button>
    </main>
  )
}
