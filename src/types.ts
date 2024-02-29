import type { ParseArgsConfig, parseArgs } from 'node:util'

/**
 * Custom interface extending the standard Error interface to include a 'code' property.
 * This allows for more detailed error information specific to code-related errors.
 */
export interface CodeError extends Error {
  code: string
}

/**
 * Helper type-level function to expand a given type to show all of its inferred fields when hovered.
 *
 * @see {@link https://stackoverflow.com/a/57683652}
 * @see {@link https://gist.github.com/trevor-atlas/b277496d0379d574cadd3cf8af0de34c}
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type ConditionalDefault<Multiple extends boolean> =
  Multiple extends boolean
    ? true extends Multiple
      ? string[]
      : false extends Multiple
        ? string
        : never
    : never

/**
 * Represents an argument.
 */
export type ParseArgsArgumentConfig<Multiple extends boolean = boolean> = {
  /**
   * The description of the argument.
   */
  readonly description?: string

  /**
   * Whether this option can be provided multiple times.
   * If `true`, all values will be collected in an array.
   * If `false`, values for the option are last-wins.
   * @defaultValue false.
   */
  readonly multiple?: Multiple

  /**
   * Whether this argument is required.
   * @defaultValue false.
   */
  readonly required?: boolean

  /**
   * The default option value when it is not set by args.
   * When `multiple` is `true`, it must be an array.
   */
  readonly default?: ConditionalDefault<Multiple>
}

/**
 * Represents an object holding multiple arguments.
 */
export type ParseArgsArgumentsConfig = Record<string, ParseArgsArgumentConfig>

/**
 * Helper type to validate and ensure consistency in the types of default values for a single argument.
 *
 * @template T - The type of the argument configuration.
 */
type ValidateArgType<T extends ParseArgsArgumentConfig> =
  /**
   * If the argument allows multiple values, the default value must be an array of strings.
   */
  T['multiple'] extends true
    ? T & { default?: string[] }
    : /**
       * If the argument does not allow multiple values, the default value must be a string.
       */
      Omit<T, 'default'> & { default?: string }

/**
 * Type to validate and ensure consistency in the types of default values for a set of arguments.
 *
 * @template T - The type of the arguments configuration.
 */
export type Validate<T extends ParseArgsArgumentsConfig> = {
  /**
   * For each argument key in the configuration, validate and ensure consistency in the types of default values.
   */
  [K in keyof T]: ValidateArgType<T[K]>
}

/**
 * Type to extract the argument value type based on whether the argument allows multiple values.
 *
 * @template T - The type of the argument configuration.
 */
export type ExtractArgType<T extends ParseArgsArgumentConfig> =
  /**
   * If the argument allows multiple values, the type is an array of strings.
   */
  T extends ParseArgsArgumentConfig
    ? T['multiple'] extends true
      ? string[]
      : /**
         * If the argument does not allow multiple values, the type is a string.
         */
        string
    : never

/**
 * Type to represent the parsed handler arguments with inferred types.
 *
 * @see {@link https://stackoverflow.com/a/74363398}
 *
 * @template T - The type of the arguments configuration.
 */
export type TypedHandlerArgs<T extends ParseArgsArgumentsConfig> = Expand<
  /**
   * For each argument key in the configuration, represent it as an optional property
   * with the value type extracted based on whether the argument allows multiple values.
   */
  {
    -readonly [K in keyof T]?: ExtractArgType<T[K]>
  } /**
   * For each required argument, represent it as a required property
   * with the value type extracted based on whether the argument allows multiple values.
   */ & {
    -readonly [K in keyof T as T[K]['required'] extends true
      ? K
      : never]-?: ExtractArgType<T[K]>
  }
>

/**
 * Represents options known to the parser.
 *
 * Since we don't want the declarations to be merged, we use `type` instead of `interface`.
 *
 * @see {@link ParseArgsConfig['options']}
 */
export type ParseArgsOptionsConfig = {
  /**
   * Because `node:util` does not export `ParseArgsOptionConfig`, which describes an option,
   * we use {@link ParseArgsConfig['options']} to bypass {@link parseArgs} requirements:
   *
   * > If ParseArgsConfig extends T, then the user passed config constructed elsewhere.
   *
   * @see {@link https://github.com/DefinitelyTyped/DefinitelyTyped/blob/db11844be8078a246bddde9a1ef0e2e6c0c9dcc8/types/node/util.d.ts#L1492}
   */
  [longOption: string]: NonNullable<ParseArgsConfig['options']>[string] & {
    /**
     * The description of the option.
     */
    description?: string

    /**
     * Whether this option is required.
     * @defaultValue false.
     */
    // todo: required?: boolean
  }
}

/**
 * Represents the inferred type of options after parsing, based on the provided options configuration.
 *
 * @template Options - The type of the options configuration.
 */
export type TypedOptions<Options extends ParseArgsOptionsConfig> = ReturnType<
  /**
   * Uses the `parseArgs` function with the provided options configuration
   * to infer the type of the parsed options values.
   */
  typeof parseArgs<{ options: Options }>
>['values']

/**
 * Represents the inferred type of options after parsing without a specific options configuration.
 */
export type ParsedOptions = ReturnType<typeof parseArgs>['values']

/**
 * Represents the options that define a command.
 *
 * Generics ({@link Args} and {@link Options}):
 *
 * {@link Args} represents the type for arguments, and {@link Options} represents the type for options.
 * They have default values of {@link ParseArgsArgumentsConfig} and  {@link ParseArgsOptionsConfig} respectively,
 * which means if they are not explicitly provided when using {@link HandlerFunction}, TypeScript will use these defaults.
 *
 * Conditionals (`Args extends ...` and `Options extends ...`)
 *
 * These conditionals ensure that if custom types ({@link ParseArgsArgumentsConfig} and {@link ParseArgsOptionsConfig})
 * are provided, they will be used. Otherwise, default to the more general types.
 */
export type Command<
  Args extends ParseArgsArgumentsConfig | undefined = ParseArgsArgumentsConfig,
  Options extends ParseArgsOptionsConfig | undefined = ParseArgsOptionsConfig,
> = {
  /**
   * The command name.
   */
  name: string

  /**
   * Description for this command.
   */
  description?: string

  /**
   * Version to show -v, --version.
   */
  version?: string

  /**
   * Examples to show for this command -h, --help.
   */
  examples?: string[]

  /**
   * Arguments for this command.
   */
  arguments?: Args // ReturnType of argument validator?

  /**
   * Options for this command.
   */
  options?: Options

  /**
   * Subcommands for this command.
   */
  commands?: SubCommand[]

  /**
   * Handler that executes this command.
   *
   * Parameters (`args` and `opts`):
   *
   * `args` is of type {@link TypedHandlerArgs} or `Record<string, string | string[] | undefined>` depending on the condition.
   * `opts` is of type {@link TypedOptions} or {@link ParsedOptions} depending on the condition.
   *
   * Since both interfaces have an almost identical but not identical index signature,
   * `Record<string, string | undefined>` and `Record<string, string | string[] | undefined>`,
   * we compare the type first, then swap the arguments around. Now if `Args` matches
   * `ParseArgsArgumentsConfig`, the condition will be true, otherwise it will be false.
   *
   * @link {@see https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/}
   *
   * @todo Implement async usage.
   * @todo Extract into external Type.
   * @todo See if something like `type-level equality operator` might simplify the code.
   * @todo {@link https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same}
   */
  handler?(
    args: Args extends ParseArgsArgumentsConfig
      ? ParseArgsArgumentsConfig extends Args
        ? Record<string, string | string[] | undefined>
        : TypedHandlerArgs<Args>
      : never,
    opts: Options extends ParseArgsOptionsConfig
      ? TypedOptions<Options>
      : ParsedOptions
  ): void | Promise<void>
}

/**
 * Represents the options that define a sub-command.
 */
export type SubCommand = Omit<Command, 'commands' | 'version'>

/**
 * Represents a resolved command.
 */
export type CommandReturnType<
  Args extends ParseArgsArgumentsConfig | undefined = ParseArgsArgumentsConfig,
  Options extends ParseArgsOptionsConfig | undefined = ParseArgsOptionsConfig,
> = Required<Command /* <Args, Options> */> & {
  /**
   * The raw command-line arguments, without the first two from argv.
   */
  rawArgv: string[]

  /**
   * The parser function.
   *
   * We use method shorthand syntax to access `this` for chaining.
   *
   * @see {@link https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful}
   */
  parse(
    this: CommandReturnType<Args, Options>,
    args?: string[]
  ): void | Promise<void> | ResolvedParsedArgs
}

/**
 * Describes the resolved parseArgs result.
 * Outputs only if no default command action-handler or subCommand is provided.
 */
export interface ResolvedParsedArgs {
  command: string | undefined
  args: string[] | undefined
  options: unknown
}

export interface ResolvedArgs {
  [name: string]: string | string[] | undefined
}

/**
 * @deprecated Use {@link Command.handler} inline instead.
 * Represents the handler function for a command/sub-command.
 */
export type HandlerFunction = <
  Args extends ParseArgsArgumentsConfig | undefined = ParseArgsArgumentsConfig,
  Options extends ParseArgsOptionsConfig | undefined = ParseArgsOptionsConfig,
>(
  args: Args extends ParseArgsArgumentsConfig
    ? TypedHandlerArgs<Args>
    : Record<string, unknown>,
  opts: Options extends ParseArgsOptionsConfig
    ? TypedOptions<Options>
    : ParsedOptions
) => void | Promise<void>
