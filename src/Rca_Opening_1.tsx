import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`
const titleText = 'Root Cause Analysis and Problem Solving'
const TYPE_DELAY_MS = 55
const VIDEO_SPEED = 1.25

export default function RcaTrainingPage({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [typed, setTyped] = useState(0)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const bgmRef = useRef<HTMLAudioElement>(null)
  const voiceRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const bgm = bgmRef.current
    const video = videoRef.current
    const voice = voiceRef.current
    if (bgm) bgm.volume = 0.04
    if (video) {
      video.defaultPlaybackRate = VIDEO_SPEED
      video.playbackRate = VIDEO_SPEED
    }
    void video?.play().catch(() => setNeedsPlay(true))

    // If music autoplay is blocked, start it silently on the first interaction.
    const startBgm = () => {
      void bgm?.play().then(() => {
        window.removeEventListener('pointerdown', startBgm)
        window.removeEventListener('keydown', startBgm)
      }).catch(() => {})
    }
    void bgm?.play().catch(() => {
      window.addEventListener('pointerdown', startBgm)
      window.addEventListener('keydown', startBgm)
    })

    return () => {
      window.removeEventListener('pointerdown', startBgm)
      window.removeEventListener('keydown', startBgm)
      bgm?.pause()
      video?.pause()
      voice?.pause()
    }
  }, [])

  // Sequence: overlay, then title frame, then typing, then buttons (see .rca-* in App.css).
  useEffect(() => {
    if (!videoEnded) return
    let interval: number | undefined
    const typingStart = window.setTimeout(() => {
      let count = 0
      interval = window.setInterval(() => {
        count += 1
        setTyped(count)
        if (count >= titleText.length) window.clearInterval(interval)
      }, TYPE_DELAY_MS)
    }, 1600)
    const buttonsTimer = window.setTimeout(
      () => setShowButtons(true),
      1600 + titleText.length * TYPE_DELAY_MS + 600,
    )
    return () => {
      window.clearTimeout(typingStart)
      window.clearTimeout(buttonsTimer)
      window.clearInterval(interval)
    }
  }, [videoEnded])

  function playManually() {
    void videoRef.current?.play()
    void bgmRef.current?.play()
    setNeedsPlay(false)
  }

  return (
    <main className="rca-page">
      <audio ref={bgmRef} src={`${base}/sound/intro_bgm.wav`} loop autoPlay />
      <audio ref={voiceRef} src={`${base}/sound/voice_intro0.wav`} preload="auto" />
      {/* Stays mounted so the paused last frame is the background after it ends. */}
      <video
        ref={videoRef}
        className="rca-video"
        src={`${base}/vid/Intro1.mp4`}
        autoPlay
        playsInline
        onPlaying={() => {
          setNeedsPlay(false)
          setVideoReady(true)
        }}
        onEnded={() => {
          setVideoEnded(true)
          void voiceRef.current?.play().catch(() => {})
        }}
        onError={() => setVideoEnded(true)}
      />
      {!videoReady && !videoEnded && !needsPlay && (
        <div className="rca-loader" role="status" aria-label="Loading">
          <div className="rca-loader-ring">
            <img src={`${import.meta.env.BASE_URL}logos/Lean6Sigma%20Logo.png`} alt="" />
          </div>
        </div>
      )}
      {needsPlay && !videoEnded && (
        <button className="begin-button rca-play" type="button" onClick={playManually}>
          Play
        </button>
      )}
      {videoEnded && (
        <>
          <div className="rca-overlay" />
          <h1 className="rca-title" aria-label={titleText}>
            <span className="rca-title-frame" aria-hidden="true">
              <img
                className="rca-title-logo"
                src={`${base}/img/intro0_logo1.png`}
                alt=""
              />
              <span className="rca-title-copy">
                <span>
                  {titleText.slice(0, typed)}
                  <i className="rca-caret" />
                </span>
                <span className="rca-title-rest">{titleText.slice(typed)}</span>
              </span>
            </span>
          </h1>
          {showButtons && (
            <>
              <button className="back-button rca-back rca-reveal" type="button" onClick={onBack}>
                <span aria-hidden="true">&lt;</span> Back
              </button>
              <div className="rca-start rca-reveal">
                <button className="begin-button" type="button" onClick={onStart}>
                  Begin Training <span aria-hidden="true">&gt;</span>
                </button>
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
