import { createEndie } from '.'
import { createPlugin } from './plugin'

const arrangeBasicEndie = (state: {
  postPluginData: any
  handlerData: any
  returnedData: any
}) => {
  const plugin1 = createPlugin()
    .setProps(null as {
      prop1: number
    })
    .setPre({
      exec: o => ({
        plugin1MetaData: { p1: o.props.prop1 },
      }),
    })
    .build()

  const plugin2 = createPlugin()
    .setProps(null as {
      prop2: boolean
    })
    .setPost({
      exec: o => ({
        plugin2MetaData: { p2: o.props.prop2 },
      }),
    })
    .build()

  const plugin3 = createPlugin()
    .setProps(null as {
      prop3: string
    })
    .setPre({
      exec: o => ({
        plugin3MetaData: { p3: o.props.prop3 },
      }),
    })
    .build()

  return createEndie()
    .addPlugin(p => p.setProps(null as {
      prop0?: boolean
    }).build())
    .addPlugin(plugin1)
    .addPlugin(plugin2)
    .addPlugin(plugin3)
    .addPlugin(p => p
      .setProps(null as {
        prop4: { foo: string }
      })
      .setPost({
        exec: o => {
          state.returnedData = o.returnedData
          return { plugin4MetaData: { p4: o.props.prop4 } }
        },
      })
      .build())
    .addPlugin({
      post: {
        exec: o => {
          // @ts-expect-error
          const b = o.m.notAProp

          state.postPluginData = {
            m: {
              plugin1MetaData: o.m.plugin1MetaData,
              plugin2MetaData: o.m.plugin2MetaData,
              plugin3MetaData: o.m.plugin3MetaData,
              plugin4MetaData: o.m.plugin4MetaData,
            },
            req: o.req,
            res: o.res,
            error: o.error,
            returnedData: o.returnedData,
            props: {
              prop0: o.props.prop0,
              prop1: o.props.prop1,
              prop2: o.props.prop2,
              prop3: o.props.prop3,
              prop4: o.props.prop4,
            },
          }
        },
      },
    })
    .lock()
}

describe('endie', () => {
  describe('createEndie', () => {
    const fn = createEndie

    test('basic test', async () => {
      let postPluginData: any
      let handlerData: any
      let returnedData: any

      const plugin1 = createPlugin()
        .setProps(null as {
          prop1: number
        })
        .setPre({
          exec: o => ({
            plugin1MetaData: { p1: o.props.prop1 },
          }),
        })
        .build()

      const plugin2 = createPlugin()
        .setProps(null as {
          prop2: boolean
        })
        .setPost({
          exec: o => ({
            plugin2MetaData: { p2: o.props.prop2 },
          }),
        })
        .build()

      const plugin3 = createPlugin()
        .setProps(null as {
          prop3: string
        })
        .setPre({
          exec: o => ({
            plugin3MetaData: { p3: o.props.prop3 },
          }),
        })
        .build()

      const endie = fn()
        .addPlugin(p => p.setProps(null as {
          prop0?: boolean
        }).build())
        .addPlugin(plugin1)
        .addPlugin(plugin2)
        .addPlugin(plugin3)
        .addPlugin(p => p
          .setProps(null as {
            prop4: { foo: string }
          })
          .setPost({
            exec: o => {
              returnedData = o.returnedData
              return { plugin4MetaData: { p4: o.props.prop4 } }
            },
          })
          .build())
        .addPlugin({
          post: {
            exec: o => {
              // @ts-expect-error
              const b = o.m.notAProp

              postPluginData = {
                m: {
                  plugin1MetaData: o.m.plugin1MetaData,
                  plugin2MetaData: o.m.plugin2MetaData,
                  plugin3MetaData: o.m.plugin3MetaData,
                  plugin4MetaData: o.m.plugin4MetaData,
                },
                req: o.req,
                res: o.res,
                error: o.error,
                returnedData: o.returnedData,
                props: {
                  prop0: o.props.prop0,
                  prop1: o.props.prop1,
                  prop2: o.props.prop2,
                  prop3: o.props.prop3,
                  prop4: o.props.prop4,
                },
              }
            },
          },
        })
        .lock()

      const endpoint = endie.create({
        prop0: true,
        prop1: 1,
        prop2: true,
        prop3: 'foo',
        prop4: { foo: 'bar' },
        handler: o => {
          handlerData = {
            m: {
              plugin1MetaData: o.m.plugin1MetaData,
              plugin3MetaData: o.m.plugin3MetaData,
            },
            req: o.req,
            res: o.res,
          }
          return handlerData
        },
      })

      await endpoint(null, null)

      const expectedMetaData = {
        plugin1MetaData: {
          p1: 1,
        },
        plugin2MetaData: {
          p2: true,
        },
        plugin3MetaData: {
          p3: 'foo',
        },
        plugin4MetaData: {
          p4: {
            foo: 'bar',
          },
        },
      }

      const expectedReturnedData: any = {
        m: {
          plugin1MetaData: {
            p1: 1,
          },
          plugin3MetaData: {
            p3: 'foo',
          },
        },
        req: null,
        res: null,
      }

      const expectedPostPluginData: any = {
        m: expectedMetaData,
        req: null,
        res: null,
        error: undefined,
        returnedData: expectedReturnedData,
        props: {
          prop0: true,
          prop1: 1,
          prop2: true,
          prop3: 'foo',
          prop4: { foo: 'bar' },
        },
      }

      expect(handlerData).toEqual(expectedReturnedData)
      expect(postPluginData).toEqual(expectedPostPluginData)
      expect(returnedData).toEqual(expectedReturnedData)
    })

    test('basic test - sync handler', async () => {
      const state: any = {
        postPluginData: null,
        handlerData: null,
        returnedData: null,
      }

      const endie = arrangeBasicEndie(state)

      const endpoint = endie.create({
        prop0: true,
        prop1: 1,
        prop2: true,
        prop3: 'foo',
        prop4: { foo: 'bar' },
        handler: o => {
          state.handlerData = {
            m: {
              plugin1MetaData: o.m.plugin1MetaData,
              plugin3MetaData: o.m.plugin3MetaData,
            },
            req: o.req,
            res: o.res,
          }
          return state.handlerData
        },
      })

      await endpoint(null, null)

      const expectedMetaData = {
        plugin1MetaData: {
          p1: 1,
        },
        plugin2MetaData: {
          p2: true,
        },
        plugin3MetaData: {
          p3: 'foo',
        },
        plugin4MetaData: {
          p4: {
            foo: 'bar',
          },
        },
      }

      const expectedReturnedData: any = {
        m: {
          plugin1MetaData: {
            p1: 1,
          },
          plugin3MetaData: {
            p3: 'foo',
          },
        },
        req: null,
        res: null,
      }

      const expectedPostPluginData: any = {
        m: expectedMetaData,
        req: null,
        res: null,
        error: undefined,
        returnedData: expectedReturnedData,
        props: {
          prop0: true,
          prop1: 1,
          prop2: true,
          prop3: 'foo',
          prop4: { foo: 'bar' },
        },
      }

      expect(state.handlerData).toEqual(expectedReturnedData)
      expect(state.postPluginData).toEqual(expectedPostPluginData)
      expect(state.returnedData).toEqual(expectedReturnedData)
    })

    test('basic test - async handler', async () => {
      const state: any = {
        postPluginData: null,
        handlerData: null,
        returnedData: null,
      }

      const endie = arrangeBasicEndie(state)

      // eslint-disable-next-line no-promise-executor-return
      const wait = (s: number) => new Promise(r => setTimeout(r, s * 1000))

      const endpoint = endie.create({
        prop0: true,
        prop1: 1,
        prop2: true,
        prop3: 'foo',
        prop4: { foo: 'bar' },
        handler: async o => {
          await wait(1)
          state.handlerData = {
            m: {
              plugin1MetaData: o.m.plugin1MetaData,
              plugin3MetaData: o.m.plugin3MetaData,
            },
            req: o.req,
            res: o.res,
          }
          return state.handlerData
        },
      })

      await endpoint(null, null)

      const expectedMetaData = {
        plugin1MetaData: {
          p1: 1,
        },
        plugin2MetaData: {
          p2: true,
        },
        plugin3MetaData: {
          p3: 'foo',
        },
        plugin4MetaData: {
          p4: {
            foo: 'bar',
          },
        },
      }

      const expectedReturnedData: any = {
        m: {
          plugin1MetaData: {
            p1: 1,
          },
          plugin3MetaData: {
            p3: 'foo',
          },
        },
        req: null,
        res: null,
      }

      const expectedPostPluginData: any = {
        m: expectedMetaData,
        req: null,
        res: null,
        error: undefined,
        returnedData: expectedReturnedData,
        props: {
          prop0: true,
          prop1: 1,
          prop2: true,
          prop3: 'foo',
          prop4: { foo: 'bar' },
        },
      }

      expect(state.handlerData).toEqual(expectedReturnedData)
      expect(state.postPluginData).toEqual(expectedPostPluginData)
      expect(state.returnedData).toEqual(expectedReturnedData)
    })

    test('basic test - handler exception handling', async () => {
      const state: any = {
        postPluginData: null,
        handlerData: null,
        returnedData: null,
      }

      const endie = arrangeBasicEndie(state)

      const endpoint = endie.create({
        prop0: true,
        prop1: 1,
        prop2: true,
        prop3: 'foo',
        prop4: { foo: 'bar' },
        handler: () => {
          throw new Error('the handler threw an error.')
        },
      })

      await endpoint(null, null)

      const expectedMetaData = {
        plugin1MetaData: {
          p1: 1,
        },
        plugin2MetaData: {
          p2: true,
        },
        plugin3MetaData: {
          p3: 'foo',
        },
        plugin4MetaData: {
          p4: {
            foo: 'bar',
          },
        },
      }

      const expectedPostPluginData: any = {
        m: expectedMetaData,
        req: null,
        res: null,
        error: new Error('the handler threw an error.'),
        returnedData: undefined,
        props: {
          prop0: true,
          prop1: 1,
          prop2: true,
          prop3: 'foo',
          prop4: { foo: 'bar' },
        },
      }

      expect(state.handlerData).toEqual(null)
      expect(state.postPluginData).toEqual(expectedPostPluginData)
      expect(state.returnedData).toEqual(undefined)
    })
  })
})
