import type { CSSProperties } from 'react'

/** The leopard's neon visor — a recurring brand glyph drawn from the album art. */
export function GoggleMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 240 72"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goggle-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <g stroke="url(#goggle-grad)" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M10 24 L98 18 L108 42 L22 52 Z" fill="url(#goggle-grad)" fillOpacity="0.12" />
        <path d="M230 24 L142 18 L132 42 L218 52 Z" fill="url(#goggle-grad)" fillOpacity="0.12" />
        <path d="M108 32 L132 32" strokeWidth="3" />
      </g>
      <path d="M20 28 L92 23.5" stroke="#22d3ee" strokeWidth="1.5" opacity="0.85" />
      <path d="M220 28 L148 23.5" stroke="#a855f7" strokeWidth="1.5" opacity="0.85" />
    </svg>
  )
}
