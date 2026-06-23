import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { Mesh, MathUtils, MeshBasicMaterial, Color, AdditiveBlending, BackSide, FrontSide } from 'three'
import { useExperience } from '../store/useExperience'
import { samplePalette, makePalette } from '../lib/palette'
import { signal } from '../lib/audioSignal'

/** Per-drop "personality" — a unique silhouette + motion seeded by dropId. */
type Mutation = {
  fx: number; fy: number; fz: number // anisotropic wobble frequencies
  ax: number; ay: number; az: number // wobble amplitudes
  spin: number // tumble direction/strength
  distort: number // extra distortion in the mutation phase
  speed: number // distortion churn speed
  tint: Color // emissive tint for this evolution
}

const TINTS = ['#22d3ee', '#7c5cff', '#a855f7', '#3b82f6', '#34d399', '#ff6a00']

function seededMutation(seed: number): Mutation {
  const r = (k: number) => {
    const x = Math.sin((seed + 1) * 127.13 + k * 53.7) * 43758.5453
    return x - Math.floor(x)
  }
  return {
    fx: 0.6 + r(1) * 2.4,
    fy: 0.6 + r(2) * 2.4,
    fz: 0.6 + r(3) * 2.4,
    ax: 0.12 + r(4) * 0.5,
    ay: 0.12 + r(5) * 0.5,
    az: 0.12 + r(6) * 0.5,
    spin: (r(7) - 0.5) * 3.2,
    distort: 0.4 + r(8) * 0.7,
    speed: 1.6 + r(9) * 4.5,
    tint: new Color(TINTS[Math.floor(r(10) * TINTS.length) % TINTS.length]),
  }
}

// Fresnel glow — bright at grazing angles, gives the blob neon volume + a rim.
const FRES_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const FRES_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  uniform float uBias;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float d = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
    float f = uBias + (1.0 - uBias) * pow(1.0 - d, uPower);
    gl_FragColor = vec4(uColor * f * uIntensity, f);
  }
`

/**
 * The album "core": a molten, distorting icosahedron wrapped in a Fresnel rim
 * glow + atmospheric corona, caged in a neon wireframe shell + orbiting rings.
 * It tracks the UTØPIA → DYSTØPIA scroll arc — and on a bass DROP it violently
 * splats (squash + flare), then peels into a unique, seeded mutation
 * (anisotropic morphing + tumbling) before re-forming. The rim color is
 * palette- and melody-driven, so the surface shimmers with the music.
 */
export function Core({ lowPower }: { lowPower: boolean }) {
  const matRef = useRef<any>(null)
  const coreRef = useRef<Mesh>(null)
  const shellRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)
  const ring2Ref = useRef<Mesh>(null)
  const pal = useRef(makePalette())

  // Fresnel uniforms (stable objects mutated each frame — no re-renders).
  const rimU = useRef({
    uColor: { value: new Color('#7c5cff') },
    uPower: { value: 2.7 },
    uIntensity: { value: 1 },
    uBias: { value: 0.05 },
  })
  const coronaU = useRef({
    uColor: { value: new Color('#22d3ee') },
    uPower: { value: 1.7 },
    uIntensity: { value: 0.4 },
    uBias: { value: 0.0 },
  })
  const rimColor = useRef(new Color('#7c5cff'))
  const coronaColor = useRef(new Color('#22d3ee'))

  const lastDropId = useRef(0)
  const splat = useRef(0)
  const mut = useRef<Mutation>(seededMutation(0))

  useFrame((state, delta) => {
    const { progress } = useExperience.getState()
    samplePalette(progress, pal.current)
    const p = pal.current
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 0.05)

    // Fire on a new drop: reseed the mutation + kick the splat impulse.
    if (signal.dropId !== lastDropId.current) {
      lastDropId.current = signal.dropId
      mut.current = seededMutation(signal.dropId)
      splat.current = 1
    }
    splat.current = MathUtils.damp(splat.current, 0, 5, dt)
    const sp = splat.current
    const imp = signal.impact // mutation-phase intensity
    const m = mut.current

    if (matRef.current) {
      // emissive flashes white-hot on the splat, then settles to the tint/palette
      matRef.current.color.lerp(p.coreColor, 0.08)
      matRef.current.emissive.lerp(p.coreEmissive, 0.06)
      if (imp > 0.01) matRef.current.emissive.lerp(m.tint, 0.04 * imp)
      matRef.current.distort = MathUtils.damp(
        matRef.current.distort ?? 0.3,
        p.distort + signal.bass * 0.12 + sp * 1.7 + imp * m.distort,
        4,
        dt,
      )
      matRef.current.speed = MathUtils.damp(matRef.current.speed ?? 1.7, 1.7 + imp * m.speed * 1.4, 3, dt)
      // Lower, form-preserving baseline so the metal catches the colored lights
      // instead of washing out to a flat emissive blob; still flares on the splat.
      matRef.current.emissiveIntensity = MathUtils.damp(
        matRef.current.emissiveIntensity ?? 1,
        0.86 + progress * 0.7 + signal.energy * 1.15 + sp * 4.6,
        5,
        dt,
      )
    }

    // ── Fresnel rim + corona: neon volume that shimmers with the music ──
    // Rim hue drifts between the palette's emissive and accent with the treble/mids,
    // giving an iridescent "living" surface; intensity rides energy + drops.
    rimColor.current.copy(p.coreEmissive).lerp(p.lightA, 0.28 + signal.treble * 0.45 + signal.mid * 0.18)
    if (imp > 0.01) rimColor.current.lerp(m.tint, 0.25 * imp)
    rimU.current.uColor.value.lerp(rimColor.current, 0.12)
    // gentle idle "breathing" so the orb feels alive even with no music playing
    const breathe = 0.13 + Math.sin(t * 0.8) * 0.13
    rimU.current.uIntensity.value = MathUtils.damp(
      rimU.current.uIntensity.value,
      0.92 + breathe + progress * 0.35 + signal.energy * 1.6 + signal.drop * 3.4 + sp * 3.5 + imp * 0.8,
      6,
      dt,
    )
    rimU.current.uPower.value = 2.7 - signal.drop * 1.1 // edge fattens on the drop

    coronaColor.current.copy(p.lightA).lerp(p.lightB, 0.4 + signal.bass * 0.35)
    coronaU.current.uColor.value.lerp(coronaColor.current, 0.1)
    coronaU.current.uIntensity.value = MathUtils.damp(
      coronaU.current.uIntensity.value,
      0.32 + breathe * 0.5 + progress * 0.18 + signal.energy * 0.55 + signal.drop * 1.4 + sp * 1.6,
      6,
      dt,
    )

    if (coreRef.current) {
      coreRef.current.rotation.y += dt * (0.12 + signal.energy * 0.5 + m.spin * imp)
      coreRef.current.rotation.x = Math.sin(t * 0.22) * 0.16 + m.spin * imp * Math.sin(t * 1.3) * 0.3
      coreRef.current.rotation.z += dt * m.spin * imp * 0.6

      const base = 1 + Math.sin(t * 1.1) * 0.02 + progress * 0.12 + signal.bass * 0.42 + signal.beat * 0.22
      // anisotropic morph during the mutation phase → a distinct shape each drop
      const ox = 1 + Math.sin(t * m.fx * 3) * m.ax * imp * 1.3
      const oy = 1 + Math.sin(t * m.fy * 3 + 2.1) * m.ay * imp * 1.3
      const oz = 1 + Math.sin(t * m.fz * 3 + 4.2) * m.az * imp * 1.3
      // splat: pancake on the Y axis, bulge out on X/Z, then spring back
      coreRef.current.scale.set(
        base * ox * (1 + 0.9 * sp),
        base * oy * (1 - 0.72 * sp),
        base * oz * (1 + 0.9 * sp),
      )
    }

    if (shellRef.current) {
      shellRef.current.rotation.y -= dt * (0.07 + imp * 0.4)
      shellRef.current.rotation.z += dt * 0.03
      shellRef.current.scale.setScalar(1 + sp * 0.3 + imp * 0.08)
      ;(shellRef.current.material as MeshBasicMaterial).color.lerp(p.lightA, 0.08)
      ;(shellRef.current.material as MeshBasicMaterial).opacity = 0.16 + sp * 0.4 + imp * 0.12
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += dt * (0.22 + sp * 1.4)
      ringRef.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.12
      ringRef.current.scale.setScalar(1 + sp * 0.18)
      ;(ringRef.current.material as MeshBasicMaterial).color.lerp(p.lightB, 0.08)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= dt * (0.16 + sp * 1.0)
      ring2Ref.current.rotation.y = Math.PI / 3 + Math.cos(t * 0.25) * 0.18
      ;(ring2Ref.current.material as MeshBasicMaterial).color.lerp(p.coreEmissive, 0.08)
    }
  })

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.7, lowPower ? 6 : 12]} />
        <MeshDistortMaterial
          ref={matRef}
          color="#0a2342"
          emissive="#2bd4ff"
          emissiveIntensity={0.7}
          roughness={0.14}
          metalness={0.9}
          distort={0.28}
          speed={1.7}
        />

        {/* Fresnel rim glow (inherits the core's squash/spin → sells the splat) */}
        <mesh scale={1.09}>
          <icosahedronGeometry args={[1.7, lowPower ? 3 : 5]} />
          <shaderMaterial
            vertexShader={FRES_VERT}
            fragmentShader={FRES_FRAG}
            uniforms={rimU.current}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            side={FrontSide}
          />
        </mesh>

        {/* Atmospheric corona — a soft outer bloom halo */}
        <mesh scale={1.28}>
          <icosahedronGeometry args={[1.7, lowPower ? 3 : 4]} />
          <shaderMaterial
            vertexShader={FRES_VERT}
            fragmentShader={FRES_FRAG}
            uniforms={coronaU.current}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            side={BackSide}
          />
        </mesh>
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
