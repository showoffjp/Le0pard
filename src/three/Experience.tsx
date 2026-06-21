import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useExperience } from '../store/useExperience'
import { Scene } from './Scene'

/**
 * The fixed, full-viewport 3D world that lives behind all page content. The
 * DOM scrolls over it while the scene reacts to scroll + pointer.
 */
export function Experience() {
  const lowPower = useExperience((s) => s.lowPower)

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, lowPower ? 1.3 : 1.8]}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        camera={{ position: [0, 0.5, 9], fov: 50, near: 0.1, far: 140 }}
      >
        <Suspense fallback={null}>
          <Scene lowPower={lowPower} />
        </Suspense>
      </Canvas>

      {/* grounding overlays for legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_0%,transparent_28%,rgba(4,5,10,0.5)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-void via-void/50 to-transparent" />
    </div>
  )
}
