import { useEffect, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'

export type NarrationAudio = {
  name: string
  url: string
}

type WireframeIntroProps = {
  narration: NarrationAudio
}

type NarrationPlayerProps = {
  narration: NarrationAudio
  audioRef: RefObject<HTMLAudioElement | null>
  onAutoplayBlocked: (blocked: boolean) => void
}

function NarrationPlayer({ narration, audioRef, onAutoplayBlocked }: NarrationPlayerProps) {
  const narrationUrl = narration.url

  useEffect(() => {
    const player = audioRef.current
    if (!player) return
    void player.play()
      .then(() => onAutoplayBlocked(false))
      .catch(() => onAutoplayBlocked(true))
  }, [audioRef, narrationUrl, onAutoplayBlocked])

  return (
    <div className="narration-controls">
      <span className="narration-file-name" title={narration.name}>{narration.name}</span>
      <audio
        ref={audioRef}
        controls
        autoPlay
        preload="auto"
        src={narrationUrl}
        aria-label="Intro narration"
        onPlay={() => onAutoplayBlocked(false)}
      />
    </div>
  )
}

function CorridorScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#030609')
    scene.fog = new THREE.FogExp2('#030609', 0.006)

    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 260)
    camera.position.set(0, 0, 24)
    camera.lookAt(0, 0, -48)

    const corridor = new THREE.Group()
    const width = 28
    const height = 15
    const near = 52
    const far = -220
    const gridPoints: number[] = []
    const accentPoints: number[] = []

    function addLine(target: number[], x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
      target.push(x1, y1, z1, x2, y2, z2)
    }

    for (let x = -width; x <= width; x += 4) {
      addLine(gridPoints, x, -height, near, x, -height, far)
      addLine(gridPoints, x, height, near, x, height, far)
    }

    for (let y = -height; y <= height; y += 3) {
      addLine(gridPoints, -width, y, near, -width, y, far)
      addLine(gridPoints, width, y, near, width, y, far)
    }

    for (let z = 48; z >= far; z -= 4) {
      addLine(gridPoints, -width, -height, z, width, -height, z)
      addLine(gridPoints, -width, height, z, width, height, z)
      addLine(gridPoints, -width, -height, z, -width, height, z)
      addLine(gridPoints, width, -height, z, width, height, z)
    }

    for (const z of [-20, -52, -84, -116]) {
      addLine(accentPoints, -width, -height, z, width, -height, z)
      addLine(accentPoints, -width, height, z, width, height, z)
      addLine(accentPoints, -width, -height, z, -width, height, z)
      addLine(accentPoints, width, -height, z, width, height, z)
    }

    const gridGeometry = new THREE.BufferGeometry()
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3))
    const gridMaterial = new THREE.LineBasicMaterial({
      color: '#bac4cc',
      transparent: true,
      opacity: 0.38,
    })
    corridor.add(new THREE.LineSegments(gridGeometry, gridMaterial))

    const accentGeometry = new THREE.BufferGeometry()
    accentGeometry.setAttribute('position', new THREE.Float32BufferAttribute(accentPoints, 3))
    const accentMaterial = new THREE.LineBasicMaterial({
      color: '#388cff',
      transparent: true,
      opacity: 0.62,
    })
    corridor.add(new THREE.LineSegments(accentGeometry, accentMaterial))
    scene.add(corridor)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor('#030609', 1)

    function resize() {
      const clientWidth = canvas?.clientWidth ?? 0
      const clientHeight = canvas?.clientHeight ?? 0
      if (!clientWidth || !clientHeight) return
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }

    let frame = 0
    const startTime = performance.now()

    function render(now: number) {
      const elapsed = (now - startTime) / 1000
      corridor.position.z = -((elapsed * 6) % 4)
      camera.position.x = Math.sin(elapsed * 0.22) * 0.32
      camera.lookAt(0, 0, -48)
      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(render)
    }

    resize()
    frame = window.requestAnimationFrame(render)
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      gridGeometry.dispose()
      accentGeometry.dispose()
      gridMaterial.dispose()
      accentMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas className="intro-canvas" ref={canvasRef} aria-hidden="true" />
}

export default function WireframeIntro({ narration }: WireframeIntroProps) {
  const narrationRef = useRef<HTMLAudioElement>(null)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)

  function handleBeginTraining() {
    const player = narrationRef.current
    if (!player) return
    void player.play()
      .then(() => setAutoplayBlocked(false))
      .catch(() => setAutoplayBlocked(true))
  }

  return (
    <main className="wireframe-intro">
      <div className="fallback-grid" aria-hidden="true" />
      <CorridorScene />
      <div className="intro-vignette" aria-hidden="true" />

      <div className="intro-content">
        <div className="intro-hero">
          <section className="intro-copy-block" aria-labelledby="intro-title">
            <h1 id="intro-title" className="intro-title">
              <span>Lean Six Sigma</span>
              <span>White Belt</span>
              <span>Training</span>
            </h1>
          </section>

          <img
            className="sigma-emblem"
            src={`${import.meta.env.BASE_URL}logos/Lean6Sigma%20Logo.png`}
            alt="Lean6Sigma Logo"
          />
        </div>

        <div className="intro-controls">
          <button className="begin-button" type="button" onClick={handleBeginTraining}>
            {autoplayBlocked ? 'Start narration' : 'Begin training'} <span aria-hidden="true">&gt;</span>
          </button>
          <NarrationPlayer
            narration={narration}
            audioRef={narrationRef}
            onAutoplayBlocked={setAutoplayBlocked}
          />
        </div>
      </div>
    </main>
  )
}