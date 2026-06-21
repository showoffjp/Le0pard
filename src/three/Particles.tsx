import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, Float32BufferAttribute, AdditiveBlending, PointsMaterial } from 'three'
import { useExperience } from '../store/useExperience'

function makeGeometry(count: number, spread: number, height: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * height
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return geo
}

/** Drifting stardust + rising embers. Embers ignite as the world burns. */
export function Particles({ lowPower }: { lowPower: boolean }) {
  const dustRef = useRef<Points>(null)
  const emberRef = useRef<Points>(null)
  const emberMat = useRef<PointsMaterial>(null)

  const dustCount = lowPower ? 700 : 1800
  const emberCount = lowPower ? 140 : 340

  const dustGeo = useMemo(() => makeGeometry(dustCount, 60, 36), [dustCount])
  const emberGeo = useMemo(() => makeGeometry(emberCount, 34, 22), [emberCount])

  useFrame((state, delta) => {
    const { progress } = useExperience.getState()
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.012
    }

    if (emberRef.current) {
      const arr = emberGeo.getAttribute('position') as Float32BufferAttribute
      const a = arr.array as Float32Array
      for (let i = 0; i < a.length; i += 3) {
        a[i + 1] += dt * (1.1 + (i % 7) * 0.12)
        a[i] += Math.sin(t * 0.6 + i) * dt * 0.25
        if (a[i + 1] > 11) a[i + 1] = -11
      }
      arr.needsUpdate = true
    }

    if (emberMat.current) {
      // embers fade in across the second half of the journey
      emberMat.current.opacity = Math.max(0, progress - 0.18) * 1.1
      emberMat.current.size = 0.05 + progress * 0.05
    }
  })

  return (
    <group>
      <points ref={dustRef} geometry={dustGeo}>
        <pointsMaterial
          size={0.035}
          sizeAttenuation
          color="#9fd8ff"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      <points ref={emberRef} geometry={emberGeo}>
        <pointsMaterial
          ref={emberMat}
          size={0.06}
          sizeAttenuation
          color="#ff6a00"
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  )
}
