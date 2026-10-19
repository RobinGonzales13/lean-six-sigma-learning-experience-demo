import { useEffect, useRef, useState } from 'react'

const base = `${import.meta.env.BASE_URL}RCA_page`

export default function RcaAgendaPage({ onBack }: { onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    void video?.play()
      .then(() => setNeedsPlay(false))
      .catch(() => setNeedsPlay(true))

    return () => video?.pause()
  }, [])

  function playVideo() {
    void videoRef.current?.play()
      .then(() => setNeedsPlay(false))
      .catch(() => setNeedsPlay(true))
  }

  return (
    <main className="rca-page">
      <video
        ref={videoRef}
        className="rca-video"
        src={`${base}/vid/Agenda_Vid1.mp4`}
        autoPlay
        playsInline
        onPlaying={() => setNeedsPlay(false)}
        onError={() => {
          setNeedsPlay(false)
          setVideoError(true)
        }}
      />
      {videoError && <p className="rca-media-error" role="alert">The agenda video could not be loaded.</p>}
      {needsPlay && !videoError && (
        <button className="begin-button rca-play" type="button" onClick={playVideo}>
          Play
        </button>
      )}
      <button className="back-button rca-back" type="button" onClick={onBack}>
        <span aria-hidden="true">&lt;</span> Back
      </button>
    </main>
  )
}
