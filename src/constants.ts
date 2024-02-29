import type { ParseArgsOptionsConfig } from './types'

export const helpOptionConfig = {
  help: {
    type: 'boolean',
    short: 'h',
    description: 'displays help information',
  },
} satisfies ParseArgsOptionsConfig

export const versionOptionConfig = {
  version: {
    type: 'boolean',
    short: 'v',
    description: 'displays the version number',
  },
} satisfies ParseArgsOptionsConfig

export const defaultOptionsConfig = {
  ...helpOptionConfig,
  ...versionOptionConfig,
} satisfies ParseArgsOptionsConfig

export const PARSE_ARGS_ERRORS = [
  'ERR_PARSE_ARGS_INVALID_OPTION_VALUE',
  'ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL',
  'ERR_PARSE_ARGS_UNKNOWN_OPTION',
]
