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
      /**
       * Add a plugin that is ran after synchronously at setup of endie. This is useful for stating
       * the options that are required for `createEndpoint`.
       */
      addInitPlugin: <
        TPlugin extends InitPlugin
      >(plugin: TPlugin) => Endie<[...TInitPluginList, TPlugin], TPreRequestPluginList, TPostRequestPluginList, false>
      /**
       * Add a plugin that is ran before the request handler has been executed.
       */
      addPreRequestPlugin: <
        TPlugin extends PreRequestPlugin<
          AggregateReturnedData<TPreRequestPluginList>,
          AggregateInitPluginListEndpointProps<TInitPluginList>
        >
      >(plugin: TPlugin) => Endie<TInitPluginList, [...TPreRequestPluginList, TPlugin], TPostRequestPluginList, false>
      /**
       * Add a plugin that is ran after the request handler has been executed.
       */
      addPostRequestPlugin: <
        TPlugin extends PostRequestPlugin<
          AggregateReturnedData<TPreRequestPluginList> & AggregateReturnedData<TPostRequestPluginList>,
          AggregateInitPluginListEndpointProps<TInitPluginList>
        >
      >(plugin: TPlugin) => Endie<TInitPluginList, TPreRequestPluginList, [...TPostRequestPluginList, TPlugin], false>
      /**
       * Locks-in the added plugins and prevents more plugins from being
       * inadvertently added later on, which would not be type-enforced.
       */
      lock: () => Endie<TInitPluginList, TPreRequestPluginList, TPostRequestPluginList, true>
    }
    : {
      createEndpoint: CreateEndpointFunction<
        AggregateReturnedData<TPreRequestPluginList>,
        AggregateInitPluginListEndpointProps<TInitPluginList>
      >
    }
)
