import { Request } from 'express'
import { createPermissions } from './permissions'
import { Permission, PermissionsNode } from './permissions/types'
import { createPlugin } from './plugin'
import { Endie } from './types'

export const createEndie = (): Endie<[], false> => null as any

// ----------------------------
// --     Example Usage      --
// ----------------------------
const PERMISSIONS = createPermissions({
  user: {
    get: {},
    create: {},
  },
  recipe: {
    article: {
      get: {},
      create: {},
      update: {},
    },
  },
  admin: {},
})

type MockAuthService = {
  authenticate: (req: Request) => Promise<{ user: { name: string }, mode?: 'user-session' | 'access-token' }>
  authorize: (
    identity: { user: { name: string }, mode?: 'user-session' | 'access-token' },
    permission: Permission
  ) => Promise<{ success: boolean }>
}

const authService: MockAuthService = null as any

const authPlugin = createPlugin('auth')
  .setProps(null as {
    permission: (p: typeof PERMISSIONS) => PermissionsNode,
  })
  .setPre({
    exec: async o => {
      // Determine which permission is being accessed
      const permission = o.props.permission?.(PERMISSIONS)?.$this
      // Determine what identity is being used
      const authenticationResult = await authService.authenticate(o.req)
      // Determine if identity can access permission
      const authorizationResult = await authService.authorize(authenticationResult, permission)
      return {
        permission,
        authenticationResult,
        authorizationResult,
      }
    },
  })
  .setPost({
    exec: o => ({
      testing: 123,
    }),
  })
  .build()

const resultHandlingPlugin = createPlugin('resultHandling')
  .setProps(null as {
    sendReturned?: boolean
  })
  .setPost({
    exec: o => {
      if (o.error != null)
        o.res.send(o.error)
      else if (o.props.sendReturned ?? true)
        o.res.send(o.returnedData)
    },
  })
  .build()

const endie = createEndie()
  // ----------------------------
  // -- Initialization Plugins --
  // ----------------------------
  // Make endpoints state some options like their permission, etc.
  .addPlugin({
    props: null as {
      useDefaultErrorHandler?: boolean
    },
  })
  .addPlugin(authPlugin)
  .addPlugin(resultHandlingPlugin)
  .addPlugin({
    pre: {
      exec: o => {
        // Bespoke logic could go here
      },
    },
  })
  .lock()

// ----------------------------
// --  Endpoints  --
// ----------------------------

type UserRecord = { name: string}

const endpoint = endie.create<{ user: UserRecord }, {}, { user: UserRecord }>({
  permission: p => p.recipe.article.update,
  handler: o => {
    const a = 1 // some mock operation
    return o.req.body
  },
})
