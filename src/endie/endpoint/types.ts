import { Request, Response } from 'express'

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

export type CreateEndpointFunction<
  TMetaData extends any = any,
  TEndpointProps extends any = any,
> = <
  TRequestBody extends any = any,
  TRequestQuery extends { [k: string]: any } = { [k: string]: any },
  TResponseBody extends any = any,
>(
  options: {
    handler: HandlerFunction<TRequestBody, TRequestQuery, TResponseBody, TMetaData>
  } & TEndpointProps
) => CreateEndpointResult<
  TRequestBody,
  TRequestQuery,
  TResponseBody
>
