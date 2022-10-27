import { CreateEndpointFunction } from './endpoint/types'
import { InitPlugin, InitPluginList, PostRequestPlugin, PostRequestPluginList, PreRequestPlugin, PreRequestPluginList } from './plugin/types/plugin'
import { AggregateReturnedData, AggregateInitPluginListEndpointProps } from './plugin/types/pluginLoader'

export type Endie<
  TInitPluginList extends InitPluginList = InitPluginList,
  TPreRequestPluginList extends PreRequestPluginList = PreRequestPluginList,
  TPostRequestPluginList extends PostRequestPluginList = PostRequestPluginList,
  TLocked extends boolean = boolean,
> = (
  TLocked extends false
    ? {
      addInitPlugin: <
        TPlugin extends InitPlugin
      >(plugin: TPlugin) => Endie<[...TInitPluginList, TPlugin], TPreRequestPluginList, TPostRequestPluginList, false>
      addPreRequestPlugin: <
        TPlugin extends PreRequestPlugin<
          AggregateReturnedData<TPreRequestPluginList>,
          AggregateInitPluginListEndpointProps<TInitPluginList>
        >
      >(plugin: TPlugin) => Endie<TInitPluginList, [...TPreRequestPluginList, TPlugin], TPostRequestPluginList, false>
      addPostRequestPlugin: <
        TPlugin extends PostRequestPlugin<
          AggregateReturnedData<TPreRequestPluginList> & AggregateReturnedData<TPostRequestPluginList>,
          AggregateInitPluginListEndpointProps<TInitPluginList>
        >
      >(plugin: TPlugin) => Endie<TInitPluginList, TPreRequestPluginList, [...TPostRequestPluginList, TPlugin], false>
      lock: () => Endie<TInitPluginList, TPreRequestPluginList, TPostRequestPluginList, true>
    }
    : {
      createEndpoint: CreateEndpointFunction<
        AggregateReturnedData<TPreRequestPluginList>,
        AggregateInitPluginListEndpointProps<TInitPluginList>
      >
    }
)
