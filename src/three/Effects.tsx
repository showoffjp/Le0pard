import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { Vector2, MathUtils } from 'three'
import { useExperience } from '../store/useExperience'
import { useAudio } from '../store/useAudio'
import { signal } from '../lib/audioSignal'
import { trackScene } from '../lib/trackScene'

/**
 * Postprocessing stack. Bloom is the soul of the neon look; its intensity
 * climbs as the world decays from UTØPIA into DYSTØPIA.
 */
export function Effects({ lowPower }: { lowPower: boolean }) {
  const bloomRef = useRef<{ intensity: number } | null>(null)
  const caRef = useRef<{ offset: Vector2 } | null>(null)
  const offset = useMemo(() => new Vector2(0.0006, 0.001), [])

  useFrame((_, dt) => {
    const { progress } = useExperience.getState()
    if (bloomRef.current) {
      // bloom flares hard on the drop, climbs across the journey — with a
      // per-track lean so each song has its own glow signature
      const target =
        0.8 + progress * 0.9 + signal.beat * 0.3 + signal.energy * 0.25 + signal.drop * 1.7 + signal.impact * 0.5 +
        trackScene(useAudio.getState().trackIndex).bloom * signal.level
      bloomRef.current.intensity = MathUtils.damp(bloomRef.current.intensity, target, 8, dt)
    }
    if (caRef.current) {
      // chromatic aberration smears on the drop
      const amt = 0.0006 + signal.energy * 0.0012 + signal.drop * 0.014
      caRef.current.offset.set(amt, amt * 1.3)
    }
  })

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        ref={bloomRef as never}
        intensity={0.95}
        luminanceThreshold={0.16}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.75}
      />
      <ChromaticAberration ref={caRef as never} offset={offset} radialModulation={false} modulationOffset={0} />
      <Vignette offset={0.2} darkness={0.9} />
    </EffectComposer>
  )
}
