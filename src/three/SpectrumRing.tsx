import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color } from 'three'
import { signal } from '../lib/audioSignal'
import { sampleFrequency, analyserSampleRate } from '../lib/audioReactor'
import { neonRGB01 } from '../lib/neon'

/**
 * A Specterr-style radial spectrum — the album's "rings of colored bars" — but
 * orbiting the central core in the 3D background. Mirrored left/right for
 * symmetry, log-spaced across the real content band, colored along the neon
 * gradient and lit by the scene's bloom. Reads the live FFT directly and idles
 * to nothing when no song is playing, so it only blooms in with the music.
 */
export function SpectrumRing({ lowPower }: { lowPower: boolean }) {
  const meshRef = useRef<InstancedMesh>(null)
  // bars per half-circle; mirrored → 2× instances total
  const HALF = lowPower ? 48 : 84
  const TOTAL = HALF * 2

  const freq = useMemo(() => new Uint8Array(512), [])
  const bars = useMemo(() => new Float32Array(HALF), [HALF])
  const dummy = useMemo(() => new Object3D(), [])

  // Paint the per-bar gradient once (mirrored pairs share a hue).
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const col = new Color()
    for (let i = 0; i < HALF; i++) {
      const [r, g, b] = neonRGB01(i / HALF)
      col.setRGB(r, g, b)
      mesh.setColorAt(i * 2, col)
      mesh.setColorAt(i * 2 + 1, col)
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [HALF])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    const dt = Math.min(delta, 0.05)

    const lev = signal.level
    // fully hidden until a song is actually driving the signal
    if (lev < 0.02) {
      if (mesh.visible) mesh.visible = false
      return
    }
    mesh.visible = true

    // map the FFT to log-spaced bars across the real content (~40 Hz–9 kHz)
    sampleFrequency(freq)
    const sr = analyserSampleRate()
    const n = freq.length
    const binHz = sr / 2 / n
    const loBin = Math.max(1, Math.floor(40 / binHz))
    const hiBin = Math.max(loBin + 2, Math.min(n - 1, Math.floor(9000 / binHz)))
    const ratio = hiBin / loBin
    for (let i = 0; i < HALF; i++) {
      const f0 = Math.floor(loBin * Math.pow(ratio, i / HALF))
      const f1 = Math.max(f0 + 1, Math.floor(loBin * Math.pow(ratio, (i + 1) / HALF)))
      let s = 0
      let c = 0
      for (let j = f0; j < f1 && j < n; j++) {
        s += freq[j]
        c++
      }
      const v = Math.pow(Math.min(1, (c ? s / c / 255 : 0) * (1 + (i / HALF) * 0.7)), 0.82)
      bars[i] = v > bars[i] ? v : bars[i] + (v - bars[i]) * 0.22
    }

    const energy = signal.energy
    const bass = signal.bass
    const drop = signal.drop
    const I = signal.intensity

    // slow orbit, faster on energy, whips on the drop
    mesh.rotation.z += dt * (0.05 + energy * 0.14 + drop * 0.7)
    // a gentle tilt so it reads as a 3D disc around the orb
    mesh.rotation.x = 0.18

    const R = 2.65 + bass * 0.28 + drop * 0.55
    const maxLen = lowPower ? 1.05 : 1.55
    const lenScale = 0.45 + energy * 0.8 + I * 0.5
    const barW = lowPower ? 0.05 : 0.04

    for (let i = 0; i < HALF; i++) {
      const len = (0.05 + bars[i]) * maxLen * lenScale + drop * maxLen * 0.55
      for (let s = 0; s < 2; s++) {
        const sgn = s === 0 ? 1 : -1
        const idx = i * 2 + s
        const ang = -Math.PI / 2 + sgn * ((i / HALF) * Math.PI)
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
    <instancedMesh ref={meshRef} args={[undefined, undefined, TOTAL]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.4} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  )
}
