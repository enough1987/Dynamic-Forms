import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateId } from '../generateId'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('generateId', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return a valid UUID string', () => {
    expect(generateId()).toMatch(UUID_REGEX)
  })

  it('should return a unique value on each call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })

  it('should use crypto.randomUUID when available', () => {
    const mockUUID = '00000000-0000-4000-8000-000000000000'
    const spy = vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockUUID)
    expect(generateId()).toBe(mockUUID)
    expect(spy).toHaveBeenCalledOnce()
  })

  it('should fall back to Math.random-based UUID when crypto.randomUUID is unavailable', () => {
    vi.spyOn(crypto, 'randomUUID').mockImplementation(
      undefined as unknown as () => `${string}-${string}-${string}-${string}-${string}`,
    )
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })
})
