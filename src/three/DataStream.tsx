import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three'
import { makePalette, samplePalette } from '../lib/palette'
import { useExperience } from '../store/useExperience'
import { signal } from '../lib/audioSignal'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * A flowing "datastream" curtain far behind the core — columns of falling code
 * tinted by the UTØPIA→DYSTØPIA palette and pulsed by the audio signal. Adds
 * depth + a cyber backdrop without touching the foreground composition.
 */
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uEnergy;
  uniform float uProgress;
  uniform vec3  uColorA;
  uniform vec3  uColorB;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;

    // Falling columns of data
    float cols = 64.0;
    float col = floor(uv.x * cols);
    float seed = hash(vec2(col, 7.0));
    float speed = 0.25 + seed * 1.4;
    float y = fract(uv.y * 1.4 + uTime * speed * 0.12 + seed);

    // Bright head with a trailing tail
    float streak = pow(y, 7.0);

    // Per-cell glyph flicker
    float cell = floor(uv.y * 46.0);
    float flick = step(0.45, hash(vec2(col, cell + floor(uTime * (1.5 + seed * 5.0)))));
    float intensity = streak * flick;

    // Column separation so it reads as data, not a wash
    float gutter = smoothstep(0.0, 0.06, abs(fract(uv.x * cols) - 0.5));
    intensity *= 0.55 + 0.45 * gutter;

    // Melt the curtain into the dark at every edge
    float edge = smoothstep(0.0, 0.28, uv.x) * smoothstep(1.0, 0.72, uv.x)
               * smoothstep(0.0, 0.22, uv.y) * smoothstep(1.0, 0.82, uv.y);
    intensity *= edge;

    // Audio + scroll drive overall brightness
    intensity *= 0.32 + uEnergy * 0.95 + uProgress * 0.45;

    vec3 color = mix(uColorA, uColorB, clamp(uv.y + sin(uTime * 0.2) * 0.12, 0.0, 1.0));
    gl_FragColor = vec4(color * intensity, intensity);
  }
`

export function DataStream({ lowPower }: { lowPower: boolean }) {
  const matRef = useRef<ShaderMaterial>(null)
  const pal = useRef(makePalette())
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uProgress: { value: 0 },
      uColorA: { value: new Color('#22d3ee') },
      uColorB: { value: new Color('#a855f7') },
    }),
    [],
  )

  useFrame((state) => {
    const { progress } = useExperience.getState()
    samplePalette(progress, pal.current)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uEnergy.value = signal.energy * 0.7 + signal.beat * 0.5
    uniforms.uProgress.value = progress
    uniforms.uColorA.value.lerp(pal.current.lightA, 0.05)
    uniforms.uColorB.value.lerp(pal.current.coreEmissive, 0.05)
  })

  return (
    <mesh position={[0, 0, -9]} renderOrder={-2} frustumCulled={false}>
      <planeGeometry args={[46, 26, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={AdditiveBlending}
        side={DoubleSide}
        opacity={lowPower ? 0.6 : 1}
      />
    </mesh>
  )
}
