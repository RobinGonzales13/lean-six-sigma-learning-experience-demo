import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

// Seconds into What_1.wav at which each phrase starts being spoken.
const CUES = {
  overlay: 7.6, // "This gap can impact"
  lead: 7.7,
  items: [8.4, 9.75, 12.8, 14.25], // productivity / quality / cost / customer satisfaction
  conclusion: 16.45, // "One of the most common mistakes..."
}

const impacts = [
  { text: 'Productivity', icon: 'bolt' },
  { text: 'Quality', icon: 'check' },
  { text: 'Cost', icon: 'coin' },
  { text: 'Customer satisfaction', icon: 'smile' },
] as const

function ImpactIcon({ name }: { name: (typeof impacts)[number]['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" {...common}>
      {name === 'bolt' && <path d="M13 2L4 14h7l-1 8 9-12h-7z" />}
      {name === 'check' && (
        <>
          <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />
          <path d="M8.5 12l2.5 2.5 4.5-5" />
        </>
      )}
      {name === 'coin' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M14.5 9a2.5 2 0 0 0-2.5-1.5c-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.100 2-2.500 2A2.500 2 0 0 1 9.500 15" />
          <path d="M12 6v2M12 16v2" />
        </>
      )}
      {name === 'smile' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14.500c1 1.500 2.300 2.200 4 2.200s3-.7 4-2.200" />
          <path d="M9 9.500h.01M15 9.500h.01" />
        </>
      )}
    </svg>
  )
}

export default function RcaWhatPage({ onBack }: { onBack: () => void }) {
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
    <main className="rca-page rca-ref-page rca-what-page" aria-label="Root Cause Analysis: what is a problem">
      <audio
        ref={voiceRef}
        src={`${base}/sound/What_1.wav`}
        preload="auto"
        onEnded={() => setNarrationEnded(true)}
        onError={() => setNarrationEnded(true)}
      />
      <video
        ref={videoRef}
        className="rca-video"
        src={`${base}/vid/What_Vid1.mp4`}
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
      {videoError && <p className="rca-media-error" role="alert">The video could not be loaded.</p>}
      {needsPlay && !videoError && (
        <button className="begin-button rca-play" type="button" onClick={playVideo}>
          Play
        </button>
      )}
      {time >= CUES.overlay && (
        <>
          <div className="rca-overlay" />
          <div className="rca-ref-content">
            <section className="rca-what-panel" aria-label="Impact of a gap">
              <div className={`rca-what-intro rca-cue${shown(CUES.lead)}`}>
                <p className="ile-eyebrow"><span /> ROOT CAUSE ANALYSIS / WHAT IS A PROBLEM</p>
                <h1>This gap <strong>can impact:</strong></h1>
              </div>
              <ul className="rca-what-grid" aria-label="Impacts">
                {impacts.map((item, i) => (
                  <li className={`rca-cue${shown(CUES.items[i])}`} key={item.text}>
                    <span className="rca-what-topline">
                      <span className="rca-what-icon"><ImpactIcon name={item.icon} /></span>
                      <span className="rca-what-arrow" aria-hidden="true">0{i + 1}</span>
                    </span>
                    <span className="rca-what-category">IMPACT AREA</span>
                    <span className="rca-what-title">{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className={`rca-what-note rca-cue${shown(CUES.conclusion)}`}>
                <span className="rca-what-note-tag">COMMON MISTAKE</span>
                One of the most common mistakes is jumping to solutions without clearly defining the problem.
              </p>
            </section>
          </div>
        </>
      )}
      {narrationEnded && (
        <button className="back-button rca-back rca-reveal" type="button" onClick={onBack}>
          <span aria-hidden="true">&lt;</span> Back
        </button>
      )}
    </main>
  )
}
