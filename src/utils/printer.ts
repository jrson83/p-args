import type { Command } from '../types'

/**
 * Prints the help information for the specified command and, optionally, a sub-command.
 *
 * @param {Required<Command>} command - The command for which to print help information.
 * @param {string | undefined} subCommand - The optional sub-command for which to print help information.
 * @returns {string} The formatted help information as a string.
 */
export function printHelp(cmd: Required<Command>, subCommand?: string): string {
  const indent = '  '
  const lines: string[] = []

  let command = cmd

  if (subCommand && cmd.commands?.length !== 0) {
    command = cmd.commands?.find(
      ({ name }) => name === subCommand
    ) as Required<Command>
  }

  /**
   * Returns the `maxlength` of the longest arg, opt & cmd string literal key + 8.
   */
  const maxLength =
    8 +
    [
      ...Object.keys(command.arguments),
      ...Object.keys(command.options),
      ...Object.keys(command.commands),
    ].reduce((max, opt) => Math.max(max, opt.length), 0)

  lines.push(`Usage: ${command.name} [${subCommand || 'command'}] [options]`)

  if (command.description) {
    lines.push('', command.description)
  }

  if (Object.keys(command.arguments).length !== 0) {
    lines.push('', 'Arguments:')

    for (const [name, arg] of Object.entries(command.arguments)) {
      const { description, default: defaultValue } = arg

      const leftColumn = `${indent}${name}`

      lines.push(
        `${leftColumn.padEnd(maxLength + indent.length)}${
          description ? `${description} ` : ''
        }${defaultValue ? `(default: ${defaultValue})` : ''}`
      )
    }
  }

  if (Object.keys(command.options).length !== 0) {
    lines.push('', 'Options:')

    for (const [name, opt] of Object.entries(command.options)) {
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

  if (command.commands?.length) {
    lines.push('', 'Commands:')

    for (const subCmd of command.commands) {
      const { name, description } = subCmd

      if (name !== '__default__') {
        const leftColumn = `${indent}${name} [options]`

        lines.push(
          `${leftColumn.padEnd(maxLength + indent.length)}${description}`
        )
      }
    }
  }

  if (command.examples?.length) {
    lines.push('', 'Example:')

    for (const expl of command.examples) {
      lines.push(`${indent}$ ${expl}`)
    }
  }

  return lines.join('\n')
}
