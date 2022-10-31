import { Request, Response } from 'express'

export type CreateEndpointResult<
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any
> = (
  req: Request<any, TResponseBody, TRequestBody, TRequestQuery>,
  res: Response<TResponseBody>
) => Promise<void>

export type HandlerFunctionOptions<
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
  TMetaData extends any = any,
> = {
  req: Request<any, TResponseBody, TRequestBody, TRequestQuery>
  res: Response<TResponseBody>
  m: TMetaData
}

export type HandlerFunction<
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
  TMetaData extends any = any,
> = (
  options: HandlerFunctionOptions<TRequestBody, TRequestQuery, TResponseBody, TMetaData>
) => Promise<TResponseBody> | TResponseBody

export type CreateEndpointFunctionOptions<
  TProps extends any = any,
  TMetaData extends any = any,
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
> = {
  handler: HandlerFunction<TRequestBody, TRequestQuery, TResponseBody, TMetaData>
} & TProps

export type CreateEndpointFunction<
  TProps extends any = any,
  TMetaData extends any = any,
> = <
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
>(
  options: CreateEndpointFunctionOptions<TProps, TMetaData, TRequestBody, TRequestQuery, TResponseBody>
) => CreateEndpointResult<
  TRequestBody,
  TRequestQuery,
  TResponseBody
>
