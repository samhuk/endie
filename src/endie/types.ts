import { CreateEndpointFunction } from './endpoint/types'
import { InitPlugin, InitPluginList, PostRequestPlugin, PostRequestPluginList, PreRequestPlugin, PreRequestPluginList } from './plugin/types/plugin'
import { AggregateReturnedData, AggregateInitPluginListEndpointProps } from './plugin/types/pluginLoader'

export type Endie<
  TInitPluginList extends InitPluginList = [],
  TPreRequestPluginList extends PreRequestPluginList = [],
  TPostRequestPluginList extends PostRequestPluginList = [],
> = {
  initPlugins: TInitPluginList
  preRequestPlugins: TPreRequestPluginList
  postRequestPlugins: TPostRequestPluginList
  addInitPlugin: <
    TPlugin extends InitPlugin
  >(plugin: TPlugin) => Endie<[...TInitPluginList, TPlugin], TPreRequestPluginList, TPostRequestPluginList>
  addPreRequestPlugin: <
    TPlugin extends PreRequestPlugin<
      AggregateReturnedData<TPreRequestPluginList>,
      AggregateInitPluginListEndpointProps<TInitPluginList>
    >
  >(plugin: TPlugin) => Endie<TInitPluginList, [...TPreRequestPluginList, TPlugin], TPostRequestPluginList>
  addPostRequestPlugin: <
    TPlugin extends PostRequestPlugin<
      AggregateReturnedData<TPreRequestPluginList> & AggregateReturnedData<TPostRequestPluginList>,
      AggregateInitPluginListEndpointProps<TInitPluginList>
    >
  >(plugin: TPlugin) => Endie<TInitPluginList, TPreRequestPluginList, [...TPostRequestPluginList, TPlugin]>
  createEndpoint: CreateEndpointFunction<
    AggregateReturnedData<TPreRequestPluginList>,
    AggregateInitPluginListEndpointProps<TInitPluginList>
  >
}
