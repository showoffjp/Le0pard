import { useEffect, useRef } from 'react'
import { useExperience } from '../../store/useExperience'

const STAGES = [
  { at: 0, label: 'UTØPIA' },
  { at: 0.4, label: 'TRANSITION' },
  { at: 0.72, label: 'DYSTØPIA' },
]

function stageFor(p: number) {
  let s = STAGES[0].label
  for (const stage of STAGES) if (p >= stage.at) s = stage.label
  return s
}

/** Fixed side HUD: live scroll progress + the current narrative "era". */
export function ScrollHud() {
  const barRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const stageRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let lastStage = ''
    const unsub = useExperience.subscribe((state) => {
      const p = state.progress
      if (barRef.current) barRef.current.style.height = `${Math.round(p * 100)}%`
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100)).padStart(2, '0')
      const stage = stageFor(p)
      if (stage !== lastStage && stageRef.current) {
        lastStage = stage
        stageRef.current.textContent = stage
      }
    })
    return unsub
  }, [])

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
      <span ref={pctRef} className="font-mono text-[0.65rem] tracking-widest2 text-neon-cyan/80">
        00
      </span>
      <div className="relative h-44 w-px overflow-hidden bg-white/10">
        <div
          ref={barRef}
          className="absolute left-0 top-0 w-full bg-gradient-to-b from-neon-cyan via-neon-blue to-neon-purple"
          style={{ height: '0%' }}
        />
      </div>
      <span
        ref={stageRef}
        className="font-display text-[0.6rem] uppercase tracking-widest2 text-slate-400 [writing-mode:vertical-rl]"
      >
        UTØPIA
      </span>
    </div>
  )
}
