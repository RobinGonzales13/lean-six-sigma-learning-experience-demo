import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

// Seconds into ExpOut_1.wav at which each phrase starts being spoken.
const CUES = {
  intro: 0.08, // "By the end of this training..."
  lead: 5.68, // "This includes"
  items: [7.25, 11.05, 14.65, 17.7], // defining / identifying / distinguishing / applying
  conclusion: 21.85, // "The focus is not just..."
  next: 26.3, // narration ends at ~26.4s
}

export default function RcaExperienceOutcomes({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [time, setTime] = useState(0)
  const shown = (cue: number) => (time >= cue ? ' is-shown' : '')

  // Text is revealed from the audio clock so it appears as each phrase is narrated.
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
    <main className="rca-page rca-grid-page rca-expout-page" aria-label="Root Cause Analysis experience outcomes">
      <audio ref={audioRef} src={`${base}/sound/ExpOut_1.wav`} preload="auto" autoPlay />
      <div className="rca-grid-scene" aria-hidden="true">
        <div className="rca-grid-glow" />
        <div className="rca-grid-lines" />
        <div className="rca-grid-sweep" />
      </div>
      <section className="rca-board" aria-labelledby="rca-expout-title">
        <header className="rca-board-header">
          <p className="rca-board-kicker"><span /> ROOT CAUSE ANALYSIS / LEARNING OUTCOMES</p>
          <h1 id="rca-expout-title">EXPECTED OUTCOME</h1>
          <span className="rca-board-rule" aria-hidden="true" />
        </header>
        <div className="rca-board-content">
          <p className={`rca-board-intro rca-cue${shown(CUES.intro)}`}>
            By the end of this training, you will be able to approach problems with clarity and structure.
          </p>
          <p className={`rca-expout-lead rca-cue${shown(CUES.lead)}`}>This includes:</p>
          <ul className="rca-expout-list" aria-label="Expected outcomes">
            <li className={`rca-cue${shown(CUES.items[0])}`}>Defining problems based on measurable impact</li>
            <li className={`rca-cue${shown(CUES.items[1])}`}>Identifying waste that reduces efficiency</li>
            <li className={`rca-cue${shown(CUES.items[2])}`}>Distinguishing symptoms from root causes</li>
            <li className={`rca-cue${shown(CUES.items[3])}`}>Applying solutions that are sustainable and repeatable</li>
          </ul>
          <p className={`rca-board-conclusion rca-cue${shown(CUES.conclusion)}`}>
            The focus is not just solving problems but improving how problems are solved.
          </p>
        </div>
      </section>
      <button className="back-button rca-back" type="button" onClick={onBack}>
        <span aria-hidden="true">&lt;</span> Back
      </button>
      <button className={`next-button rca-next rca-cue${shown(CUES.next)}`} type="button" onClick={onNext}>
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
