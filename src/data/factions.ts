export type FactionGlow = 'purple' | 'blue' | 'cyan' | 'ember'

/** The factions a visitor can be sorted into when they enter DYSTØPIA. */
export type Faction = {
  name: string
  glow: FactionGlow
  motto: string
  sector: string
}

// Eight on-brand factions — purple / blue / cyan / ember only (no pink), to match
// the album's palette. A handle is deterministically sorted into one of these.
export const FACTIONS: Faction[] = [
  { name: 'EMBER LEGIØN', glow: 'ember', motto: 'We burn to be seen.', sector: 'THE ASHWASTES' },
  { name: 'NEØN WRAITHS', glow: 'cyan', motto: 'Silent. Electric. Everywhere.', sector: 'THE GRID' },
  { name: 'VØID CHØIR', glow: 'purple', motto: 'From the silence, the drop.', sector: 'THE DEEP SPIRES' },
  { name: 'STØRM DIVISIØN', glow: 'blue', motto: 'Ride the surge.', sector: 'THE HIGH TØWERS' },
  { name: 'ØBSIDIAN ØRDER', glow: 'purple', motto: 'Hardened by the fall.', sector: 'THE UNDERCITY' },
  { name: 'WAR-DRUM CØVEN', glow: 'ember', motto: 'The beat is the law.', sector: 'THE FØRGE' },
  { name: 'PULSE SYNDICATE', glow: 'cyan', motto: 'We move with the bass.', sector: 'NEØN MARKET' },
  { name: 'ASH NØMADS', glow: 'blue', motto: 'No home but the sound.', sector: 'THE DRIFT' },
]
