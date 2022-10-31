import { createEndie } from '.'
import { createPlugin } from './plugin'

describe('endie', () => {
  describe('createEndie', () => {
    const fn = createEndie

    test('basic test', () => {
      const plugin1 = createPlugin()
        .setProps(null as {
          prop1: number
          prop2: boolean
          prop3: string
        })
        .setPre({
          exec: o => ({
            plugin1MetaData: { p1: o.props.prop1, p2: o.props.prop2, p3: o.props.prop3 },
          }),
        })
        .build()

      const plugin2 = createPlugin()
        .setProps(null as {
          prop1: number
          prop2: boolean
          prop3: string
        })
        .setPost({
          exec: o => ({
            plugin1MetaData: { p1: o.props.prop1, p2: o.props.prop2, p3: o.props.prop3 },
          }),
        })
        .build()

      const endie = fn()
        .addPlugin({
          props: null as {
            prop0?: boolean
          },
        })
        .addPlugin(plugin1)
        .addPlugin(plugin2)
        .addPlugin({
          pre: {
            exec: o => {
              const a = o.m.plugin1MetaData
              // @ts-expect-error
              const b = o.m.notAProp
            },
          },
        })
        .lock()
    })
  })
})
