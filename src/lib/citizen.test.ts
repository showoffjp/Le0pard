import { describe, it, expect } from 'vitest'
import { citizenFromHandle, isSecretHandle, OMEGA_FACTION } from './citizen'
import { FACTIONS } from '../data/factions'

describe('isSecretHandle', () => {
  it('matches the secret handles case- and whitespace-insensitively', () => {
    expect(isSecretHandle('leopardø')).toBe(true)
    expect(isSecretHandle('  DYSTOPIA ')).toBe(true)
    expect(isSecretHandle('WARSØNG')).toBe(true)
    expect(isSecretHandle('omega')).toBe(true)
  })

  it('rejects ordinary and empty handles', () => {
    expect(isSecretHandle('random_fan')).toBe(false)
    expect(isSecretHandle('')).toBe(false)
  })
})

describe('citizenFromHandle', () => {
  it('is deterministic — the same handle always maps to the same citizen', () => {
    expect(citizenFromHandle('nebula')).toEqual(citizenFromHandle('nebula'))
  })

  it('grants ØMEGA clearance for a secret handle, in any casing', () => {
    const c = citizenFromHandle(' dystopia ')
    expect(c.faction).toBe(OMEGA_FACTION)
    expect(c.id).toBe('Ø-00001')
    expect(c.clearance).toBe('ØMEGA')
    expect(c.rank).toBe('ARCHITECT')
  })

  it('sorts an ordinary handle into a real faction with a well-formed id', () => {
    const c = citizenFromHandle('starchaser')
    expect(FACTIONS).toContain(c.faction)
    expect(c.faction).not.toBe(OMEGA_FACTION)
    expect(c.id).toMatch(/^Ø-\d{5}$/) // Ø-10000 .. Ø-99999
  })

  it('falls back to ANØNYMØUS for an empty / whitespace-only handle', () => {
    expect(citizenFromHandle('   ').handle).toBe('ANØNYMØUS')
  })

  it('uppercases, collapses whitespace, and truncates to 18 code points', () => {
    const c = citizenFromHandle('  the  quick brown fox jumps  ')
    expect(c.handle).toBe('THE QUICK BROWN FO')
    expect(Array.from(c.handle).length).toBe(18)
  })
})
