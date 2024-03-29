import type { Command } from '../types'

/**
 * Prints the help information for the specified command and, optionally, a sub-command.
 *
 * @param {Required<Command>} command - The command for which to print help information.
 * @param {string | undefined} subCommand - The optional sub-command for which to print help information.
 * @returns {string} The formatted help information as a string.
 */
export function printHelp(
  command: Required<Command>,
  subCommand?: string
): string {
  const indent = '  '
  const lines: string[] = []

  let resolvedCommand = command

  if (subCommand && command.commands.length !== 0) {
    resolvedCommand =
      (command.commands.find(
        ({ name }) => name === subCommand
      ) as Required<Command>) || command
  }

  const {
    name,
    description,
    arguments: args,
    examples,
    options,
    commands,
  } = resolvedCommand

  const argKeys = Object.keys(args)
  const optionKeys = Object.keys(options)
  const commandKeys = commands.map(({ name }) => name)

  const hasArg = argKeys.length !== 0
  const hasOption = optionKeys.length !== 0
  const hasCommand = commands.length !== 0

  /**
   * Returns the `maxlength` of the longest arg, opt & cmd string literal key + 8.
   */
  const maxLength =
    8 +
    [...argKeys, ...optionKeys, ...commandKeys].reduce(
      (max, opt) => Math.max(max, opt.length),
      0
    )

  lines.push(
    `Usage: ${name} ${
      subCommand ? `[${subCommand}] ` : hasCommand ? `[command] ` : ''
    }${hasOption ? `[options]` : ''}`
  )

  if (description) {
    lines.push('', description)
  }

  if (hasArg) {
    lines.push('', 'Arguments:')

    for (const [name, arg] of Object.entries(args)) {
      const { description, default: defaultValue } = arg

      const leftColumn = `${indent}${name}`

      lines.push(
        `${leftColumn.padEnd(maxLength + indent.length)}${
          description ? `${description} ` : ''
        }${defaultValue ? `(default: ${defaultValue})` : ''}`
      )
    }
  }

  if (hasOption) {
    lines.push('', 'Options:')

    for (const [name, opt] of Object.entries(options)) {
      const { short, description, default: defaultValue } = opt

      const leftColumn = `${indent}${
        short ? `-${short}, ` : `${indent.repeat(2)}`
      }${name}`

      lines.push(
        `${leftColumn.padEnd(maxLength + indent.length)}${
          description ? `${description} ` : ''
        }${defaultValue ? `(default: ${defaultValue})` : ''}`
      )
    }
  }

  if (hasCommand) {
    lines.push('', 'Commands:')

    for (const subCmd of commands) {
      const { name, description } = subCmd

      if (name !== '__default__') {
        const leftColumn = `${indent}${name} [options]`

        lines.push(
          `${leftColumn.padEnd(maxLength + indent.length)}${description}`
        )
      }
    }
  }

  if (examples.length !== 0) {
    lines.push('', 'Example:')

    for (const expl of examples) {
      lines.push(`${indent}$ ${expl}`)
    }
  }

  return lines.join('\n')
}
