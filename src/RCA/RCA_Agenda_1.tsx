import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

export default function RcaAgendaPage({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const voiceRef = useRef<HTMLAudioElement>(null)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [narrationEnded, setNarrationEnded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const voice = voiceRef.current
    void video?.play().catch(() => setNeedsPlay(true))

    return () => {
      video?.pause()
      voice?.pause()
    }
  }, [])

  function playVideo() {
    void videoRef.current?.play().catch(() => setNeedsPlay(true))
    setNeedsPlay(false)
  }

  return (
    <main className="rca-page">
      <audio
        ref={voiceRef}
        src={`${base}/sound/Agenda_1.wav`}
        preload="auto"
        onEnded={() => setNarrationEnded(true)}
        onError={() => setNarrationEnded(true)}
      />
      <video
        ref={videoRef}
        className="rca-video"
        src={`${base}/vid/Agenda_Vid1.mp4`}
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
      {videoError && <p className="rca-media-error" role="alert">The agenda video could not be loaded.</p>}
      {needsPlay && !videoError && (
        <button className="begin-button rca-play" type="button" onClick={playVideo}>
          Play
        </button>
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
