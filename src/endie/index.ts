import { CreateEndpointFunction, HandlerFunction } from './endpoint/types'
import { Plugin, PluginList } from './plugin/types'
import { Endie } from './types'

const createCreateEndpointFunction = (
  pluginList: PluginList,
): CreateEndpointFunction => options => {
  const handler = options.handler as HandlerFunction
  return async (req, res) => {
    let metaData = {}

    // Iterate through plugin list, executing all plugin pres
    for (let i = 0; i < pluginList.length; i += 1) {
      const skip = pluginList[i].pre?.skip?.({
        m: metaData,
        props: options,
        req,
        res,
      }) ?? false
      if (!skip) {
        const execResult = pluginList[i].pre?.exec({
          m: metaData,
          props: options,
          req,
          res,
        })
        metaData = { ...metaData, ...execResult }
      }
    }

    // Run endpoint handler
    let error: any
    let returnedData: any
    try {
      returnedData = await handler({
        m: metaData,
        req,
        res,
      })
    }
    catch (e) {
      error = e
    }

    // Iterate through plugin list, executing all plugin posts
    for (let i = 0; i < pluginList.length; i += 1) {
      const skip = pluginList[i].post?.skip?.({
        m: metaData,
        props: options,
        req,
        res,
      }) ?? false
      if (!skip) {
        const execResult = pluginList[i].post?.exec({
          m: metaData,
          props: options,
          req,
          res,
          error,
          returnedData,
        })
        metaData = { ...metaData, ...execResult }
      }
    }
  }
}

const lock = (endie: Endie<PluginList, false>, pluginList: PluginList) => {
  delete endie.addPlugin
  delete endie.lock
  const _endie = endie as unknown as Endie<PluginList, true>
  const tmp = endie as any
  tmp.create = createCreateEndpointFunction(pluginList) as any
  return _endie
}

export const createEndie = (): Endie<[], false> => {
  let endie: Endie<[], false>
  const pluginList: PluginList = []

  return endie = {
    addPlugin: (plugin: Plugin) => {
      pluginList.push(plugin)
      return endie as any
    },
    lock: () => lock(endie as any, pluginList),
  } as any
}

// // ----------------------------
// // --     Example Usage      --
// // ----------------------------
// const PERMISSIONS = createPermissions({
//   user: {
//     get: {},
//     create: {},
//   },
//   recipe: {
//     article: {
//       get: {},
//       create: {},
//       update: {},
//     },
//   },
//   admin: {},
// })

// type MockAuthService = {
//   authenticate: (req: Request) => Promise<{ user: { name: string }, mode?: 'user-session' | 'access-token' }>
//   authorize: (
//     identity: { user: { name: string }, mode?: 'user-session' | 'access-token' },
//     permission: Permission
//   ) => Promise<{ success: boolean }>
// }

// const authService: MockAuthService = null as any

// const authPlugin = createPlugin()
//   .setProps(null as {
//     permission: (p: typeof PERMISSIONS) => PermissionsNode,
//   })
//   .setPre({
//     exec: async o => {
//       // Determine which permission is being accessed
//       const permission = o.props.permission?.(PERMISSIONS)?.$this
//       // Determine what identity is being used
//       const authenticationResult = await authService.authenticate(o.req)
//       // Determine if identity can access permission
//       const authorizationResult = await authService.authorize(authenticationResult, permission)
//       return {
//         permission,
//         authenticationResult,
//         authorizationResult,
//       }
//     },
//   })
//   .build()

// const resultHandlingPlugin = createPlugin()
//   .setProps(null as {
//     sendReturned?: boolean
//   })
//   .setPost({
//     exec: o => {
//       if (o.error != null)
//         o.res.send(o.error)
//       else if (o.props.sendReturned ?? true)
//         o.res.send(o.returnedData)
//     },
//   })
//   .build()

// const endie = createEndie()
//   .addPlugin({
//     props: null as {
//       useDefaultErrorHandler?: boolean
//     },
//   })
//   .addPlugin(authPlugin)
//   .addPlugin(resultHandlingPlugin)
//   .addPlugin({
//     pre: {
//       exec: o => {
//         // Bespoke logic could go here
//       },
//     },
//   })
//   .lock()

// type RecipeRecord = { title: string }

// const endpoint = endie.create<{ recipe: RecipeRecord }, {}, { recipe: RecipeRecord }>({
//   permission: p => p.recipe.article.update,
//   handler: o => {
//     const a = 1 // some mock operation
//     return o.req.body
//   },
// })
