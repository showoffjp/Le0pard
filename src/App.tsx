import { useSmoothScroll, usePointerTracking } from './lib/useSmoothScroll'
import { useAudioClock } from './lib/useAudioClock'
import { useSignalVars } from './lib/useSignalVars'
import { Experience } from './three/Experience'
import { Loader } from './components/layout/Loader'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ScrollHud } from './components/layout/ScrollHud'
import { NowPlaying } from './components/layout/NowPlaying'
import { NeonCursor } from './components/layout/NeonCursor'
import { AudioEngine } from './components/AudioEngine'
import { BeatPulse } from './components/effects/BeatPulse'
import { BackgroundVisualizer } from './components/effects/BackgroundVisualizer'
import { DropFlash } from './components/effects/DropFlash'
import { SeamDivider } from './components/ui/SeamDivider'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Descent } from './sections/Descent'
import { Album } from './sections/Album'
import { VideoSection } from './sections/VideoSection'
import { Discography } from './sections/Discography'
import { Store } from './sections/Store'
import { Posts } from './sections/Posts'
import { About } from './sections/About'

export default function App() {
  useSmoothScroll()
  usePointerTracking()
  useAudioClock()
  useSignalVars()

  return (
    <>
      <Loader />
      <Experience />
      <AudioEngine />
      <BackgroundVisualizer />
      <div className="react-bg" aria-hidden="true" />
      <BeatPulse />
      <DropFlash />
      <NeonCursor />
      <Navbar />
      <ScrollHud />
      <NowPlaying />

      <main id="experience-content" className="relative z-10">
        <Hero />
        <Manifesto />
        <Descent />
        <Album />
        <SeamDivider label="Visuals" />
        <VideoSection />
        <Discography />
        <SeamDivider label="Store" />
        <Store />
        <SeamDivider label="Dispatch" />
        <Posts />
        <SeamDivider label="The Artist" />
        <About />
      </main>

      <Footer />
    </>
  )
}
