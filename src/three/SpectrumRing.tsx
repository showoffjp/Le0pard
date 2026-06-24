import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color, Vector3, Euler } from 'three'
import { signal } from '../lib/audioSignal'
import { sampleFrequency, analyserSampleRate } from '../lib/audioReactor'
import { neonRGB01 } from '../lib/neon'
import { useExperience } from '../store/useExperience'
import { useAudio } from '../store/useAudio'
import { trackScene } from '../lib/trackScene'

/** One "wheel": a mirrored radial spectrum disc that spins in-plane AND precesses
 *  about its own world axis, so several of them interweave like an armillary
 *  sphere / planetary rings — wheels within wheels around the central core. */
type WheelDef = {
  R: number // base ring radius
  maxLen: number // bar reach
  tilt: [number, number, number] // initial plane orientation
  axis: [number, number, number] // world axis the plane precesses about
  precess: number // precession speed (rad/s)
  spin: number // in-plane spin speed (rad/s)
  hue: [number, number] // gradient slice this wheel is colored from
}

const WHEELS_FULL: WheelDef[] = [
  { R: 2.45, maxLen: 1.3, tilt: [0.95, 0.2, 0.0], axis: [1, 0.22, 0.12], precess: 0.11, spin: 0.22, hue: [0.0, 0.48] },
  { R: 2.95, maxLen: 1.45, tilt: [0.3, 1.0, 0.4], axis: [0.16, 1, 0.2], precess: -0.14, spin: -0.16, hue: [0.3, 0.72] },
  { R: 3.5, maxLen: 1.55, tilt: [1.3, 0.55, 0.8], axis: [0.4, 0.18, 1], precess: 0.08, spin: 0.12, hue: [0.05, 0.95] },
]
const WHEELS_LOW: WheelDef[] = [
  { R: 2.5, maxLen: 1.2, tilt: [0.95, 0.2, 0.0], axis: [1, 0.22, 0.12], precess: 0.11, spin: 0.2, hue: [0.0, 0.5] },
  { R: 3.1, maxLen: 1.35, tilt: [0.3, 1.0, 0.4], axis: [0.16, 1, 0.2], precess: -0.13, spin: -0.15, hue: [0.32, 0.9] },
]

function Wheel({ def, half }: { def: WheelDef; half: number }) {
  const meshRef = useRef<InstancedMesh>(null)
  const total = half * 2

  const freq = useMemo(() => new Uint8Array(512), [])
  const bars = useMemo(() => new Float32Array(half), [half])
  const dummy = useMemo(() => new Object3D(), [])
  const axis = useMemo(() => new Vector3(...def.axis).normalize(), [def.axis])
  const baseEuler = useMemo(() => new Euler(...def.tilt), [def.tilt])

  // Paint this wheel's gradient slice once (mirrored pairs share a hue).
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.rotation.copy(baseEuler)
    const col = new Color()
    const [lo, hi] = def.hue
    for (let i = 0; i < half; i++) {
      const [r, g, b] = neonRGB01(lo + (i / half) * (hi - lo))
      col.setRGB(r, g, b)
      mesh.setColorAt(i * 2, col)
      mesh.setColorAt(i * 2 + 1, col)
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [half, baseEuler, def.hue])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    const dt = Math.min(delta, 0.05)

    const lev = signal.level
    if (lev < 0.02) {
      if (mesh.visible) mesh.visible = false
      return
    }
    mesh.visible = true

    sampleFrequency(freq)
    const sr = analyserSampleRate()
    const n = freq.length
    const binHz = sr / 2 / n
    const loBin = Math.max(1, Math.floor(40 / binHz))
    const hiBin = Math.max(loBin + 2, Math.min(n - 1, Math.floor(9000 / binHz)))
    const ratio = hiBin / loBin
    for (let i = 0; i < half; i++) {
      const f0 = Math.floor(loBin * Math.pow(ratio, i / half))
      const f1 = Math.max(f0 + 1, Math.floor(loBin * Math.pow(ratio, (i + 1) / half)))
      let s = 0
      let c = 0
      for (let j = f0; j < f1 && j < n; j++) {
        s += freq[j]
        c++
      }
      const v = Math.pow(Math.min(1, (c ? s / c / 255 : 0) * (1 + (i / half) * 0.7)), 0.82)
      bars[i] = v > bars[i] ? v : bars[i] + (v - bars[i]) * 0.22
    }

    const energy = signal.energy
    const bass = signal.bass
    const drop = signal.drop
    const I = signal.intensity
    // per-track scene: each song tweaks the wheel tempo + radius so the gyroscope
    // reads distinct per track (faded in by playback level — `lev` from above).
    const sc = trackScene(useAudio.getState().trackIndex)

    // gyroscopic motion: precess the whole disc about its world axis, and spin
    // the bars within their own plane — together the wheels interweave. Held
    // still for reduced-motion users (the bars still react, just no spin).
    if (!useExperience.getState().reducedMotion) {
      const tempo = 1 + sc.spin * 2.4 * lev
      mesh.rotateOnWorldAxis(axis, (def.precess * tempo + energy * 0.18 + drop * 0.9) * dt)
      mesh.rotateZ((def.spin * tempo + energy * 0.1 + drop * 0.6) * dt)
    }

    const R = def.R + bass * 0.26 + drop * 0.5 + sc.warmth * 0.3 * lev
    const lenScale = 0.45 + energy * 0.8 + I * 0.5
    const barW = 0.045

    for (let i = 0; i < half; i++) {
      const len = (0.05 + bars[i]) * def.maxLen * lenScale + drop * def.maxLen * 0.55
      for (let s = 0; s < 2; s++) {
        const sgn = s === 0 ? 1 : -1
        const idx = i * 2 + s
        const ang = -Math.PI / 2 + sgn * ((i / half) * Math.PI)
        const ca = Math.cos(ang)
        const sa = Math.sin(ang)
        const rr = R + len / 2
        dummy.position.set(ca * rr, sa * rr, 0)
        dummy.rotation.set(0, 0, ang - Math.PI / 2)
        dummy.scale.set(barW, len, barW)
        dummy.updateMatrix()
        mesh.setMatrixAt(idx, dummy.matrix)
      }
    }
    mesh.instanceMatrix.needsUpdate = true

    const mat = mesh.material as { opacity: number }
    mat.opacity = Math.min(0.95, (0.3 + energy * 0.5 + drop * 0.7) * Math.min(1, lev))
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, total]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.4} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  )
}

/**
 * The album's "rings of colored bars" — now a gyroscope of nested, interwoven
 * audio-reactive spectrum wheels orbiting the central core in the 3D world.
 * Each wheel reads the live FFT (mirrored, log-spaced), spins in its own plane
 * and precesses about a different axis, and idles to nothing when no song plays.
 */
export function SpectrumRing({ lowPower }: { lowPower: boolean }) {
  const wheels = lowPower ? WHEELS_LOW : WHEELS_FULL
  const half = lowPower ? 44 : 76
  return (
    <group>
      {wheels.map((def, i) => (
        <Wheel key={i} def={def} half={half} />
      ))}
    </group>
  )
}
