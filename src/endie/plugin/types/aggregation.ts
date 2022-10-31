import { Next } from './helpers'
import { Plugin, PluginList, PostRequestPluginExecFunction, PreRequestPluginExecFunction } from '.'

type _AggregatePluginListInitProps<
  TPluginList extends PluginList,
  V extends Object = {},
  I extends number = 0,
> = TPluginList[I] extends undefined
  ? V
  : _AggregatePluginListInitProps<
    TPluginList,
    V & TPluginList[I]['props'],
    Next[I]
  >

export type AggregatePluginListInitProps<
  TPluginList extends PluginList
> = _AggregatePluginListInitProps<TPluginList>

type ReturnedDataOfExecFunction<
  TVal extends any = any,
> = TVal extends void ? {} : TVal

type ReturnTypeOfPreExecFunction<
  TPlugin extends Plugin = Plugin,
> = ReturnedDataOfExecFunction<Awaited<ReturnType<TPlugin['pre']['exec']>>>

type _AggregatePluginPreExecResults<
  TPluginList extends PluginList,
  V extends Object = {},
  I extends number = 0,
> = TPluginList[I] extends undefined
  ? V
  : _AggregatePluginPreExecResults<
    TPluginList,
    V & (TPluginList[I]['pre']['exec'] extends PreRequestPluginExecFunction
      ? (
        TPluginList[I] extends { skip: any }
          ? Partial<ReturnTypeOfPreExecFunction<TPluginList[I]>>
          : ReturnTypeOfPreExecFunction<TPluginList[I]>
      )
      : {}
    ),
    Next[I]
  >

export type AggregatePluginPreExecResults<
  TPluginList extends PluginList
> = _AggregatePluginPreExecResults<TPluginList>

type ReturnTypeOfPostExecFunction<
  TPlugin extends Plugin = Plugin,
> = ReturnedDataOfExecFunction<Awaited<ReturnType<TPlugin['post']['exec']>>>

type _AggregatePluginPostExecResults<
  TPluginList extends PluginList,
  V extends Object = {},
  I extends number = 0,
> = TPluginList[I] extends undefined
  ? V
  : _AggregatePluginPostExecResults<
    TPluginList,
    V & (TPluginList[I]['post']['exec'] extends PostRequestPluginExecFunction
    ? (
      TPluginList[I] extends { skip: any }
        ? Partial<ReturnTypeOfPostExecFunction<TPluginList[I]>>
        : ReturnTypeOfPostExecFunction<TPluginList[I]>
    )
    : {}
  ),
    Next[I]
  >

export type AggregatePluginPostExecResults<
  TPluginList extends PluginList
> = _AggregatePluginPostExecResults<TPluginList>
