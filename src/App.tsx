import { lazy, Suspense } from 'react'
import { useSmoothScroll, usePointerTracking } from './lib/useSmoothScroll'
import { useAudioClock } from './lib/useAudioClock'
import { useSignalVars } from './lib/useSignalVars'
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

// The 3D world (three.js + postprocessing) is the heaviest bundle — load it in
// its own chunk so the page becomes interactive before it arrives. The Loader
// covers the boot, and the page background is dark void until the canvas mounts.
const Experience = lazy(() =>
  import('./three/Experience').then((m) => ({ default: m.Experience })),
)

export default function App() {
  useSmoothScroll()
  usePointerTracking()
  useAudioClock()
  useSignalVars()

  return (
    <>
      <a
        href="#experience-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-neon-violet focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan"
      >
        Skip to content
      </a>
      <Loader />
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
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
