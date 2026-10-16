import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`
const VIDEO_SPEED = 0.75
const OVERLAY_DELAY_MS = 4000
const NEXT_DELAY_MS = 2600

export default function RcaProblemPage({ onNext }: { onNext?: () => void }) {
  const [videoReady, setVideoReady] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [needsPlay, setNeedsPlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const voiceRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const voice = voiceRef.current
    if (video) {
      video.defaultPlaybackRate = VIDEO_SPEED
      video.playbackRate = VIDEO_SPEED
    }
    void video?.play().catch(() => setNeedsPlay(true))
    void voice?.play().catch(() => setNeedsPlay(true))
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
    void voiceRef.current?.play()
    setNeedsPlay(false)
  }

  return (
    <main className="rca-page">
      <audio ref={voiceRef} src={`${base}/sound/voice_intro1.wav`} autoPlay />
      <video
        ref={videoRef}
        className="rca-video"
        src={`${base}/vid/Opening_Vid1.mp4`}
        autoPlay
        playsInline
        onPlaying={() => {
          setNeedsPlay(false)
          setVideoReady(true)
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
          <h1 className="rca-problem-title">
            <span className="rca-problem-line">This is often because issues are addressed at the surface level,</span>{' '}
            <strong className="rca-problem-line rca-problem-strong">not at the root.</strong>
          </h1>
          {showNext && (
            <button className="next-button rca-next rca-reveal" type="button" onClick={onNext}>
              Next <span aria-hidden="true">&gt;</span>
            </button>
          )}
        </>
      )}
    </main>
  )
}
