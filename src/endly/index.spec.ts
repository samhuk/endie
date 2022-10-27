import { createEndly } from '.'

describe('endly', () => {
  describe('createEndly', () => {
    const fn = createEndly

    test('basic test', () => {
      expect(fn(null)).toBeDefined()
    })
  })
})
