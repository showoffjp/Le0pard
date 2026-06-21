import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Edges } from '@react-three/drei'
import { Group, MathUtils, AdditiveBlending } from 'three'
import { useExperience } from '../store/useExperience'

type Shard = {
  pos: [number, number, number]
  rot: [number, number, number]
  scale: number
  color: string
  edge: string
  speed: number
}

// Deterministic pseudo-random so layout is stable between renders.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const EDGES = ['#a855f7', '#22d3ee', '#3b82f6', '#e23bff', '#ff6a00']

/**
 * Canva "Magic Layers" in 3D: holographic panels floating at varied depths
 * around the core. The whole rig parallaxes against the pointer, so depth
 * reads as you move — and the layers spread + heat up as you scroll.
 */
export function Shards({ lowPower }: { lowPower: boolean }) {
  const group = useRef<Group>(null)

  const shards = useMemo<Shard[]>(() => {
    const rand = mulberry32(20420426)
    const count = lowPower ? 9 : 16
    return Array.from({ length: count }, () => {
      const angle = rand() * Math.PI * 2
      const radius = 3.4 + rand() * 4.6
      const edge = EDGES[Math.floor(rand() * EDGES.length)]
      return {
        pos: [
          Math.cos(angle) * radius,
          (rand() - 0.5) * 6.5,
          Math.sin(angle) * radius - rand() * 4,
        ],
        rot: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
        scale: 0.5 + rand() * 1.25,
        color: edge,
        edge,
        speed: 0.6 + rand() * 1.4,
      }
    })
  }, [lowPower])

  useFrame((_, delta) => {
    if (!group.current) return
    const { pointer, progress } = useExperience.getState()
    const dt = Math.min(delta, 0.05)
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, pointer.x * 0.3, 2.5, dt)
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, pointer.y * 0.18, 2.5, dt)
    // spread outward + drift forward as the world decays
    const spread = 1 + progress * 0.22
    group.current.scale.setScalar(MathUtils.damp(group.current.scale.x, spread, 2, dt))
  })

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <Float key={i} speed={s.speed} rotationIntensity={0.5} floatIntensity={1.3} position={s.pos}>
          <group rotation={s.rot} scale={s.scale}>
            <mesh>
              <boxGeometry args={[1.15, 1.7, 0.03]} />
              <meshBasicMaterial
                color={s.color}
                transparent
                opacity={0.06}
                blending={AdditiveBlending}
                depthWrite={false}
              />
              <Edges threshold={15} color={s.edge} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  )
}
