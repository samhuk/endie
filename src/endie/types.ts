import { CreateEndpointFunction } from './endpoint/types'
import { Plugin, PluginCreator, PluginList } from './plugin/types'
import {
  AggregatePluginListInitProps,
  AggregatePluginPostExecResults,
  AggregatePluginPreExecResults,
} from './plugin/types/aggregation'

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
        TPluginCreator extends PluginCreator<
          AggregatePluginListInitProps<TPluginList>,
          AggregatePluginPreExecResults<TPluginList>,
          AggregatePluginPreExecResults<TPluginList> & AggregatePluginPostExecResults<TPluginList>
        >,
        TPlugin extends Plugin<
          AggregatePluginListInitProps<TPluginList>,
          AggregatePluginPreExecResults<TPluginList>,
          AggregatePluginPreExecResults<TPluginList> & AggregatePluginPostExecResults<TPluginList>
        >,
      >(plugin: TPlugin | ((creator: TPluginCreator) => TPlugin)) => Endie<[...TPluginList, TPlugin], false>
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
        AggregatePluginPreExecResults<TPluginList>
      >
    }
)
