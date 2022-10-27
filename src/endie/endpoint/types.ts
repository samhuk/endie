import { Request, Response } from 'express'
import { Permission, Permissions } from '../permissions/types'

export type CreateEndpointResult<
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any
> = (
  req: Request<any, TResponseBody, TRequestBody, TRequestQuery>,
  res: Response<TResponseBody>
) => void

export type HandlerFunctionOptions<
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
> = {
  req: Request<any, TResponseBody, TRequestBody, TRequestQuery>
  res: Response<TResponseBody>
  // TODO: Can we type metadata according to supplied plugins?
  m: {
    permission?: Permission
  }
}

export type HandlerFunction<
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
> = (
  options: HandlerFunctionOptions<TRequestBody, TRequestQuery, TResponseBody>
) => Promise<TResponseBody> | TResponseBody

export type CreateEndpointOptions<
  TPermissions extends Permissions = Permissions,
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
> = {
  /**
   * Assigns a specific permission to this endpoint.
   *
   * If not provided, then the endpoint will have no permission assigned to it.
   *
   * @default undefined
   */
  permission?: (p: TPermissions) => TPermissions
  /**
   * Determines whether the returned value of `handler` is sent as
   * the response of the request to this endpoint.
   *
   * @default true
   */
  sendReturned?: boolean
  /**
   * The handler of the request to this endpoint.
   */
  handler: HandlerFunction<TRequestBody, TRequestQuery, TResponseBody>
  /**
   * Determines whether the default error handler that was provided to
   * `endie` is used.
   *
   * @default true
   */
  useDefaultErrorHandler?: boolean
  /**
   * A specific error handler for this endpoint.
   *
   * @default undefined
   */
  onError?: (error: Error) => Promise<void> | void
}

export type CreateEndpointFunction<
  TPermissions extends Permissions = Permissions,
> = <
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
>(
  options: CreateEndpointOptions<
    TPermissions,
    TRequestBody,
    TRequestQuery,
    TResponseBody
  >
) => CreateEndpointResult<
  TRequestBody,
  TRequestQuery,
  TResponseBody
>
