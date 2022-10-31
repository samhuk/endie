import { CreateEndpointFunction } from './endpoint/types'
import {
  Plugin,
  PluginList,
} from './plugin/types'
import { AggregatePluginPreExecResults, AggregatePluginPostExecResults, AggregatePluginListInitProps } from './plugin/types/aggregation'

export type Endie<
  TPluginList extends PluginList = PluginList,
  TLocked extends boolean = boolean,
> = (
  TLocked extends false
    ? {
      /**
       * Adds a plugin.
       */
      addPlugin: <
        TPlugin extends Plugin<
          AggregatePluginListInitProps<TPluginList>,
          AggregatePluginPreExecResults<TPluginList>,
          AggregatePluginPostExecResults<TPluginList>
        >
      >(creator: TPlugin) => Endie<[...TPluginList, TPlugin], false>
      /**
       * Locks-in the added plugins and prevents more plugins from being
       * inadvertently added later on, which would not be type-enforced.
       */
      lock: () => Endie<TPluginList, true>
    }
    : {
      /**
       * Create an endpoint, provided with metadata and logic obtained by the added plugins.
       */
      create: CreateEndpointFunction<
        AggregatePluginListInitProps<TPluginList>,
        AggregatePluginPreExecResults<TPluginList> & AggregatePluginPostExecResults<TPluginList>
      >
    }
)
