import { CreateEndpointFunction, HandlerFunction } from './endpoint/types'
import { Plugin, PluginList } from './plugin/types'
import { Endie } from './types'

const createCreateEndpointFunction = (
  pluginList: PluginList,
): CreateEndpointFunction => options => {
  const handler = options.handler as HandlerFunction
  return async (req, res) => {
    let metaData = {}

    // Iterate through plugin list, executing all plugin pres
    for (let i = 0; i < pluginList.length; i += 1) {
      const skip = pluginList[i].pre?.skip?.({
        m: metaData,
        props: options,
        req,
        res,
      }) ?? false
      if (!skip) {
        // eslint-disable-next-line no-await-in-loop
        const execResult = await pluginList[i].pre?.exec({
          m: metaData,
          props: options,
          req,
          res,
        })
        metaData = { ...metaData, ...execResult }
      }
    }

    // Run endpoint handler
    let error: any
    let returnedData: any
    try {
      returnedData = await handler({
        m: metaData,
        req,
        res,
      })
    }
    catch (e) {
      error = e
    }

    // Iterate through plugin list, executing all plugin posts
    for (let i = 0; i < pluginList.length; i += 1) {
      const skip = pluginList[i].post?.skip?.({
        m: metaData,
        props: options,
        req,
        res,
      }) ?? false
      if (!skip) {
        // eslint-disable-next-line no-await-in-loop
        const execResult = await pluginList[i].post?.exec({
          m: metaData,
          props: options,
          req,
          res,
          error,
          returnedData,
        })
        metaData = { ...metaData, ...execResult }
      }
    }
  }
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
    addPlugin: (plugin: Plugin) => {
      pluginList.push(plugin)
      return endie as any
    },
    lock: () => lock(endie as any, pluginList),
  } as any
}
