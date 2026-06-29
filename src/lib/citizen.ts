import { FACTIONS, type Faction } from '../data/factions'

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
  const handle = (raw.trim().toUpperCase().replace(/\s+/g, ' ').slice(0, 18) || 'ANØNYMØUS')
  const h = hashStr(handle)
  return {
    handle,
    faction: FACTIONS[h % FACTIONS.length],
    id: 'Ø-' + ((h % 90000) + 10000).toString(),
    clearance: CLEARANCE[(h >>> 5) % CLEARANCE.length],
    rank: RANK[(h >>> 9) % RANK.length],
  }
}
