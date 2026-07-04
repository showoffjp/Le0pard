import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import { Color, type Mesh, type ShaderMaterial } from 'three'
import { signal } from '../lib/audioSignal'
import { useAudio } from '../store/useAudio'
import { trackScene } from '../lib/trackScene'

const BASE_SECTION = new Color('#7c3aed')

/**
 * The synthwave horizon — a neon grid floor (and a faint mirrored ceiling)
 * that gives the world its sense of depth and forward motion. While a track
 * plays, the floor's section lines breathe toward that track's scene color.
 */
export function NeonGrid() {
  const floor = useRef<Mesh>(null)

  useFrame(() => {
    const mat = floor.current?.material as ShaderMaterial | undefined
    const u = mat?.uniforms?.sectionColor?.value as Color | undefined
    if (!u || typeof u.lerp !== 'function') return
    const lev = signal.level
    u.lerp(lev > 0.01 ? trackScene(useAudio.getState().trackIndex).grid : BASE_SECTION, 0.04)
  })

  return (
    <group>
      <Grid
        ref={floor as never}
        position={[0, -2.8, 0]}
        args={[80, 80]}
        cellSize={0.7}
        cellThickness={0.55}
        cellColor="#1b2a6b"
        sectionSize={3.5}
        sectionThickness={1.2}
        sectionColor="#7c3aed"
        fadeDistance={46}
        fadeStrength={1.6}
        infiniteGrid
        followCamera={false}
      />
      <Grid
        position={[0, 7.5, 0]}
        args={[80, 80]}
        cellSize={1.4}
        cellThickness={0.4}
        cellColor="#15204e"
        sectionSize={7}
        sectionThickness={0.8}
        sectionColor="#1e3a8a"
        fadeDistance={40}
        fadeStrength={2}
        infiniteGrid
        followCamera={false}
      />
    </group>
  )
}
