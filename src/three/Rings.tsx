import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { signal } from '../lib/audioSignal'

type RingDef = {
  r: number
  tube: number
  color: string
  opacity: number
  rot: [number, number, number]
}

const RINGS: RingDef[] = [
  { r: 6.4, tube: 0.012, color: '#3b82f6', opacity: 0.4, rot: [Math.PI / 2.2, 0, 0] },
  { r: 8, tube: 0.009, color: '#7c5cff', opacity: 0.32, rot: [Math.PI / 3, Math.PI / 4, 0] },
  { r: 9.6, tube: 0.007, color: '#22d3ee', opacity: 0.22, rot: [Math.PI / 2.6, -Math.PI / 5, 0] },
]

/** Large, slow holographic rings that frame the whole scene with grandeur. */
export function Rings() {
  const g = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!g.current) return
    const dt = Math.min(delta, 0.05)
    g.current.rotation.y += dt * (0.04 + signal.energy * 0.16)
    g.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.12
    const s = 1 + signal.bass * 0.05
    g.current.scale.setScalar(s)
  })

  return (
    <group ref={g}>
      {RINGS.map((r, i) => (
        <mesh key={i} rotation={r.rot}>
          <torusGeometry args={[r.r, r.tube, 10, 180]} />
          <meshBasicMaterial color={r.color} transparent opacity={r.opacity} />
        </mesh>
      ))}
    </group>
  )
}
