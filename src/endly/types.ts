import { PermissionsOptions } from './permissions/types'

export type EndlyOptions = {
  permissions: PermissionsOptions
}

export type Endly<TOptions extends EndlyOptions> = {
  /**
   * Create an endpoint.
   */
  create: () => {}
}
