import type { Command, ResolvedArgs } from '../types'
import { debug } from './logger'

export function parsePositionals(
  command: Command,
  positionals: string[]
): ResolvedArgs {
  const resolvedArgs = {} as ResolvedArgs

  if (Object.keys(command.arguments!).length) {
    debug('Parsing arguments "%s".', command)

    for (const [name, arg] of Object.entries(command.arguments!)) {
      if (!arg.multiple) {
        const value = positionals.pop()

        if ((!value && arg.required) || name === value) {
          throw new Error(`Expected required argument: ${name}.`)
        }

        resolvedArgs[name] ??= value
      } else {
        const argIndex = positionals.findIndex((p) => p === name)
        const values = positionals.slice(argIndex + 1)

        resolvedArgs[name] ??= values
      }
    }
  }

  debug('Returning resolved arguments "%s".', resolvedArgs)

  return resolvedArgs
}
