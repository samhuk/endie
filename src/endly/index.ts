import { EndieOptions, Endie } from './types'

export const createEndie = <
  TOptions extends EndieOptions
>(options: TOptions): Endie<TOptions> => ({
    sum: options.permissions,
  } as any)
