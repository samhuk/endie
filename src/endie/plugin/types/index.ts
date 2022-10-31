import { IsTrueAndFalse } from '@samhuk/type-helpers/dist/type-helpers/types'
import { Request, Response } from 'express'

export type PreRequestPluginExecFunction<
  TMetaData extends any = any,
  TProps extends any = any,
> = (
  options: {
    m: TMetaData
    props: TProps
    req: Request
    res: Response
  }
) => Promise<any> | any

type SkipFunction<
  TMetaData extends any = any,
  TProps extends any = any,
> = (
  options: {
    m: TMetaData
    props: TProps
    req: Request
    res: Response
  }
) => Promise<boolean> | boolean

export type PostRequestPluginExecFunction<
  TMetaData extends any = any,
  TProps extends any = any,
> = (
  options: {
    m: TMetaData
    props: TProps
    req: Request
    res: Response
    returnedData?: any
    error?: any
  }
) => Promise<any> | any

export type PluginPre<
  TProps extends any = any,
  TPreMetaData extends any = any,
> = {
  /**
   * Function that determines whether to skip the execution of the
   * pre-request logic.
   */
  skip?: SkipFunction<TPreMetaData, TProps>
  /**
   * Function to run on the request, response, and/or the built-up metadata.
   */
  exec: PreRequestPluginExecFunction<TPreMetaData, TProps>
}

export type PluginPost<
  TProps extends any = any,
  TPostMetaData extends any = any,
> = {
  /**
   * Function that determines whether to skip the execution of the
   * post-request logic.
   */
  skip?: SkipFunction<TPostMetaData, TProps>
  /**
   * Function to run on the request, response, and/or the built-up metadata.
   */
  exec: PostRequestPluginExecFunction<TPostMetaData, TProps>
}

type IncludeIfTrue<TBool extends boolean, ObjToInclude> = IsTrueAndFalse<TBool> extends true
  ? ObjToInclude
  : (TBool extends true ? ObjToInclude : {})

type IncludeIfFalse<TBool extends boolean, ObjToInclude> = IsTrueAndFalse<TBool> extends true
  ? ObjToInclude
  : (TBool extends false ? ObjToInclude : {})

export type Plugin<
  TPreceedingProps extends any = any,
  TPreceedingPreMetaData extends any = any,
  TPreceedingPostMetaData extends any = any,

  TProps extends any = any,
  TPluginPre extends PluginPre<TPreceedingProps, TPreceedingPreMetaData> = PluginPre<TPreceedingProps, TPreceedingPreMetaData>,
  TPluginPost extends PluginPost<TPreceedingProps, TPreceedingPostMetaData> = PluginPost<TPreceedingProps, TPreceedingPostMetaData>,
> = {
  /**
   * What properties each endpoint can or must define.
   */
  props?: TProps
  /**
   * Defines logic before the endpoint handler is called.
   */
  pre?: TPluginPre
  /**
   * Defines logic after the endpoint handler is called.
   */
  post?: TPluginPost
}

export type PluginCreator<
  TPreceedingProps extends any = any,
  TPreceedingPreMetaData extends any = any,
  TPreceedingPostMetaData extends any = any,

  TProps extends any = {},
  TPluginPre extends PluginPre = undefined,
  TPluginPost extends PluginPost = undefined,

  THasDefinedProps extends boolean = boolean,
  THasDefinedPre extends boolean = boolean,
  THasDefinedPost extends boolean = boolean,
> =
  IncludeIfTrue<THasDefinedProps, {
    /**
     * What properties each endpoint can or must define.
     */
    props?: TProps
  }>
  & IncludeIfFalse<THasDefinedProps, {
    /**
     * Defines what properties each endpoints can or must define.
     */
    setProps: <TNewProps extends any>(
      props: TNewProps
    ) => PluginCreator<
      TPreceedingProps,
      TPreceedingPreMetaData,
      TPreceedingPostMetaData,

      TNewProps,
      TPluginPre,
      TPluginPost,

      true,
      THasDefinedPre,
      THasDefinedPost
    >
  }>

  & IncludeIfTrue<THasDefinedPre, {
    /**
     * Logic before the endpoint handler is called.
     */
    pre?: TPluginPre
  }>
  & IncludeIfFalse<THasDefinedPre, {
    /**
     * Defines logic before the endpoint handler is called.
     */
    setPre: <TNewPluginPre extends PluginPre<TPreceedingProps & TProps, TPreceedingPreMetaData>>(
      pre: TNewPluginPre
    ) => PluginCreator<
      TPreceedingProps,
      TPreceedingPreMetaData,
      TPreceedingPostMetaData,

      TProps,
      TNewPluginPre,
      TPluginPost,

      THasDefinedProps,
      true,
      THasDefinedPost
    >
  }>

  & IncludeIfTrue<THasDefinedPost, {
    /**
     * Logic after the endpoint handler is called.
     */
    post?: TPluginPost
  }>
  & IncludeIfFalse<THasDefinedPost, {
    /**
     * Defines logic after the endpoint handler is called.
     */
    setPost: <TNewPluginPost extends PluginPost<TPreceedingProps & TProps, TPreceedingPostMetaData>>(
      post: TNewPluginPost
    ) => PluginCreator<
      TPreceedingProps,
      TPreceedingPreMetaData,
      TPreceedingPostMetaData,

      TProps,
      TPluginPre,
      TNewPluginPost,

      THasDefinedProps,
      THasDefinedPre,
      true
    >
  }>

  & {
    /**
     * Builds to a plugin that can be added to the `endie` instance.
     */
    build: () => Plugin<
      TPreceedingProps,
      TPreceedingPreMetaData,
      TPreceedingPostMetaData,

      TProps,
      StandardizePluginPre<TPluginPre>,
      StandardizePluginPost<TPluginPost>
    >
  }

type StandardizePluginPre<
  TPluginPre extends PluginPre
> = TPluginPre extends undefined
  ? undefined
  : (
    (
      TPluginPre extends { skip: SkipFunction }
        ? {
          skip: (...args: any[]) => ReturnType<TPluginPre['skip']>
        }
        : {}
    ) & {
      exec: (...args: any[]) => ReturnType<TPluginPre['exec']>
    }
  )

type StandardizePluginPost<
  TPluginPost extends PluginPost
> = TPluginPost extends undefined
  ? undefined
  : (
    (
      TPluginPost extends { skip: SkipFunction }
        ? {
          skip: (...args: any[]) => ReturnType<TPluginPost['skip']>
        }
        : {}
    ) & {
      exec: (...args: any[]) => ReturnType<TPluginPost['exec']>
    }
  )

export type PluginList = Plugin[]
