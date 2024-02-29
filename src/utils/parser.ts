import type { Command, ResolvedArgs } from '../types'
import { debug } from './logger'

/**
 * Parses positional arguments for a given command.
 *
 * @param {Command} command - The command for which arguments are being parsed.
 * @param {string[]} positionals - The array of positional arguments to be parsed.
 * @returns {ResolvedArgs} - The resolved arguments after parsing.
 */
export function parsePositionals(
  command: Command,
  positionals: string[]
): ResolvedArgs {
  const resolvedArgs = {} as ResolvedArgs

  if (Object.keys(command.arguments!).length) {
    debug('Parsing arguments "%s".', command)

    // Iterate over each argument in the command.
    for (const [name, arg] of Object.entries(command.arguments!)) {
      // Check if the argument is not allowed to have multiple values.
      if (!arg.multiple) {
        // Retrieve the next positional value.
        const value = positionals.pop()

        // Check for required argument and missing value.
        if ((!value && arg.required) || name === value) {
          throw new Error(`Expected required argument: ${name}.`)
        }

        // Assign the value to the resolvedArgs object.
        resolvedArgs[name] ??= value
      } else {
        // For arguments that allow multiple values.
        const argIndex = positionals.findIndex((p) => p === name)
        const values = positionals.slice(argIndex + 1)

        // Assign the values to the resolvedArgs object.
        resolvedArgs[name] ??= values
      }
    }
  }

  debug('Returning resolved arguments "%s".', resolvedArgs)

  // Return the final resolved arguments.
  return resolvedArgs
}
