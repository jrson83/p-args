import { argument, build } from '../src'

// example usage from https://github.com/tj/commander.js/blob/master/examples/string-util.js

const program = build({
  name: 'string-util',
  description: 'CLI to some JavaScript string utilities.',
  version: '0.8.0',
  commands: [
    build({
      name: 'split',
      description: 'Split a string into substrings and display as an array.',
      arguments: argument({
        string: {
          default: 'world',
          required: true,
          description: 'string to split',
        },
      }),
      options: {
        first: {
          type: 'boolean',
          short: 'f',
          description: 'display just the first substring',
        },
        separator: {
          type: 'string',
          short: 's',
          description: 'separator character',
          default: ',',
        },
      },
      handler: (args, opts) => {
        const limit = opts.first ? 1 : undefined
        console.log(args.string.split(opts.separator!, limit))
      },
    }),
    build({
      name: 'join',
      description: 'Join the command-arguments into a single string.',
      arguments: argument({
        strings: {
          multiple: true,
          required: true,
          description: 'one or more strings',
        },
      }),
      options: {
        separator: {
          type: 'string',
          short: 's',
          description: 'separator character',
          default: ',',
        },
      },
      handler(args, opts) {
        console.log(args.strings.join(opts.separator))
      },
    }),
  ],
  /**
   * If no default command-handler is specified, will fallback
   * to -h, --help option.
   */
})

await program.parse()

//  npx tsx examples/multiple-commands.ts split string a,b,c
//
//  Outputs:
//
//  [ 'a', 'b', 'c' ]
//
//  npx tsx examples/multiple-commands.ts split --first --separator=/ string a/b/c
//
//  Outputs:
//
//  [ 'a' ]
//
//  npx tsx examples/multiple-commands.ts join --separator / strings abc efg hij
//
//  Outputs:
//
//  abc/efg/hij
