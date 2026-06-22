import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { Vector2, MathUtils } from 'three'
import { useExperience } from '../store/useExperience'
import { signal } from '../lib/audioSignal'

/**
 * Postprocessing stack. Bloom is the soul of the neon look; its intensity
 * climbs as the world decays from UTØPIA into DYSTØPIA.
 */
export function Effects({ lowPower }: { lowPower: boolean }) {
  const bloomRef = useRef<{ intensity: number } | null>(null)
  const offset = useMemo(() => new Vector2(0.0006, 0.001), [])

  useFrame((_, dt) => {
    const { progress } = useExperience.getState()
    if (bloomRef.current) {
      const target = 0.95 + progress * 1.0 + signal.beat * 0.6 + signal.energy * 0.4
      bloomRef.current.intensity = MathUtils.damp(bloomRef.current.intensity, target, 6, dt)
    }
  })

  return (
    <EffectComposer enableNormalPass={false} multisampling={lowPower ? 0 : 4}>
      <Bloom
        ref={bloomRef as never}
        intensity={0.95}
        luminanceThreshold={0.16}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.8}
      />
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
      <Vignette offset={0.2} darkness={0.92} />
      <Noise premultiply opacity={lowPower ? 0 : 0.04} />
    </EffectComposer>
  )
}
