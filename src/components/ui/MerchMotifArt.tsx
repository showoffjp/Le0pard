import { dystopia } from '../../data/music'
import { GoggleMark } from './GoggleMark'
import type { MerchMotif } from '../../data/store'

/**
 * Generative "design plate" graphics for each merch motif — drawn in CSS/SVG so
 * every product has distinct, on-brand key art without needing a product photo.
 * Swap a product to a real photo any time by setting `image` on the MerchItem.
 */
export function MotifGraphic({ motif }: { motif: MerchMotif }) {
  switch (motif) {
    case 'cover':
      return (
        <img
          src={dystopia.coverSmall}
          alt=""
          loading="lazy"
          className="h-3/4 w-3/4 object-cover clip-tech shadow-[0_0_40px_rgba(124,58,237,.45)]"
        />
      )

    case 'wordmark':
      return (
        <div className="text-center">
          <div className="font-display text-2xl font-black uppercase tracking-widest2 text-white sm:text-3xl">
            LEOPARD<span className="text-neon-purple neon-purple">Ø</span>
          </div>
          <div className="mt-2 font-mono text-[0.55rem] uppercase tracking-widest3 text-neon-cyan/70">
            Symphonic Trap
          </div>
        </div>
      )

    case 'goggle':
      return (
        <GoggleMark className="w-3/4" style={{ filter: 'drop-shadow(0 0 18px rgba(34,211,238,.6))' }} />
      )

    case 'flame':
      return (
        <div className="text-center">
          <div
            className="gradient-heat font-display text-[5rem] font-black leading-none"
            style={{ filter: 'drop-shadow(0 0 26px rgba(255,90,0,.55))' }}
          >
            Ø
          </div>
          <div className="mt-1 font-display text-xs uppercase tracking-widest2 text-slate-300">
            DYSTØPIA
          </div>
        </div>
      )

    case 'octagon':
      return (
        <div className="relative grid h-32 w-32 place-items-center">
          <div className="absolute inset-0 clip-tech bg-gradient-to-br from-neon-purple/80 via-neon-blue/70 to-neon-cyan/60 p-[1.5px]">
            <div className="clip-tech h-full w-full bg-abyss" />
          </div>
          <span className="relative font-display text-[0.6rem] font-bold uppercase tracking-widest2 text-white">
            LEOPARDØ
          </span>
        </div>
      )

    case 'grid':
      return (
        <div className="relative h-full w-full overflow-hidden">
          <div
            className="absolute left-1/2 top-[22%] h-24 w-24 -translate-x-1/2 rounded-full bg-gradient-to-t from-neon-ember via-neon-purple to-neon-cyan"
            style={{ filter: 'drop-shadow(0 0 30px rgba(168,85,247,.7))' }}
          />
          <div
            className="absolute left-1/2 top-[22%] h-24 w-24 -translate-x-1/2 rounded-full"
            style={{
              background:
                'repeating-linear-gradient(to bottom, transparent 0 9px, rgba(4,5,10,.9) 9px 12px)',
            }}
          />
          <div
            className="absolute left-0 right-0 top-1/2 h-px bg-neon-cyan/70"
            style={{ boxShadow: '0 0 12px rgba(34,211,238,.8)' }}
          />
          <div
            className="absolute inset-x-0 bottom-0 top-1/2"
            style={{
              backgroundImage:
                'linear-gradient(rgba(124,92,255,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,.55) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              transform: 'perspective(160px) rotateX(64deg)',
              transformOrigin: 'top center',
            }}
          />
        </div>
      )

    case 'waveform': {
      const heights = [28, 52, 38, 70, 46, 86, 58, 96, 64, 88, 50, 74, 40, 60, 34, 54]
      return (
        <div className="flex h-2/3 w-full items-end justify-center gap-[3px]">
          {heights.map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-sm bg-gradient-to-t from-neon-blue via-neon-violet to-neon-cyan"
              style={{ height: `${h}%`, boxShadow: '0 0 8px rgba(124,92,255,.5)' }}
            />
          ))}
        </div>
      )
    }

    case 'orbit':
      return (
        <svg
          viewBox="0 0 200 200"
          className="h-3/4 w-3/4"
          style={{ filter: 'drop-shadow(0 0 16px rgba(124,92,255,.6))' }}
          aria-hidden="true"
        >
          <g fill="none" strokeWidth="2.2">
            <ellipse cx="100" cy="100" rx="88" ry="34" stroke="#22d3ee" opacity="0.85" transform="rotate(18 100 100)" />
            <ellipse cx="100" cy="100" rx="80" ry="30" stroke="#7c5cff" opacity="0.85" transform="rotate(-34 100 100)" />
            <ellipse cx="100" cy="100" rx="64" ry="64" stroke="#a855f7" opacity="0.55" />
            <ellipse cx="100" cy="100" rx="50" ry="20" stroke="#3b82f6" opacity="0.85" transform="rotate(66 100 100)" />
          </g>
          <circle cx="100" cy="100" r="15" fill="#a855f7" />
          <circle cx="100" cy="100" r="15" fill="#fff" opacity="0.18" />
        </svg>
      )

    case 'circuit':
      return (
        <svg
          viewBox="0 0 200 200"
          className="h-3/4 w-3/4"
          style={{ filter: 'drop-shadow(0 0 12px rgba(34,211,238,.5))' }}
          aria-hidden="true"
        >
          <g stroke="#22d3ee" strokeWidth="1.6" fill="none" opacity="0.85">
            <path d="M18 42 H78 V92 H116" />
            <path d="M182 58 H140 V122 H92" />
            <path d="M28 152 H72 V112" />
            <path d="M172 158 H112 V128" />
            <path d="M100 18 V58" />
          </g>
          <g fill="#a855f7">
            {[[78, 42], [116, 92], [140, 58], [92, 122], [72, 152], [112, 158], [100, 18]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" />
            ))}
          </g>
          <rect x="83" y="83" width="34" height="34" rx="5" fill="#04050a" stroke="#7c5cff" strokeWidth="2.5" />
          <text x="100" y="106" textAnchor="middle" fontSize="13" fill="#fff" fontFamily="monospace">
            LØ
          </text>
        </svg>
      )

    case 'glitch':
      return (
        <div className="relative text-center">
          <div className="relative font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            <span className="absolute inset-0 text-neon-cyan" style={{ transform: 'translate(-3px,1.5px)', opacity: 0.8 }}>
              DYSTØPIA
            </span>
            <span className="absolute inset-0 text-neon-ember" style={{ transform: 'translate(3px,-1.5px)', opacity: 0.75 }}>
              DYSTØPIA
            </span>
            <span className="relative text-white">DYSTØPIA</span>
          </div>
          <div className="mt-3 font-mono text-[0.5rem] uppercase tracking-widest3 text-neon-purple/90">
            SYSTEM FAILURE // 0xLØ
          </div>
        </div>
      )

    case 'monogram':
      return (
        <div className="relative grid h-36 w-36 place-items-center">
          <div className="absolute inset-0 clip-tech bg-gradient-to-br from-neon-purple/40 via-neon-blue/25 to-transparent" />
          <div className="absolute inset-[3px] clip-tech bg-abyss" />
          <span
            className="relative gradient-cool font-display text-6xl font-black tracking-tighter"
            style={{ filter: 'drop-shadow(0 0 18px rgba(124,92,255,.6))' }}
          >
            LØ
          </span>
        </div>
      )

    case 'barcode': {
      const widths = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3]
      return (
        <div className="w-3/4 text-center">
          <div className="flex h-24 items-stretch justify-center gap-[2px]">
            {widths.map((w, i) => (
              <div key={i} style={{ width: `${w * 2}px` }} className="bg-gradient-to-b from-white to-neon-cyan/80" />
            ))}
          </div>
          <div className="mt-2.5 font-mono text-[0.55rem] uppercase tracking-widest3 text-slate-300">
            LEOPARDØ · DYSTØPIA
          </div>
        </div>
      )
    }

    case 'duality':
      return (
        <div className="relative h-full w-full overflow-hidden clip-tech">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,.28), rgba(59,130,246,.16) 50%, transparent 50%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(168,85,247,.16) 50%, rgba(255,106,0,.3))',
            }}
          />
          <div className="absolute inset-0 grid grid-rows-2">
            <div className="flex items-end justify-center pb-1.5">
              <span className="gradient-cool font-display text-lg font-black tracking-widest2 sm:text-xl">UTØPIA</span>
            </div>
            <div className="flex items-start justify-center pt-1.5">
              <span className="gradient-heat font-display text-lg font-black tracking-widest2 sm:text-xl">DYSTØPIA</span>
            </div>
          </div>
          <div className="absolute left-[-10%] right-[-10%] top-1/2 h-px -translate-y-1/2 -rotate-[26deg] bg-white/40" />
        </div>
      )

    default:
      return null
  }
}
