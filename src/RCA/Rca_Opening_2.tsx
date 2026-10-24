import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`
const OVERLAY_DELAY_MS = 4000
const NEXT_DELAY_MS = 2600
const headerStart = 'This is often because issues are addressed at the surface level,'
const headerStrong = 'not at the root.'

export default function RcaProblemPage({ onBack, onNext }: { onBack: () => void; onNext?: () => void }) {
  const [videoReady, setVideoReady] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [needsPlay, setNeedsPlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const voiceRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const voice = voiceRef.current
    void video?.play().catch(() => setNeedsPlay(true))
    return () => {
      video?.pause()
      voice?.pause()
    }
  }, [])

  // The 4 second delay starts when the video actually begins playing.
  useEffect(() => {
    if (!videoReady) return
    const overlayTimer = window.setTimeout(() => setShowOverlay(true), OVERLAY_DELAY_MS)
    return () => window.clearTimeout(overlayTimer)
  }, [videoReady])

  useEffect(() => {
    if (!showOverlay) return
    const nextTimer = window.setTimeout(() => setShowNext(true), NEXT_DELAY_MS)
    return () => window.clearTimeout(nextTimer)
  }, [showOverlay])

  function playManually() {
    void videoRef.current?.play()
    setNeedsPlay(false)
  }

  return (
    <main className="rca-page">
      <audio ref={voiceRef} src={`${base}/sound/voice_intro1.wav`} preload="auto" />
      <video
        ref={videoRef}
        className="rca-video"
        src={`${base}/vid/Opening_Vid1.mp4`}
        autoPlay
        playsInline
        onPlaying={() => {
          setNeedsPlay(false)
          setVideoReady(true)
          // Voice starts only once the video is actually playing so they stay in sync.
          const voice = voiceRef.current
          if (voice && voice.paused && voice.currentTime === 0) void voice.play().catch(() => {})
        }}
        onError={() => setVideoReady(true)}
      />
      {!videoReady && !needsPlay && (
        <div className="rca-loader" role="status" aria-label="Loading">
          <div className="rca-loader-ring">
            <img src={`${import.meta.env.BASE_URL}logos/Lean6Sigma%20Logo.png`} alt="" />
          </div>
        </div>
      )}
      {needsPlay && (
        <button className="begin-button rca-play" type="button" onClick={playManually}>
          Play
        </button>
      )}
      {showOverlay && (
        <>
          <div className="rca-overlay" />
          <h1 className="rca-problem-title" aria-label={`${headerStart} ${headerStrong}`}>
            <span className="rca-problem-words">
            {headerStart.split(' ').map((word, i) => (
              <span
                className="rca-problem-word"
                aria-hidden="true"
                key={i}
                style={{ animationDelay: `${300 + i * 70}ms` }}
              >
                {word}{' '}
              </span>
            ))}
            {headerStrong.split(' ').map((word, i) => (
              <strong
                className="rca-problem-word rca-problem-strong"
                aria-hidden="true"
                key={i}
                style={{ animationDelay: `${300 + (headerStart.split(' ').length + i) * 70 + 300}ms` }}
              >
                {word}{' '}
              </strong>
            ))}
            </span>
          </h1>
          {showNext && (
            <>
              <button className="back-button rca-back rca-reveal" type="button" onClick={onBack}>
                <span aria-hidden="true">&lt;</span> Back
              </button>
              <button className="next-button rca-next rca-reveal" type="button" onClick={onNext}>
                Next <span aria-hidden="true">&gt;</span>
              </button>
            </>
          )}
        </>
      )}
    </main>
  )
}
