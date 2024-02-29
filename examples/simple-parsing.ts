import { build } from '../src'

const program = build({
  name: 'my-cli',
  description: 'A command-line tool.',
  version: '0.1.0',
})

const parsed = await program.parse()

console.log(JSON.stringify(parsed, null, 2))

//  npx tsx examples/simple-parsing.ts baz wow --type=bar
//
//  Outputs:
//
//  {
//    "command": "baz",
//    "args": [
//      "wow"
//    ],
//    "options": {
//      "type": "bar"
//    }
//  }
