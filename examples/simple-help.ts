import { build } from '../src'

const program = build({
  name: 'web-server-cli',
  description: 'launch web server',
  version: '0.1.0',
  examples: ['usage example #1', 'usage example #2'],
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

//  npx tsx examples/simple-help.ts --help
//
//  Outputs:
//
//  Usage: web-server-cli [command] [options]
//
//  launch web server
//
//  Options:
//    -i, ip      web ip (default: 127.0.0.1)
//    -p, port    web port (default: 3000)
//
//  Example:
//    $ usage example #1
//    $ usage example #2
