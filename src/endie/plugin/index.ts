import { createPermissions } from '../permissions'
import { Permission, Permissions } from '../permissions/types'
import { PluginLoader } from './types/pluginLoader'

const createPluginLoader = (): PluginLoader => {
  return null as any
}

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

type AppPermissionSelector = (p: AppPermissions) => Permissions

type MockAuthService = {
  identify: () => Promise<{ user: { name: string }, mode?: 'user-session' | 'access-token' }>
  isAllowed: (
    identity: { user: { name: string }, mode?: 'user-session' | 'access-token' },
    permission: Permission
  ) => Promise<{ success: boolean }>
}

type PermissionInitPluginProps = { permission?: AppPermissionSelector }

const authService: MockAuthService = null as any

const loader = createPluginLoader()
  // Make endpoints state their permission
  .addInitPlugin({
    name: 'permission',
    endpointProps: null as PermissionInitPluginProps,
  })
  .addInitPlugin({
    name: 'sendReturned',
    endpointProps: null as { sendReturned?: boolean },
  })
  // Determine which permission is being accessed
  .addPreRequestPlugin({
    name: 'permission',
    skip: ({ endpointProps }) => endpointProps.permission == null,
    exec: ({ endpointProps }) => ({ permission: endpointProps.permission?.(PERMISSIONS)?.$this }),
  })
  // Determine what identity is being used
  .addPreRequestPlugin({
    name: 'authentication',
    exec: async () => {
      const result = await authService.identify()
      return { identityResult: result }
    },
  })
  // Determine if identity can access permission
  .addPreRequestPlugin({
    name: 'authorization',
    exec: async ({ m }) => {
      const result = await authService.isAllowed(m.identityResult, m.permission)
      return { authorization: result }
    },
  })
