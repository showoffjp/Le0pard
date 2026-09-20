import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class strings with a single space', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('drops false / null / undefined / empty values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('returns an empty string when nothing is truthy', () => {
    expect(cn(false, null, undefined)).toBe('')
  })
})
