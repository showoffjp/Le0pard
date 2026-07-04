import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { FogExp2, PointLight } from 'three'
import { samplePalette, makePalette } from '../lib/palette'
import { useExperience } from '../store/useExperience'
import { useAudio } from '../store/useAudio'
import { signal } from '../lib/audioSignal'
import { trackScene } from '../lib/trackScene'
import { NeonGrid } from './NeonGrid'
import { DataStream } from './DataStream'
import { DropShock } from './DropShock'
import { Core } from './Core'
import { SpectrumRing } from './SpectrumRing'
import { Rings } from './Rings'
import { Shards } from './Shards'
import { Particles } from './Particles'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'

/** Lerps fog color along the scroll journey (+ the playing track's tint). */
function SceneEnv() {
  const { scene } = useThree()
  const pal = useRef(makePalette())
  useFrame(() => {
    const { progress } = useExperience.getState()
    samplePalette(progress, pal.current)
    const fog = scene.fog as FogExp2 | null
    if (fog?.color) {
      fog.color.lerp(pal.current.fog, 0.05)
      // While a track plays, the whole atmosphere leans toward its scene tint.
      const lev = signal.level
      if (lev > 0.01) fog.color.lerp(trackScene(useAudio.getState().trackIndex).fog, 0.04 * lev)
    }
  })
  return null
}

function Lights() {
  const a = useRef<PointLight>(null)
  const b = useRef<PointLight>(null)
  const pal = useRef(makePalette())
  useFrame(() => {
    const { progress } = useExperience.getState()
    samplePalette(progress, pal.current)
    const lev = signal.level
    const sc = lev > 0.01 ? trackScene(useAudio.getState().trackIndex) : null
    if (a.current) {
      a.current.color.lerp(pal.current.lightA, 0.06)
      // The key light takes on the playing track's accent — the whole scene casts.
      if (sc) a.current.color.lerp(sc.accent, 0.05 * lev)
      a.current.intensity = 1.5 + signal.beat * 1.5
    }
    if (b.current) {
      b.current.color.lerp(pal.current.lightB, 0.06)
      b.current.intensity = 1.1 + signal.energy * 0.9
    }
  })
  return (
    <>
      <ambientLight intensity={0.42} />
      <pointLight ref={a} position={[6, 4, 5]} intensity={1.7} distance={44} decay={0} color="#22d3ee" />
      <pointLight ref={b} position={[-6, -2, 3]} intensity={1.3} distance={44} decay={0} color="#6366f1" />
      <pointLight position={[0, 2.5, 2]} intensity={0.6} distance={22} decay={0} color="#7c3aed" />
    </>
  )
}

export function Scene({ lowPower }: { lowPower: boolean }) {
  return (
    <>
      <fogExp2 attach="fog" args={['#06122a', 0.04]} />
      <SceneEnv />
      <Lights />
      <CameraRig />
      <DataStream lowPower={lowPower} />
      <Core lowPower={lowPower} />
      <SpectrumRing lowPower={lowPower} />
      <DropShock lowPower={lowPower} />
      <Rings />
      <Shards lowPower={lowPower} />
      <Particles lowPower={lowPower} />
      <NeonGrid />
      <Effects lowPower={lowPower} />
    </>
  )
}
