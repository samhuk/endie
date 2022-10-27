import { Request, Response } from 'express'

export enum PluginStage {
  INIT,
  PRE_REQ,
  POST_REQ,
}

type PluginBase = {
  name: string
}

export type InitPlugin = PluginBase & {
  endpointProps?: { [TPropName in string]: any },
  val?: any
}

type PreRequestPluginExecFunctionOptions<
  TMetaData extends any = any,
  TEndpointProps extends any = any,
> = {
  m: TMetaData
  endpointProps: TEndpointProps
  req: Request
  res: Response
}

type PreRequestPluginExecFunction<
  TMetaData extends any = any,
  TEndpointProps extends any = any,
> = (
  options: PreRequestPluginExecFunctionOptions<TMetaData, TEndpointProps>
) => Promise<any> | any

type SkipFunction<
  TMetaData extends any = any,
  TEndpointProps extends any = any,
> = (
  options: PreRequestPluginExecFunctionOptions<TMetaData, TEndpointProps>
) => Promise<boolean> | boolean

export type PreRequestPlugin<
  TMetaData extends any = any,
  TEndpointProps extends any = any,
> = PluginBase & {
  skip?: SkipFunction<TMetaData, TEndpointProps>
  exec: PreRequestPluginExecFunction<TMetaData, TEndpointProps>
}

type PostRequestPluginExecFunctionOptions<
  TMetaData extends any = any,
  TEndpointProps extends any = any,
> = {
  m: TMetaData
  endpointProps: TEndpointProps
  req: Request
  res: Response
  returnedData?: any
  error?: any
}

type PostRequestPluginExecFunction<
  TMetaData extends any = any,
  TEndpointProps extends any = any,
> = (
  options: PostRequestPluginExecFunctionOptions<TMetaData, TEndpointProps>
) => Promise<any> | any

export type PostRequestPlugin<
  TMetaData extends any = any,
  TEndpointProps extends any = any,
> = PluginBase & {
  skip?: SkipFunction<TMetaData, TEndpointProps>
  exec: PostRequestPluginExecFunction
}

export type InitPluginList = Readonly<InitPlugin[]>
export type PreRequestPluginList = Readonly<PreRequestPlugin[]>
export type PostRequestPluginList = Readonly<PostRequestPlugin[]>
