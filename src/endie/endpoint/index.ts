import { Permission, Permissions } from '../permissions/types'
import { CreateEndpointOptions, CreateEndpointResult } from './types'

export const createEndpoint = <
  TPermissions extends Permissions = Permissions,
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
>(
    permissions: TPermissions,
    defaultErrorHandler: (error: Error) => Promise<void> | void,
    options: CreateEndpointOptions<
      TPermissions,
      TRequestBody,
      TRequestQuery,
      TResponseBody
    >,
  ): CreateEndpointResult<
  TRequestBody,
  TRequestQuery,
  TResponseBody
> => {
  let permission: Permission
  if (options.permission != null) {
    permission = options.permission(permissions)?.$this
    if (permission == null)
      throw new Error('Permission selector did not return a permission for the endpoint.')
  }

  const sendReturned = options.sendReturned ?? true
  const useDefaultErrorHandler = options.useDefaultErrorHandler ?? true

  return async (req, res) => {
    try {
      // TODO: Plugin execution here?
      const returnedData = await options.handler({
        req,
        res,
        m: {
          permission,
        },
      })
      if (sendReturned)
        res.send(returnedData)
    }
    catch (e: any) {
      if (useDefaultErrorHandler && defaultErrorHandler != null)
        await defaultErrorHandler(e)
      if (options.onError != null)
        await options.onError(e)
    }
  }
}
