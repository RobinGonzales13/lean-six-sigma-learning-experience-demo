import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

// Seconds into Reflection_1.wav at which each phrase starts being spoken.
const CUES = {
  overlay: 4.4, // "Choose one that"
  lead: 4.5,
  items: [6.25, 8.3, 11.45], // happens repeatedly / affects performance... / has not been fully resolved
  conclusion: 13.7, // "This will allow you to apply..."
}

const criteria = [
  { text: 'Happens repeatedly', icon: 'repeat' },
  { text: 'Affects performance, quality, or output', icon: 'chart' },
  { text: 'Has not been fully resolved', icon: 'open' },
] as const

function CriteriaIcon({ name }: { name: (typeof criteria)[number]['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" {...common}>
      {name === 'repeat' && (
        <>
          <path d="M17 2l4 4-4 4" />
          <path d="M3 11V9a3 3 0 0 1 3-3h15" />
          <path d="M7 22l-4-4 4-4" />
          <path d="M21 13v2a3 3 0 0 1-3 3H3" />
        </>
      )}
      {name === 'chart' && (
        <>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-5 3 3 5-7" />
        </>
      )}
      {name === 'open' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}
    </svg>
  )
}

export default function RcaReflectionPage({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const voiceRef = useRef<HTMLAudioElement>(null)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [time, setTime] = useState(0)
  const [narrationEnded, setNarrationEnded] = useState(false)
  const shown = (cue: number) => (time >= cue ? ' is-shown' : '')

  useEffect(() => {
    const video = videoRef.current
    const voice = voiceRef.current
    void video?.play().catch(() => setNeedsPlay(true))

    // Text is revealed from the narration clock so it appears as each phrase is spoken.
    let frame = 0
    const tick = () => {
      if (voice) setTime(voice.currentTime)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      video?.pause()
      voice?.pause()
    }
  }, [])

  function playVideo() {
    void videoRef.current?.play().catch(() => setNeedsPlay(true))
    setNeedsPlay(false)
  }

  return (
    <main className="rca-page rca-ref-page" aria-label="Root Cause Analysis reflection">
      <audio
        ref={voiceRef}
        src={`${base}/sound/Reflection_1.wav`}
        preload="auto"
        onEnded={() => setNarrationEnded(true)}
        onError={() => setNarrationEnded(true)}
      />
      <video
        ref={videoRef}
        className="rca-video"
        src={`${base}/vid/Reflection_Vid1.mp4`}
        autoPlay
        playsInline
        onPlaying={() => {
          setNeedsPlay(false)
          setVideoReady(true)
          // Narration starts only once the video is actually playing so they stay in sync.
          const voice = voiceRef.current
          if (voice && voice.paused && voice.currentTime === 0) void voice.play().catch(() => {})
        }}
        onError={() => {
          setNeedsPlay(false)
          setVideoError(true)
          setNarrationEnded(true)
        }}
      />
      {!videoReady && !needsPlay && !videoError && (
        <div className="rca-loader" role="status" aria-label="Loading">
          <div className="rca-loader-ring">
            <img src={`${import.meta.env.BASE_URL}logos/Lean6Sigma%20Logo.png`} alt="" />
          </div>
        </div>
      )}
      {videoError && <p className="rca-media-error" role="alert">The reflection video could not be loaded.</p>}
      {needsPlay && !videoError && (
        <button className="begin-button rca-play" type="button" onClick={playVideo}>
          Play
        </button>
      )}
      {time >= CUES.overlay && (
        <>
          <div className="rca-overlay" />
          <div className="rca-ref-content">
            <section className="rca-ref-panel" aria-label="Reflection">
              <p className={`rca-ref-kicker rca-cue${shown(CUES.lead)}`}><span /> ROOT CAUSE ANALYSIS / REFLECTION</p>
              <h1 className={`rca-ref-lead rca-cue${shown(CUES.lead)}`}>Choose one that:</h1>
              <span className={`rca-ref-rule rca-cue${shown(CUES.lead)}`} aria-hidden="true" />
              <ul className="rca-ref-list" aria-label="Problem criteria">
                {criteria.map((item, i) => (
                  <li className={`rca-cue${shown(CUES.items[i])}`} key={item.text}>
                    <span className="rca-ref-card-top">
                      <span className="rca-ref-icon"><CriteriaIcon name={item.icon} /></span>
                      <span className="rca-ref-num" aria-hidden="true">0{i + 1}</span>
                    </span>
                    <span className="rca-ref-card-text">{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className={`rca-ref-conclusion rca-cue${shown(CUES.conclusion)}`}>
                This will allow you to apply the concepts in a practical and meaningful way.
              </p>
            </section>
          </div>
        </>
      )}
      {narrationEnded && (
        <>
          <button className="back-button rca-back rca-reveal" type="button" onClick={onBack}>
            <span aria-hidden="true">&lt;</span> Back
          </button>
          <button className="next-button rca-next rca-reveal" type="button" onClick={onNext}>
            Next <span aria-hidden="true">&gt;</span>
          </button>
        </>
      )}
    </main>
  )
}
