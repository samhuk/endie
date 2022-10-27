import { PermissionsOptions } from './permissions/types'

export type EndieOptions = {
  permissions: PermissionsOptions
}

export type Endie<TOptions extends EndieOptions> = {
  /**
   * Create an endpoint.
   */
  create: () => {}
}
