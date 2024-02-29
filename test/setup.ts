import type { Command, ParseArgsOptionsConfig } from '../src/types'

export const defaultProgramProps = {
  name: 'my-cli',
  description: 'CLI-Test program',
  version: '0.1.0',
  examples: [],
  arguments: {},
  options: {},
  commands: [],
} satisfies Command

export const defaultCommandProps = {
  name: 'test',
  description: 'Test command',
  async handler(opts) {
    console.log('action -> ', opts.values)
  },
} satisfies Command

export const defaultOptionProps = {
  name: {
    description: 'Test name',
    type: 'string',
    short: 'n',
    default: 'foo',
  },
} satisfies ParseArgsOptionsConfig

export const defaultExamplesProps = ['usage example #1']
