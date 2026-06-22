import { Grid } from '@react-three/drei'

/**
 * The synthwave horizon — a neon grid floor (and a faint mirrored ceiling)
 * that gives the world its sense of depth and forward motion.
 */
export function NeonGrid() {
  return (
    <group>
      <Grid
        position={[0, -2.8, 0]}
        args={[80, 80]}
        cellSize={0.7}
        cellThickness={0.55}
        cellColor="#1b2a6b"
        sectionSize={3.5}
        sectionThickness={1.2}
        sectionColor="#7c3aed"
        fadeDistance={46}
        fadeStrength={1.6}
        infiniteGrid
        followCamera={false}
      />
      <Grid
        position={[0, 7.5, 0]}
        args={[80, 80]}
        cellSize={1.4}
        cellThickness={0.4}
        cellColor="#15204e"
        sectionSize={7}
        sectionThickness={0.8}
        sectionColor="#1e3a8a"
        fadeDistance={40}
        fadeStrength={2}
        infiniteGrid
        followCamera={false}
      />
    </group>
  )
}
