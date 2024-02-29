import { argv } from 'node:process'
import { type ParseArgsConfig, parseArgs } from 'node:util'
import { PARSE_ARGS_ERRORS, defaultOptionsConfig } from './constants'
import type {
  Command,
  CommandReturnType,
  ParseArgsArgumentsConfig,
  ParseArgsOptionsConfig,
} from './types'
import { debug, isCodeError, parsePositionals, printHelp } from './utils'

/**
 * Builds and returns a command with specified configuration.
 *
 * @template Args - The type of arguments for the command.
 * @template Options - The type of options for the command.
 * @param {Command<Args, Options>} cmd - The command configuration.
 * @returns {CommandReturnType<Args, Options>} - The built command.
 */
export const build = <
  const Args extends ParseArgsArgumentsConfig,
  const Options extends ParseArgsOptionsConfig,
>(
  cmd: Command<Args, Options>
): CommandReturnType<Args, Options> => {
  debug('Creating command "%s".', cmd.name)

  return {
    name: cmd.name,
    description: cmd.description ?? '',
    version: cmd.version ?? '',
    examples: cmd.examples ?? [],
    arguments: cmd.arguments ?? Object.create({}),
    options: cmd.options ?? Object.create({}),
    commands: cmd.commands ?? [],
    handler: cmd.handler ?? (() => {}),
    rawArgv: argv.slice(2),

    /**
     * The parse function that parses command-line arguments.
     *
     * @param {string[]} args - The command-line arguments to be parsed.
     */
    parse: function (this, args: string[] = this.rawArgv) {
      const allowPositionals =
        !!Object.keys(this.arguments).length || !!this.commands.length

      debug(
        'Parsing args "%s" with allowed positionals "%s".',
        args,
        allowPositionals
      )

      try {
        if (!allowPositionals) {
          // hmm todo default-command
        }

        const {
          positionals: [command, ...resolvedArgs],
          values: opts,
        } = parseArgs({
          args,
          strict: false,
          allowPositionals: true,
          options: defaultOptionsConfig,
        })

        if (opts.version && this.version) {
          debug('Printing version.')

          console.info(`${this.name}/v${this.version}`)

          process.exitCode = 0

          debug('Exiting application with exitCode "%s".', process.exitCode)

          return
        }

        debug('Looking up "%s" command.', command)

        const resolvedCommand = this.commands.find(
          ({ name }) => name === command
        )

        if (opts.help) {
          debug('Printing help.')

          const data = printHelp(this, resolvedCommand?.name)

          console.info(data)

          process.exitCode = 0

          debug('Exiting application with exitCode "%s".', process.exitCode)

          return
        }

        if (command && this.commands.length !== 0) {
          if (!resolvedCommand) {
            debug(
              'No matching command found, but "%d" commands exist.',
              this.commands.length
            )

            const cmds = this.commands.map((cmd) => cmd.name).join(', ')

            console.error(`Unknown command: ${command}`)
            console.error(`Available commands: ${cmds}`)

            process.exitCode = 1

            debug('Exiting application with exitCode "%s".', process.exitCode)

            return
          }

          debug('Resolved "%s" command.', resolvedCommand.name)

          const cmdArgs = args.filter((value, _index, _arr) => {
            return value !== command
          })

          const allowPositionals = !!Object.keys(resolvedCommand.arguments!)
            .length

          const config = {
            args: cmdArgs,
            strict: true,
            allowPositionals,
            options: resolvedCommand.options,
          } satisfies ParseArgsConfig

          debug(
            'Parsing args "%s" with "%s positionals".',
            cmdArgs,
            allowPositionals ? 'disallowed' : 'allowed'
          )

          const { values: resolvedOptions, positionals: resolvedPositionals } =
            parseArgs(config)

          debug('Resolved arguments "%s".', resolvedPositionals)
          debug('Resolved options "%s".', resolvedOptions)

          const resolvedArgs = parsePositionals(
            resolvedCommand,
            resolvedPositionals
          )

          debug(
            'Running action-handler with resolved arguments "%s" and options "%s".',
            resolvedPositionals,
            resolvedOptions
          )

          if (typeof resolvedCommand.handler === 'function') {
            // @ts in-your-face
            resolvedCommand.handler(resolvedArgs, resolvedOptions)
          }

          process.exitCode = 0

          debug('Exiting application with exitCode "%s".', process.exitCode)

          return
        }

        debug('Returning p-arsedArgs.')

        return {
          command,
          args: resolvedArgs,
          options: {
            ...opts,
          },
        }
      } catch (err) {
        if (isCodeError(err) && PARSE_ARGS_ERRORS.includes(err.code)) {
          console.error('[parseArgs Error]: %s\n', err.message)
        }

        if (debug.enabled) {
          throw err
        }

        // https://stackoverflow.com/a/57892143
        process.exitCode = 1

        debug('Exiting application with exitCode "%s".', process.exitCode)

        return
      }
    },
  }
}
