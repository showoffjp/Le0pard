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
import { BeatPulse } from './components/effects/BeatPulse'
import { DropFlash } from './components/effects/DropFlash'
import { SeamDivider } from './components/ui/SeamDivider'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Descent } from './sections/Descent'
import { AlbumShowcase } from './sections/AlbumShowcase'
import { TrackList } from './sections/TrackList'
import { Listen } from './sections/Listen'
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
        <AlbumShowcase />
        <TrackList />
        <Listen />
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
