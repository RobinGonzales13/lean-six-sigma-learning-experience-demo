import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

export default function RcaOpeningThree({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const voiceRef = useRef<HTMLAudioElement>(null)
  const [needsPlay, setNeedsPlay] = useState(false)

  // Narration starts on mount, together with the CSS entrance animations.
  useEffect(() => {
    const voice = voiceRef.current
    void voice?.play().catch((error: unknown) => {
      // An aborted play (e.g. effect re-run) is not an autoplay block.
      if (error instanceof DOMException && error.name === 'NotAllowedError') setNeedsPlay(true)
    })

    return () => voice?.pause()
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
          <p className="rca-board-intro">
            This training focuses on building a structured approach to
          </p>
          <ul className="rca-board-steps" aria-label="Problem-solving steps">
            <li className="rca-board-step">
              <img className="rca-board-step-icon" src={`${base}/img/Identify_logo.svg`} alt="" />
              <span>Identify</span>
              <span className="rca-board-step-mark" aria-hidden="true">+</span>
            </li>
            <li className="rca-board-step">
              <img className="rca-board-step-icon" src={`${base}/img/Analyze_logo.svg`} alt="" />
              <span>Analyze</span>
              <span className="rca-board-step-mark" aria-hidden="true">+</span>
            </li>
            <li className="rca-board-step">
              <img className="rca-board-step-icon" src={`${base}/img/Eliminate_logo.svg`} alt="" />
              <span>Eliminate problems</span>
              <span className="rca-board-step-mark" aria-hidden="true">+</span>
            </li>
          </ul>
          <p className="rca-board-conclusion">
            at their source <strong>so they do not come back.</strong>
          </p>
        </div>
      </section>
      {needsPlay && (
        <button className="begin-button rca-play" type="button" onClick={playVoice}>
          Play narration
        </button>
      )}
      <button className="back-button rca-back rca-open-btn" type="button" onClick={onBack}>
        <span aria-hidden="true">&lt;</span> Back
      </button>
      <button className="next-button rca-next rca-open-btn" type="button" onClick={onNext}>
        Next <span aria-hidden="true">&gt;</span>
      </button>
    </main>
  )
}
