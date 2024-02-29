import { build } from '../src'

const program = build({
  name: 'web-server-cli',
  description: 'launch web server',
  version: '0.1.0',
  options: {
    ip: {
      type: 'string',
      short: 'i',
      default: '127.0.0.1',
      description: 'web ip',
    },
    port: {
      type: 'string',
      short: 'p',
      default: '3000',
      description: 'web port',
    },
  },
  handler: (_args, opts) => {
    console.log(`server listening: ${opts.ip}:${opts.port}`)
  },
})

await program.parse()

//  npx tsx examples/simple-options.ts --ip=192.168.178.70 --port=4000
//
//  Outputs:
//
//  Todo
