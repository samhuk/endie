import { Request, Response } from 'express'

import { CreateEndpointFunction, HandlerFunction } from './endpoint/types'
import { createPlugin } from './plugin'
import { Plugin, PluginCreator, PluginList } from './plugin/types'
import { Endie } from './types'

const runPluginPres = async (
  req: Request,
  res: Response,
  props: any,
  pluginList: PluginList,
) => {
  let metaData: any = {}

  // Iterate through plugin list, executing all plugin pres
  for (let i = 0; i < pluginList.length; i += 1) {
    const skip = pluginList[i].pre?.skip?.({
      m: metaData,
      props,
      req,
      res,
    }) ?? false
    if (!skip) {
      // eslint-disable-next-line no-await-in-loop
      const execResult = await pluginList[i].pre?.exec({
        m: metaData,
        props,
        req,
        res,
      })
      metaData = { ...metaData, ...execResult }
    }
  }
  return metaData
}

const runHandler = async (
  req: Request,
  res: Response,
  handler: HandlerFunction,
  metaData: any,
): Promise<{ returnedData?: any, error?: any }> => {
  const returnedData = await handler({
    m: metaData,
    req,
    res,
  })
  return returnedData
}

const runPluginPosts = async (
  req: Request,
  res: Response,
  props: any,
  metaData: any,
  returnedData: any,
  error: any,
  pluginList: PluginList,
) => {
  let _metaData: any = metaData
  for (let i = 0; i < pluginList.length; i += 1) {
    const skip = pluginList[i].post?.skip?.({
      m: metaData,
      props,
      req,
      res,
    }) ?? false
    if (!skip) {
      // eslint-disable-next-line no-await-in-loop
      const execResult = await pluginList[i].post?.exec({
        m: _metaData,
        props,
        req,
        res,
        returnedData,
        error,
      })
      _metaData = { ..._metaData, ...execResult }
    }
  }
}

const createCreateEndpointFunction = (
  pluginList: PluginList,
): CreateEndpointFunction => props => async (req, res) => {
  let error: any
  let metaData: any
  let returnedData: any

  // Run plugin pres
  try {
    metaData = await runPluginPres(req, res, props, pluginList)
  }
  catch (e) {
    error = e
  }

  // Run handler only if no error occured
  if (error == null) {
    try {
      returnedData = await runHandler(req, res, props.handler, metaData)
    }
    catch (e) {
      error = e
    }
  }

  // Run plugin posts, providing them with datq acquired up to now
  await runPluginPosts(req, res, props, metaData, returnedData, error, pluginList)
}

const lock = (endie: Endie<PluginList, false>, pluginList: PluginList) => {
  delete endie.addPlugin
  delete endie.lock
  const _endie = endie as unknown as Endie<PluginList, true>
  const tmp = endie as any
  tmp.create = createCreateEndpointFunction(pluginList) as any
  return _endie
}

export const createEndie = (): Endie<[], false> => {
  let endie: Endie<[], false>
  const pluginList: PluginList = []

  return endie = {
    addPlugin: (plugin: Plugin | ((creator: PluginCreator) => Plugin)) => {
      const _plugin = typeof plugin !== 'function' ? plugin : plugin(createPlugin())
      pluginList.push(_plugin)
      return endie as any
    },
    lock: () => lock(endie as any, pluginList),
  } as any
}
