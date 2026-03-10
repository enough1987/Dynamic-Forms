import { describe, it, expect } from 'vitest'
import { evaluateLogic } from '../evaluateLogic'

describe('evaluateLogic', () => {
  it('should return true when rule is undefined', () => {
    expect(evaluateLogic(undefined, {})).toBe(true)
  })

  it('should return true for a passing equality rule', () => {
    const rule = { '==': [{ var: 'country' }, 'fr'] }
    expect(evaluateLogic(rule, { country: 'fr' })).toBe(true)
  })

  it('should return false for a failing equality rule', () => {
    const rule = { '==': [{ var: 'country' }, 'fr'] }
    expect(evaluateLogic(rule, { country: 'de' })).toBe(false)
  })

  it('should return true for a truthy presence check (!!)', () => {
    const rule = { '!!': [{ var: 'region' }] }
    expect(evaluateLogic(rule, { region: 'europe' })).toBe(true)
  })

  it('should return false for a falsy presence check (!!)', () => {
    const rule = { '!!': [{ var: 'region' }] }
    expect(evaluateLogic(rule, { region: '' })).toBe(false)
  })

  it('should return true for a >= numeric rule', () => {
    const rule = { '>=': [{ var: 'team_size' }, 8] }
    expect(evaluateLogic(rule, { team_size: 10 })).toBe(true)
  })

  it('should return false for a failing >= numeric rule', () => {
    const rule = { '>=': [{ var: 'team_size' }, 8] }
    expect(evaluateLogic(rule, { team_size: 5 })).toBe(false)
  })

  it('should return true for a compound AND rule', () => {
    const rule = {
      and: [{ '!=': [{ var: 'lead' }, 'alice'] }, { '!=': [{ var: 'lead' }, 'bob'] }],
    }
    expect(evaluateLogic(rule, { lead: 'carol' })).toBe(true)
  })

  it('should return false for a failing compound AND rule', () => {
    const rule = {
      and: [{ '!=': [{ var: 'lead' }, 'alice'] }, { '!=': [{ var: 'lead' }, 'bob'] }],
    }
    expect(evaluateLogic(rule, { lead: 'alice' })).toBe(false)
  })

  it('should return true for an "in" array rule', () => {
    const rule = { in: [{ var: 'city' }, ['paris', 'london', 'tokyo']] }
    expect(evaluateLogic(rule, { city: 'paris' })).toBe(true)
  })

  it('should return false when value is not in array rule', () => {
    const rule = { in: [{ var: 'city' }, ['paris', 'london', 'tokyo']] }
    expect(evaluateLogic(rule, { city: 'berlin' })).toBe(false)
  })
})
