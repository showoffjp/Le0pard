import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
} from 'three'
import { samplePalette, makePalette } from '../lib/palette'
import { useExperience } from '../store/useExperience'
import { signal } from '../lib/audioSignal'

const SPARKS = 140
const LIFETIME = 0.85 // seconds

/**
 * The shockwave: on every bass DROP, an expanding neon ring detonates out of
 * the core and a burst of sparks fans outward, then fades. Purely reactive to
 * `signal.dropId` so it fires in perfect step with the splat.
 */
export function DropShock({ lowPower }: { lowPower: boolean }) {
  const ringRef = useRef<Mesh>(null)
  const ringMat = useRef<MeshBasicMaterial>(null)
  const ring2Ref = useRef<Mesh>(null)
  const ring2Mat = useRef<MeshBasicMaterial>(null)
  const sparkRef = useRef<Points>(null)
  const sparkMat = useRef<PointsMaterial>(null)
  const pal = useRef(makePalette())

  const lastId = useRef(0)
  const life = useRef(1)

  const sparkCount = lowPower ? 70 : SPARKS
  const vel = useMemo(() => new Float32Array(sparkCount * 3), [sparkCount])
  const sparkGeo = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(new Float32Array(sparkCount * 3), 3))
    return g
  }, [sparkCount])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const { progress } = useExperience.getState()
    samplePalette(progress, pal.current)

    // Detonate on a new drop.
    if (signal.dropId !== lastId.current) {
      lastId.current = signal.dropId
      life.current = 0
      const pos = (sparkGeo.getAttribute('position') as Float32BufferAttribute).array as Float32Array
      for (let i = 0; i < sparkCount; i++) {
        const i3 = i * 3
        pos[i3] = (Math.random() - 0.5) * 0.4
        pos[i3 + 1] = (Math.random() - 0.5) * 0.4
        pos[i3 + 2] = (Math.random() - 0.5) * 0.4
        // random direction on a sphere, varied speed
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const speed = 5 + Math.random() * 9
        vel[i3] = Math.sin(phi) * Math.cos(theta) * speed
        vel[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
        vel[i3 + 2] = Math.cos(phi) * speed
      }
      ;(sparkGeo.getAttribute('position') as Float32BufferAttribute).needsUpdate = true
    }

    life.current = Math.min(1, life.current + dt / LIFETIME)
    const l = life.current
    const fade = 1 - l

    if (ringRef.current && ringMat.current) {
      ringRef.current.scale.setScalar(0.2 + l * 7)
      ringMat.current.opacity = fade * fade * 0.85
      ringMat.current.color.lerp(pal.current.lightA, 0.2)
    }
    if (ring2Ref.current && ring2Mat.current) {
      ring2Ref.current.scale.setScalar(0.2 + l * 4.4)
      ring2Mat.current.opacity = fade * 0.6
      ring2Mat.current.color.lerp(pal.current.coreEmissive, 0.2)
    }

    if (sparkRef.current && sparkMat.current) {
      const pos = (sparkGeo.getAttribute('position') as Float32BufferAttribute).array as Float32Array
      const drag = Math.exp(-3.2 * dt)
      for (let i = 0; i < sparkCount; i++) {
        const i3 = i * 3
        pos[i3] += vel[i3] * dt
        pos[i3 + 1] += vel[i3 + 1] * dt
        pos[i3 + 2] += vel[i3 + 2] * dt
        vel[i3] *= drag
        vel[i3 + 1] *= drag
        vel[i3 + 2] *= drag
      }
      ;(sparkGeo.getAttribute('position') as Float32BufferAttribute).needsUpdate = true
      sparkMat.current.opacity = fade
      sparkMat.current.size = 0.07 + fade * 0.06
      sparkMat.current.color.lerp(pal.current.lightB, 0.2)
    }
  })

  return (
    <group>
      <mesh ref={ringRef} scale={0}>
        <torusGeometry args={[1, 0.018, 10, 120]} />
        <meshBasicMaterial
          ref={ringMat}
          color="#22d3ee"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={ring2Ref} scale={0} rotation={[Math.PI / 2.6, 0.3, 0]}>
        <torusGeometry args={[1, 0.01, 10, 120]} />
        <meshBasicMaterial
          ref={ring2Mat}
          color="#a855f7"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <points ref={sparkRef} geometry={sparkGeo}>
        <pointsMaterial
          ref={sparkMat}
          size={0.08}
          sizeAttenuation
          color="#7c5cff"
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  )
}
