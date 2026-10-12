import WireframeIntro, { type NarrationAudio } from './WireframeIntro'
import './App.css'

const defaultNarration: NarrationAudio = {
  name: 'Intro_1.wav',
  url: `${import.meta.env.BASE_URL}audio/Intro_1.wav`,
}

function App() {
  return <WireframeIntro narration={defaultNarration} />
}

export default App
