import { PermissionsOptions, RootPermissions } from './types'

export const createPermissions = <
  TPermissionsOptions extends PermissionsOptions
>(
    p: TPermissionsOptions,
  ): RootPermissions<TPermissionsOptions> => {
  return null as any // TODO
}
