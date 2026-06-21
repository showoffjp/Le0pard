import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { FogExp2, PointLight } from 'three'
import { samplePalette, makePalette } from '../lib/palette'
import { useExperience } from '../store/useExperience'
import { NeonGrid } from './NeonGrid'
import { Core } from './Core'
import { Shards } from './Shards'
import { Particles } from './Particles'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'

/** Lerps fog color along the scroll journey. */
function SceneEnv() {
  const { scene } = useThree()
  const pal = useRef(makePalette())
  useFrame(() => {
    const { progress } = useExperience.getState()
    samplePalette(progress, pal.current)
    const fog = scene.fog as FogExp2 | null
    if (fog?.color) fog.color.lerp(pal.current.fog, 0.05)
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
    a.current?.color.lerp(pal.current.lightA, 0.06)
    b.current?.color.lerp(pal.current.lightB, 0.06)
  })
  return (
    <>
      <ambientLight intensity={0.42} />
      <pointLight ref={a} position={[6, 4, 5]} intensity={1.7} distance={44} decay={0} color="#22d3ee" />
      <pointLight ref={b} position={[-6, -2, 3]} intensity={1.3} distance={44} decay={0} color="#6366f1" />
      <pointLight position={[0, 2.5, 2]} intensity={0.6} distance={22} decay={0} color="#e23bff" />
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
      <Core lowPower={lowPower} />
      <Shards lowPower={lowPower} />
      <Particles lowPower={lowPower} />
      <NeonGrid />
      <Effects lowPower={lowPower} />
    </>
  )
}
