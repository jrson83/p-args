import { argument, build } from '../src'

// example usage from https://github.com/tj/commander.js/blob/master/examples/string-util.js

const program = build({
  name: 'web-server-cli',
  description: 'split a string into substrings and display as an array.',
  version: '0.1.0',
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
})

await program.parse()

//  npx tsx examples/simple-arguments.ts split string a,b,c
//
//  Outputs:
//
//  [ 'a', 'b', 'c' ]
//
//  npx tsx examples/simple-arguments.ts split --first --separator=/ string a/b/c
//
//  Outputs:
//
//  [ 'a' ]
