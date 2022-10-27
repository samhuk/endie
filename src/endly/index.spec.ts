import { createEndie } from '.'

describe('endie', () => {
  describe('createEndie', () => {
    const fn = createEndie

    test('basic test', () => {
      expect(fn(null)).toBeDefined()
    })
  })
})
