import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import { useExperience } from '../store/useExperience'
import { signal } from '../lib/audioSignal'

/**
 * Choreographs the camera along the scroll: a slow dolly toward the core that
 * rises and arcs, with a subtle pointer-driven parallax layered on top.
 */
export function CameraRig() {
  const { camera } = useThree()

  useFrame((state, delta) => {
    const { progress, pointer } = useExperience.getState()
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    // bob to the beat + punch toward the core on the drop
    const targetZ = 9 - progress * 3.4 - signal.beat * 0.32 - signal.drop * 0.9
    const targetY = 0.3 + progress * 1.7 + Math.sin(t * 0.2) * 0.08 + signal.bass * 0.06
    const targetX = Math.sin(progress * Math.PI) * 1.3

    const px = pointer.x * 0.85
    const py = -pointer.y * 0.55

    camera.position.x = MathUtils.damp(camera.position.x, targetX + px, 2.4, dt)
    camera.position.y = MathUtils.damp(camera.position.y, targetY + py, 2.4, dt)
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 2.4, dt)

    // drop kick — a sharp, decaying camera shake on impact
    const k = signal.drop
    if (k > 0.001) {
      camera.position.x += Math.sin(t * 57.3) * 0.42 * k
      camera.position.y += Math.cos(t * 61.7) * 0.32 * k
    }
    camera.lookAt(0, 0.3 + progress * 0.6, 0)

    // cinematic roll + FOV breathing (applied after lookAt)
    camera.rotation.z = Math.sin(progress * Math.PI * 2) * 0.05 + pointer.x * 0.02 + Math.sin(t * 49.1) * 0.07 * k
    const cam = camera as unknown as { fov?: number; updateProjectionMatrix?: () => void }
    if (typeof cam.fov === 'number' && cam.updateProjectionMatrix) {
      const targetFov = 50 + signal.energy * 3.5 - progress * 3
      cam.fov = MathUtils.damp(cam.fov, targetFov, 3, dt)
      cam.updateProjectionMatrix()
    }
  })

  return null
}
