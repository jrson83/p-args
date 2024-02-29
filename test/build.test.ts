import { strictEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { defaultProgramProps } from './setup'

import { build } from '../src/build'

describe('build', () => {
  it('should create program', () => {
    const program = build(defaultProgramProps)

    strictEqual(program.name, defaultProgramProps.name)
    strictEqual(program.description, defaultProgramProps.description)
    strictEqual(program.version, defaultProgramProps.version)
  })

  it('should output program version', async (ctx) => {
    const info = ctx.mock.method(global.console, 'info', async () => {
      return
    })

    strictEqual(info.mock.callCount(), 0)

    const program = build(defaultProgramProps)

    await program.parse(['--version'])

    strictEqual(info.mock.callCount(), 1)
    strictEqual(info.mock.calls[0]?.arguments[0], 'my-cli/v0.1.0')
  })

  it('should output program help', async (ctx) => {
    const info = ctx.mock.method(global.console, 'info', async () => {
      return
    })

    strictEqual(info.mock.callCount(), 0)

    const program = build(defaultProgramProps)

    await program.parse(['--help'])

    strictEqual(info.mock.callCount(), 1)
    strictEqual(
      info.mock.calls[0]?.arguments[0],
      `Usage: ${defaultProgramProps.name} [command] [options]\n\n${defaultProgramProps.description}`
    )
  })
})
