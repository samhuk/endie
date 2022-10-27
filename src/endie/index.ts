import { createPermissions } from './permissions'
import { Permission, PermissionsNode } from './permissions/types'
import { Endie } from './types'

export const createEndie = (): Endie => null as any

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

type AppPermissions = typeof PERMISSIONS

type MockAuthService = {
  identify: () => Promise<{ user: { name: string }, mode?: 'user-session' | 'access-token' }>
  isAllowed: (
    identity: { user: { name: string }, mode?: 'user-session' | 'access-token' },
    permission: Permission
  ) => Promise<{ success: boolean }>
}

type PermissionInitPluginProps = { permission?: (p: AppPermissions) => PermissionsNode }

const authService: MockAuthService = null as any

const endie = createEndie()
  // ----------------------------
  // -- Initialization Plugins --
  // ----------------------------
  // Make endpoints state some additional options and their permissions
  .addInitPlugin({
    name: 'misc. options',
    props: null as {
      sendReturned?: boolean
      useDefaultErrorHandler?: boolean
      permission?: (p: AppPermissions) => PermissionsNode
    },
  })
  // ----------------------------
  // --  Pre-Request Plugins   --
  // ----------------------------
  // Determine which permission is being accessed
  .addPreRequestPlugin({
    name: 'permission',
    skip: o => o.props.permission == null,
    exec: o => ({ permission: o.props.permission?.(PERMISSIONS)?.$this }),
  })
  // Determine what identity is being used
  .addPreRequestPlugin({
    name: 'authentication',
    exec: async () => {
      const result = await authService.identify()
      return { identify: result }
    },
  })
  // Determine if identity can access permission
  .addPreRequestPlugin({
    name: 'authorization',
    exec: async o => {
      const result = await authService.isAllowed(o.m.identify, o.m.permission)
      return { authorization: result }
    },
  })
  // ----------------------------
  // --  Post-Request Plugins  --
  // ----------------------------
  .addPostRequestPlugin({
    name: 'send returned data + error handling',
    exec: async o => {
      if (o.error != null)
        o.res.send(o.error)
      else if (o.props.sendReturned ?? true)
        o.res.send(o.returnedData)
    },
  })

// ----------------------------
// --  Endpoints  --
// ----------------------------

type UserRecord = { name: string}

const endpoint = endie.createEndpoint<{ user: UserRecord }, {}, { user: UserRecord }>({
  permission: p => p.recipe.article.update,
  handler: o => {
    const a = 1 // some mock operation
    return o.req.body
  },
})
