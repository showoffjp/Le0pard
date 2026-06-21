import { useSmoothScroll, usePointerTracking } from './lib/useSmoothScroll'
import { useAudioClock } from './lib/useAudioClock'
import { Experience } from './three/Experience'
import { Loader } from './components/layout/Loader'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ScrollHud } from './components/layout/ScrollHud'
import { NowPlaying } from './components/layout/NowPlaying'
import { BeatPulse } from './components/effects/BeatPulse'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { AlbumShowcase } from './sections/AlbumShowcase'
import { TrackList } from './sections/TrackList'
import { Listen } from './sections/Listen'
import { VideoSection } from './sections/VideoSection'
import { Discography } from './sections/Discography'
import { About } from './sections/About'

export default function App() {
  useSmoothScroll()
  usePointerTracking()
  useAudioClock()

  return (
    <>
      <Loader />
      <Experience />
      <BeatPulse />
      <Navbar />
      <ScrollHud />
      <NowPlaying />

      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <AlbumShowcase />
        <TrackList />
        <Listen />
        <VideoSection />
        <Discography />
        <About />
      </main>

      <Footer />
    </>
  )
}
