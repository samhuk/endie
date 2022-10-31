import { createPlugin } from '.'

describe('plugin', () => {
  describe('createPlugin', () => {
    const fn = createPlugin

    test('basic test', () => {
      const plugin = fn()
        .setProps(null as {
          prop1: boolean
          prop2: number
          prop3: string
        })
        .setPre({
          exec: o => {
            // @ts-expect-error
            const a = o.m.notAProp
            const b = o.props.prop1
            const c = o.props.prop2
            const d = o.props.prop3
            // @ts-expect-error
            const e = o.props.notAProp
          },
        })
        .setPost({
          exec: o => {
            // @ts-expect-error
            const a = o.m.notAProp
            const b = o.props.prop1
            const c = o.props.prop2
            const d = o.props.prop3
            // @ts-expect-error
            const e = o.props.notAProp
          },
        })
        .build()

      expect(plugin.props).toBeDefined()
      expect(plugin.pre).toBeDefined()
      expect(plugin.post).toBeDefined()
      // @ts-expect-error
      expect(plugin.notAProp).not.toBeDefined()
    })
  })
})
