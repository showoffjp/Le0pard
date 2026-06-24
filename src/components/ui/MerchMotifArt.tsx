import { dystopia } from '../../data/music'
import { GoggleMark } from './GoggleMark'
import type { MerchMotif, Glow } from '../../data/store'

// Neon "leopard" rosettes — a filled core + a ring per spot, scattered.
const LEOPARD_SPOTS: [number, number, string][] = [
  [18, 22, 'rgba(168,85,247,.6)'],
  [44, 16, 'rgba(34,211,238,.5)'],
  [72, 26, 'rgba(124,92,255,.55)'],
  [28, 50, 'rgba(34,211,238,.45)'],
  [58, 46, 'rgba(168,85,247,.55)'],
  [84, 56, 'rgba(124,92,255,.5)'],
  [16, 78, 'rgba(124,92,255,.5)'],
  [46, 82, 'rgba(168,85,247,.55)'],
  [76, 84, 'rgba(34,211,238,.45)'],
]
const LEOPARD_BG = [
  ...LEOPARD_SPOTS.map(([x, y, c]) => `radial-gradient(circle at ${x}% ${y}%, ${c} 0 6px, transparent 8px)`),
  ...LEOPARD_SPOTS.map(([x, y, c]) => `radial-gradient(circle at ${x}% ${y}%, transparent 0 10px, ${c} 10px 12px, transparent 14px)`),
].join(',')

const SKYLINE = [42, 66, 52, 82, 56, 92, 64, 100, 72, 86, 60, 76, 50, 70, 46, 62, 40, 58]
const EMBER_SPARKS: [number, number][] = [
  [20, 70], [35, 42], [50, 80], [66, 36], [80, 60], [28, 22],
  [72, 18], [45, 56], [60, 68], [15, 46], [88, 40], [40, 86],
]

/**
 * Generative "design plate" graphics for each merch motif — drawn in CSS/SVG so
 * every product has distinct, on-brand key art without needing a product photo.
 * Swap a product to a real photo any time by setting `image` on the MerchItem.
 */
export function MotifGraphic({
  motif,
  text,
  sub,
  glow,
}: {
  motif: MerchMotif
  text?: string
  sub?: string
  glow?: Glow
}) {
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

    case 'track': {
      const heat = glow === 'ember'
      return (
        <div className="px-2 text-center">
          <div
            className={`font-mono text-[0.5rem] uppercase tracking-widest3 ${heat ? 'text-neon-ember/80' : 'text-neon-cyan/70'}`}
          >
            {sub ?? 'DYSTØPIA'}
          </div>
          <div
            className={`${heat ? 'gradient-heat' : 'gradient-cool'} mt-2 font-display text-[1.7rem] font-black uppercase leading-[0.95] tracking-tight`}
            style={{
              wordBreak: 'break-word',
              filter: heat
                ? 'drop-shadow(0 0 14px rgba(255,90,0,.5))'
                : 'drop-shadow(0 0 14px rgba(124,92,255,.45))',
            }}
          >
            {text}
          </div>
          <div
            className={`mx-auto mt-2 h-px w-14 bg-gradient-to-r from-transparent to-transparent ${heat ? 'via-neon-ember' : 'via-neon-purple'}`}
          />
          <div className="mt-2 font-mono text-[0.5rem] uppercase tracking-widest3 text-slate-400">
            LEOPARDØ
          </div>
        </div>
      )
    }

    case 'tracklist':
      return (
        <div className="w-full px-2 text-center">
          <div className="font-display text-sm font-black uppercase tracking-widest2 text-white">DYSTØPIA</div>
          <ul className="mx-auto mt-2 grid max-w-[15rem] grid-cols-2 gap-x-3 gap-y-[1px] text-left">
            {dystopia.tracks.map((t) => (
              <li
                key={t.n}
                className="flex gap-1.5 font-mono text-[0.42rem] uppercase tracking-widest2 text-slate-300"
              >
                <span className="text-neon-purple/70">{String(t.n).padStart(2, '0')}</span>
                <span className="truncate">{t.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'leopard':
      return (
        <div
          className="relative h-3/4 w-3/4 overflow-hidden clip-tech"
          style={{ backgroundColor: '#0a0612', backgroundImage: LEOPARD_BG }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <span
              className="font-display text-sm font-black uppercase tracking-widest2 text-white/90"
              style={{ textShadow: '0 0 10px rgba(34,211,238,.85)' }}
            >
              LEOPARDØ
            </span>
          </div>
        </div>
      )

    case 'skyline':
      return (
        <div className="relative h-3/4 w-full overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-2/3"
            style={{ background: 'radial-gradient(120% 100% at 50% 100%, rgba(168,85,247,.4), transparent 70%)' }}
          />
          <div
            className="absolute left-1/2 top-[14%] h-12 w-12 -translate-x-1/2 rounded-full bg-gradient-to-t from-neon-ember to-neon-purple"
            style={{ filter: 'drop-shadow(0 0 18px rgba(255,106,0,.55))' }}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-[2px]">
            {SKYLINE.map((h, i) => (
              <div
                key={i}
                className="relative w-3 bg-abyss"
                style={{ height: `${h}%`, boxShadow: 'inset 0 0 0 1px rgba(124,92,255,.5)' }}
              >
                <span className="absolute left-1 top-2 h-0.5 w-0.5 bg-neon-cyan/80" />
                <span className="absolute right-1 top-4 h-0.5 w-0.5 bg-neon-cyan/55" />
              </div>
            ))}
          </div>
        </div>
      )

    case 'ember':
      return (
        <div className="relative h-3/4 w-3/4">
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(80% 90% at 50% 100%, rgba(255,106,0,.32), transparent 65%)' }}
          />
          {EMBER_SPARKS.map(([x, y], i) => {
            const big = i % 3 === 0
            const hot = i % 2 === 0
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: big ? '4px' : '2px',
                  height: big ? '4px' : '2px',
                  background: hot ? '#ff6a00' : '#a855f7',
                  boxShadow: `0 0 8px ${hot ? 'rgba(255,106,0,.9)' : 'rgba(168,85,247,.9)'}`,
                }}
              />
            )
          })}
          <div className="absolute inset-0 grid place-items-center">
            <span
              className="gradient-heat font-display text-6xl font-black"
              style={{ filter: 'drop-shadow(0 0 22px rgba(255,90,0,.55))' }}
            >
              Ø
            </span>
          </div>
        </div>
      )

    case 'crest':
      return (
        <div className="relative grid h-36 w-32 place-items-center">
          <div className="absolute inset-0 clip-tech bg-gradient-to-b from-neon-purple/45 to-neon-blue/25" />
          <div className="absolute inset-[3px] clip-tech bg-abyss" />
          <div className="relative text-center">
            <div className="font-mono text-[0.45rem] uppercase tracking-widest3 text-neon-cyan/70">EST · 2026</div>
            <div className="my-1 text-neon-ember">★</div>
            <div className="font-display text-base font-black uppercase tracking-widest2 text-white">LEOPARDØ</div>
            <div className="mx-auto mt-1 h-px w-12 bg-neon-purple/60" />
            <div className="mt-1 font-mono text-[0.45rem] uppercase tracking-widest3 text-slate-400">DYSTØPIA</div>
          </div>
        </div>
      )

    case 'vinyl':
      return (
        <div className="relative grid h-3/4 w-3/4 place-items-center">
          <div
            className="relative h-full w-full rounded-full"
            style={{
              background: 'repeating-radial-gradient(circle at 50% 50%, #0a0612 0 3px, #15101f 3px 6px)',
              boxShadow: '0 0 30px rgba(124,92,255,.4)',
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'conic-gradient(from 210deg, transparent, rgba(124,92,255,.28), transparent 42%)' }}
            />
            <div className="absolute left-1/2 top-1/2 grid h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-neon-violet to-neon-blue">
              <span className="font-display text-[0.7rem] font-black text-white">Ø</span>
            </div>
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-abyss" />
          </div>
        </div>
      )

    case 'bundle':
      return (
        <div className="relative h-3/4 w-3/4">
          <div className="absolute left-2 top-3 h-2/3 w-2/3 -rotate-6 clip-tech bg-gradient-to-br from-neon-blue/30 to-abyss ring-1 ring-white/10" />
          <div className="absolute right-2 top-1 h-2/3 w-2/3 rotate-6 clip-tech bg-gradient-to-br from-neon-cyan/25 to-abyss ring-1 ring-white/10" />
          <div className="absolute left-1/2 top-1/2 grid h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 place-items-center clip-tech bg-gradient-to-br from-neon-purple/50 to-abyss ring-1 ring-neon-purple/40">
            <span className="font-display text-xs font-black uppercase tracking-widest2 text-white">Bundle</span>
          </div>
        </div>
      )

    case 'mandala':
      return (
        <svg
          viewBox="0 0 200 200"
          className="h-3/4 w-3/4"
          style={{ filter: 'drop-shadow(0 0 14px rgba(168,85,247,.5))' }}
          aria-hidden="true"
        >
          <g fill="none" stroke="#a855f7" strokeWidth="1.3" opacity="0.85">
            <circle cx="100" cy="100" r="74" />
            <circle cx="100" cy="100" r="56" />
            <circle cx="100" cy="100" r="36" />
          </g>
          <g fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity="0.7">
            {[0, 30, 60, 90, 120, 150].map((a, i) => (
              <ellipse key={i} cx="100" cy="48" rx="13" ry="34" transform={`rotate(${a} 100 100)`} />
            ))}
          </g>
          <g stroke="#7c5cff" strokeWidth="1" opacity="0.55">
            {[0, 45, 90, 135].map((a, i) => (
              <line key={i} x1="100" y1="18" x2="100" y2="182" transform={`rotate(${a} 100 100)`} />
            ))}
          </g>
          <circle cx="100" cy="100" r="9" fill="#a855f7" />
        </svg>
      )

    case 'pulse':
      return (
        <div className="w-3/4 text-center">
          <svg
            viewBox="0 0 200 110"
            className="w-full"
            style={{ filter: 'drop-shadow(0 0 12px rgba(34,211,238,.6))' }}
            aria-hidden="true"
          >
            <polyline
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.6"
              strokeLinejoin="round"
              strokeLinecap="round"
              points="0,55 44,55 56,55 64,26 74,86 84,40 94,55 130,55 142,55 150,16 162,96 172,48 184,55 200,55"
            />
          </svg>
          <div className="mt-3 font-mono text-[0.5rem] uppercase tracking-widest3 text-neon-cyan/70">
            DYSTØPIA · LIVE SIGNAL
          </div>
        </div>
      )

    case 'eclipse':
      return (
        <div className="relative grid h-3/4 w-3/4 place-items-center">
          <div
            className="absolute h-36 w-36 rounded-full"
            style={{
              background:
                'radial-gradient(circle, transparent 52%, rgba(255,106,0,.5) 60%, rgba(168,85,247,.4) 71%, transparent 80%)',
              filter: 'drop-shadow(0 0 24px rgba(255,106,0,.5))',
            }}
          />
          <div
            className="h-24 w-24 rounded-full bg-abyss"
            style={{ boxShadow: '0 0 0 2px rgba(34,211,238,.7), 0 0 26px rgba(124,92,255,.5)' }}
          />
          <div
            className="absolute h-24 w-24 rounded-full"
            style={{ background: 'radial-gradient(circle at 32% 30%, rgba(124,92,255,.55), transparent 46%)' }}
          />
        </div>
      )

    default:
      return null
  }
}
