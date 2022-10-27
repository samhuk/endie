import { EndlyOptions, Endly } from './types'

export const createEndly = <
  TOptions extends EndlyOptions
>(options: TOptions): Endly<TOptions> => ({
    sum: options.permissions,
  } as any)
