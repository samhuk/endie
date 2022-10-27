import { Next } from './helpers'
import { InitPlugin, InitPluginList, PostRequestPlugin, PostRequestPluginList, PreRequestPlugin, PreRequestPluginList } from './plugin'

type _AggregateReturnedData<
  TPluginList extends PreRequestPluginList | PostRequestPluginList,
  V extends Object = {},
  I extends number = 0,
> = TPluginList[I] extends undefined
  ? V
  : _AggregateReturnedData<
    TPluginList,
    V & (
      TPluginList[I] extends { skip: any }
        ? Partial<Awaited<ReturnType<TPluginList[I]['exec']>>>
        : Awaited<ReturnType<TPluginList[I]['exec']>>
      ),
    Next[I]
  >

type AggregateReturnedData<
  TPluginList extends PreRequestPluginList | PostRequestPluginList
> = _AggregateReturnedData<TPluginList>

type _AggregateInitPluginListEndpointProps<
  TPluginList extends InitPluginList,
  V extends Object = {},
  I extends number = 0,
> = TPluginList[I] extends undefined
  ? V
  : _AggregateInitPluginListEndpointProps<
    TPluginList,
    V & TPluginList[I]['endpointProps'],
    Next[I]
  >

type AggregateInitPluginListEndpointProps<
  TPluginList extends InitPluginList
> = _AggregateInitPluginListEndpointProps<TPluginList>

export type PluginLoader<
  TInitPluginList extends InitPluginList = [],
  TPreRequestPluginList extends PreRequestPluginList = [],
  TPostRequestPluginList extends PostRequestPluginList = [],
> = {
  initPlugins: TInitPluginList
  preRequestPlugins: TPreRequestPluginList
  postRequestPlugins: TPostRequestPluginList
  addInitPlugin: <
    TPlugin extends InitPlugin
  >(plugin: TPlugin) => PluginLoader<[...TInitPluginList, TPlugin], TPreRequestPluginList, TPostRequestPluginList>
  addPreRequestPlugin: <
    TPlugin extends PreRequestPlugin<
      AggregateReturnedData<TPreRequestPluginList>,
      AggregateInitPluginListEndpointProps<TInitPluginList>
    >
  >(plugin: TPlugin) => PluginLoader<TInitPluginList, [...TPreRequestPluginList, TPlugin], TPostRequestPluginList>
  addPostRequestPlugin: <
    TPlugin extends PostRequestPlugin<
      AggregateReturnedData<TPostRequestPluginList>,
      AggregateInitPluginListEndpointProps<TInitPluginList>
    >
  >(plugin: TPlugin) => PluginLoader<TInitPluginList, TPreRequestPluginList, [...TPostRequestPluginList, TPlugin]>
}
