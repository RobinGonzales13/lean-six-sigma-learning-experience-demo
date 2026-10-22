import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

// Phrase starts in Pdca_1.wav, aligned to the pauses between narrated sections.
const CUES = {
  intro: 0.18,
  steps: [3.56, 8.56, 15.68, 19.76],
  takeaway: 24.92,
}

const steps = [
  {
    name: 'Plan',
    description: 'Understand the current state, identify the problem, and define a hypothesis.',
    icon: 'plan',
  },
  {
    name: 'Do',
    description: 'Test the proposed solution in a controlled way.',
    icon: 'do',
  },
  {
    name: 'Check',
    description: 'Measure results and compare them to expectations.',
    icon: 'check',
  },
  {
    name: 'Act',
    description: 'Standardize successful changes and stabilize the process.',
    icon: 'act',
  },
] as const

function PdcaIcon({ name }: { name: (typeof steps)[number]['icon'] }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const

  return (
    <svg viewBox={name === 'act' ? '0 0 64 64' : '0 0 32 32'} width="38" height="38" aria-hidden="true" {...common}>
      {name === 'plan' && (
        <>
          <path d="M16 6.5c-1.3-2-4.2-2.2-5.8-.7-2.2-.5-4.4 1.1-4.4 3.5-2.4 1.5-2.6 4.8-.5 6.6-1 2.6.8 5.4 3.5 5.6.8 2.1 3.5 3 5.4 1.6L16 22z" />
          <path d="M16 6.5c1.3-2 4.2-2.2 5.8-.7 2.2-.5 4.4 1.1 4.4 3.5 2.4 1.5 2.6 4.8.5 6.6 1 2.6-.8 5.4-3.5 5.6-.8 2.1-3.5 3-5.4 1.6L16 22z" />
          <path d="M16 6.5v17M11 9.5c1.6.2 2.4 1.2 2.2 2.8M7.5 13c1.6-.3 2.7.4 3.1 1.8m10.4-5.3c-1.6.2-2.4 1.2-2.2 2.8m5.7.7c-1.6-.3-2.7.4-3.1 1.8M12 19c1.6-.7 2.7-.2 3.1 1.2m4.9-1.2c-1.6-.7-2.7-.2-3.1 1.2" />
        </>
      )}
      {name === 'do' && (
        <>
          <path d="M5 15.5c0-1.2.9-2.1 2.1-2.1.5 0 1 .2 1.4.5V8.2c0-1.2.9-2.1 2.1-2.1s2.1.9 2.1 2.1v4.1c.3-.8 1.1-1.3 2-1.3 1.1 0 2 .8 2.1 1.9.4-.6 1-.9 1.8-.9 1.2 0 2.1.9 2.1 2.1.4-.5 1-.8 1.7-.8 1.2 0 2.1.9 2.1 2.1v5.1c0 4.2-3.4 7.6-7.6 7.6h-2.1c-2.5 0-4.8-1.2-6.2-3.3l-3-4.6c-.8-1.2-.5-2.8.7-3.6.6-.4 1.4-.5 2.1-.3" />
          <path d="M12.7 12.3v4.1m4.1-2.2v2.4m3.9-1.5v1.5" />
        </>
      )}
      {name === 'check' && (
        <>
          <path d="M11 5h10a2 2 0 0 1 2 2v20H7V7a2 2 0 0 1 2-2h2z" />
          <path d="M12 5V3h8v4h-8zM10 13l1.5 1.5L14 12m2 1h4m-10 6 1.5 1.5L14 17m2 1h4m-10 5 1.5 1.5L14 22m2 1h4" />
        </>
      )}
      {name === 'act' && (
        <>
          <ellipse cx="32" cy="7" rx="23" ry="4" />
          <path d="M9 8c.7 9 5.4 17.4 13.5 21.5M55 8c-.7 9-5.4 17.4-13.5 21.5" />
          <path d="M10 11c-5-2-8 1-7 6 1.4 6.3 6.5 11.6 14.4 14.2M54 11c5-2 8 1 7 6-1.4 6.3-6.5 11.6-14.4 14.2" />
          <path d="M17 13c-3 0-4 2-3 5 1.2 3.7 3.7 6.4 7.2 8.2m25.8-13.2c3 0 4 2 3 5-1.2 3.7-3.7 6.4-7.2 8.2" />
          <path d="M32 12l5 3 6-1 2 6 5 4-3 6 1 6-6 2-3 5-7-2-7 2-3-5-6-2 1-6-3-6 5-4 2-6 6 1z" />
          <circle cx="32" cy="28" r="11" />
          <path d="m26.5 28 3.8 3.8 7.5-8.2" />
          <path d="m23 41-7 15 8-3 4 7 5-17m9-2 7 15-8-3-4 7-5-17" />
          <path d="M25 44c-2 4-4 7-7 10 4 2 9 3 14 3s10-1 14-3c-3-3-5-6-7-10" />
          <path d="M18 54h28l3 5H15zM14 59h36v4H14z" />
        </>
      )}
    </svg>
  )
}

export default function RcaPdcaPage({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
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
    <main className="rca-page rca-grid-page rca-pdca-page" aria-label="Root Cause Analysis: PDCA cycle">
      <audio ref={audioRef} src={`${base}/sound/Pdca_1.wav`} preload="auto" autoPlay />
      <div className="rca-grid-scene" aria-hidden="true">
        <div className="rca-grid-glow" />
        <div className="rca-grid-lines" />
        <div className="rca-grid-sweep" />
      </div>
      <section className="rca-board rca-pdca-board" aria-labelledby="rca-pdca-title">
        <header className="rca-board-header">
          <p className="rca-board-kicker"><span /> ROOT CAUSE ANALYSIS / CONTINUOUS IMPROVEMENT</p>
          <h1 id="rca-pdca-title">PDCA CYCLE</h1>
          <span className="rca-board-rule" aria-hidden="true" />
        </header>
        <div className="rca-board-content rca-pdca-content">
          <p className={`rca-pdca-intro rca-cue${shown(CUES.intro)}`}>
            <strong>PDCA</strong> stands for Plan, Do, Check, and Act.
          </p>
          <ol className="rca-pdca-steps">
            {steps.map((step, index) => (
              <li
                className={`rca-pdca-step rca-pdca-step-${step.name.toLowerCase()} rca-cue${shown(CUES.steps[index])}`}
                key={step.name}
              >
                <span className="rca-pdca-step-index">0{index + 1}</span>
                <span className="rca-pdca-icon"><PdcaIcon name={step.icon} /></span>
                <h2>{step.name}</h2>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
          <p className={`rca-pdca-takeaway rca-cue${shown(CUES.takeaway)}`}>
            <span className="rca-pdca-takeaway-label">WHY PDCA MATTERS</span>
            Many improvement efforts fail because they skip validation and standardization. PDCA ensures that improvements are tested, proven, and sustained.
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
