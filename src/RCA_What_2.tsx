import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

// Seconds into What_2.wav at which each phrase starts being spoken.
const CUES = {
  focus: 1.05,
  facts: 2.65,
  impact: 3.45,
  scope: 4.25,
  not: 5.05,
  opinions: 5.65,
  assumptions: 6.65,
  conclusion: 8.05,
}

export default function RcaWhatTwo({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
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
    <main className="rca-page rca-grid-page rca-what-two-page" aria-label="Root Cause Analysis: what is a problem">
      <audio ref={audioRef} src={`${base}/sound/What_2.wav`} preload="auto" autoPlay />
      <div className="rca-grid-scene" aria-hidden="true">
        <div className="rca-grid-glow" />
        <div className="rca-grid-lines" />
        <div className="rca-grid-sweep" />
      </div>
      <section className="rca-board rca-what-two-board" aria-labelledby="rca-what-two-title">
        <header className="rca-board-header">
          <p className="rca-board-kicker"><span /> ROOT CAUSE ANALYSIS / PROBLEM DEFINITION</p>
          <h1 id="rca-what-two-title">WHAT IS A PROBLEM?</h1>
          <span className="rca-board-rule" aria-hidden="true" />
        </header>
        <div className="rca-board-content rca-what-two-content">
          <section className="rca-what-two-group" aria-labelledby="rca-what-two-strong">
            <h2 id="rca-what-two-strong" className={`rca-cue${shown(CUES.focus)}`}>
              A strong problem statement should focus on:
            </h2>
            <ul className="rca-what-two-list">
              <li className={`rca-cue${shown(CUES.facts)}`}>Facts</li>
              <li className={`rca-cue${shown(CUES.impact)}`}>Impact</li>
              <li className={`rca-cue${shown(CUES.scope)}`}>Scope</li>
            </ul>
          </section>
          <section className="rca-what-two-group rca-what-two-not" aria-labelledby="rca-what-two-not-title">
            <h2 id="rca-what-two-not-title" className={`rca-cue${shown(CUES.not)}`}>Not:</h2>
            <ul className="rca-what-two-list">
              <li className={`rca-cue${shown(CUES.opinions)}`}>Opinions</li>
              <li className={`rca-cue${shown(CUES.assumptions)}`}>Assumptions</li>
            </ul>
          </section>
          <p className={`rca-what-two-conclusion rca-cue${shown(CUES.conclusion)}`}>
            Clear definition creates alignment and ensures that effort is focused on the right issue.
          </p>
        </div>
      </section>
      <button className="back-button rca-back" type="button" onClick={onBack}>
        <span aria-hidden="true">&lt;</span> Back
      </button>
      <button className="next-button rca-next" type="button" onClick={onNext}>
        Next <span aria-hidden="true">&gt;</span>
      </button>
      {needsPlay && (
        <button className="begin-button rca-play" type="button" onClick={playNarration}>
          Play narration
        </button>
      )}
    </main>
  )
}
