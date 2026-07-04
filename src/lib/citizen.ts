import { FACTIONS, type Faction } from '../data/factions'

/** Hidden faction granted to anyone who finds the ØMEGA signal. */
export const OMEGA_FACTION: Faction = {
  name: 'ØMEGA CIRCLE',
  glow: 'ember',
  motto: 'You found the frequency beneath the noise.',
  sector: 'THE CORE',
}

// Handles that secretly grant ØMEGA clearance (the artist / album / era names).
const SECRET_HANDLES = new Set([
  'LEOPARDØ', 'LEOPARDO', 'DYSTØPIA', 'DYSTOPIA', 'WARSØNG', 'WARSONG', 'ØMEGA', 'OMEGA', 'UTØPIA', 'UTOPIA',
])

export function isSecretHandle(raw: string): boolean {
  return SECRET_HANDLES.has(raw.trim().toUpperCase())
}

/** Stable 32-bit FNV-1a hash so a handle always maps to the same citizen. */
function hashStr(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export type Citizen = {
  handle: string
  faction: Faction
  /** "Ø-48213" style registration id. */
  id: string
  clearance: string
  rank: string
}

const CLEARANCE = ['ØMEGA', 'SIGMA', 'DELTA', 'PHANTØM', 'PRIME', 'NULL']
const RANK = ['INITIATE', 'ØPERATIVE', 'VANGUARD', 'HARBINGER', 'ARCHITECT', 'REVENANT']

/** Deterministically sort a handle into a faction + registration details. */
export function citizenFromHandle(raw: string): Citizen {
  // Slice by code points (Array.from), not UTF-16 units — toUpperCase() can
  // expand length (ß→SS) and a unit-slice could split an emoji surrogate pair.
  const handle =
    Array.from(raw.trim().toUpperCase().replace(/\s+/g, ' ')).slice(0, 18).join('') || 'ANØNYMØUS'
  const h = hashStr(handle)
  if (isSecretHandle(raw)) {
    return {
      handle,
      faction: OMEGA_FACTION,
      id: 'Ø-00001',
      clearance: 'ØMEGA',
      rank: 'ARCHITECT',
    }
  }
  return {
    handle,
    faction: FACTIONS[h % FACTIONS.length],
    id: 'Ø-' + ((h % 90000) + 10000).toString(),
    clearance: CLEARANCE[(h >>> 5) % CLEARANCE.length],
    rank: RANK[(h >>> 9) % RANK.length],
  }
}
