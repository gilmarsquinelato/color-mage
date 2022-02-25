import { isProduction } from './env'

export const logError = (...args: unknown[]) => {
  if (isProduction()) return
  console.error(...args)
}
