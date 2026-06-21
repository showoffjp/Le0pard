import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { Mesh, MathUtils, MeshBasicMaterial } from 'three'
import { useExperience } from '../store/useExperience'
import { samplePalette, makePalette } from '../lib/palette'

/**
 * The album "core": a molten, distorting icosahedron caged in a neon
 * wireframe shell and an orbiting ring. Color, distortion and glow all track
 * the UTØPIA → DYSTØPIA scroll arc.
 */
export function Core({ lowPower }: { lowPower: boolean }) {
  const matRef = useRef<any>(null)
  const coreRef = useRef<Mesh>(null)
  const shellRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)
  const ring2Ref = useRef<Mesh>(null)
  const pal = useRef(makePalette())

  useFrame((state, delta) => {
    const { progress } = useExperience.getState()
    samplePalette(progress, pal.current)
    const p = pal.current
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 0.05)

    if (matRef.current) {
      matRef.current.color.lerp(p.coreColor, 0.08)
      matRef.current.emissive.lerp(p.coreEmissive, 0.08)
      matRef.current.distort = MathUtils.damp(matRef.current.distort ?? 0.3, p.distort, 3, dt)
      matRef.current.emissiveIntensity = MathUtils.damp(
        matRef.current.emissiveIntensity ?? 1,
        1.05 + progress * 1.5,
        3,
        dt,
      )
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += dt * 0.12
      coreRef.current.rotation.x = Math.sin(t * 0.22) * 0.16
      const s = 1 + Math.sin(t * 1.1) * 0.02 + progress * 0.12
      coreRef.current.scale.setScalar(s)
    }
    if (shellRef.current) {
      shellRef.current.rotation.y -= dt * 0.07
      shellRef.current.rotation.z += dt * 0.03
      ;(shellRef.current.material as MeshBasicMaterial).color.lerp(p.lightA, 0.08)
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += dt * 0.22
      ringRef.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.12
      ;(ringRef.current.material as MeshBasicMaterial).color.lerp(p.lightB, 0.08)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= dt * 0.16
      ring2Ref.current.rotation.y = Math.PI / 3 + Math.cos(t * 0.25) * 0.18
      ;(ring2Ref.current.material as MeshBasicMaterial).color.lerp(p.coreEmissive, 0.08)
    }
  })

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.7, lowPower ? 8 : 18]} />
        <MeshDistortMaterial
          ref={matRef}
          color="#0a2342"
          emissive="#2bd4ff"
          emissiveIntensity={1.05}
          roughness={0.18}
          metalness={0.85}
          distort={0.28}
          speed={1.7}
        />
      </mesh>

      <mesh ref={shellRef}>
        <icosahedronGeometry args={[2.35, 2]} />
        <meshBasicMaterial wireframe color="#22d3ee" transparent opacity={0.16} />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[3.15, 0.012, 12, 220]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.8} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[3.7, 0.008, 12, 240]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </mesh>
    </group>
  )
}
