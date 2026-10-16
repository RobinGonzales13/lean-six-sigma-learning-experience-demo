import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`
const titleText = 'Root Cause Analysis and Problem Solving'
const TYPE_DELAY_MS = 55

export default function RcaTrainingPage({ onBack }: { onBack: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [typed, setTyped] = useState(0)
  const [started, setStarted] = useState(false)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const bgmRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const bgm = bgmRef.current
    const video = videoRef.current
    if (bgm) bgm.volume = 0.04
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
      {/* Preloaded but hidden until the video ends, so it never shows before playback. */}
      <img
        className="rca-image"
        src={`${base}/img/Intro1.png`}
        alt=""
        style={{ visibility: videoEnded ? 'visible' : 'hidden' }}
      />
      {!videoEnded && (
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
          onEnded={() => setVideoEnded(true)}
          onError={() => setVideoEnded(true)}
        />
      )}
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
              <span>
                {titleText.slice(0, typed)}
                <i className="rca-caret" />
              </span>
              <span className="rca-title-rest">{titleText.slice(typed)}</span>
            </span>
          </h1>
          {showButtons && (
            <>
              <button className="back-button rca-back rca-reveal" type="button" onClick={onBack}>
                <span aria-hidden="true">&lt;</span> Back
              </button>
              {!started && (
                <div className="rca-start rca-reveal">
                  <button className="begin-button" type="button" onClick={() => setStarted(true)}>
                    Start <span aria-hidden="true">&gt;</span>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>
  )
}
