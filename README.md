# p-args

> Zero dependencies TypeScript wrapper around Node.js [`util.parseArgs()`](https://nodejs.org/api/util.html#utilparseargsconfig) API

## Features

> **Note**  
> This project is currently in development.

- Zero dependencies
- Simple to use API
- First-class TypeScript support
- Automatic help generation for commands

## Requirements

Minimum requirements:

- Node.js `>=18.12.0`
- TypeScript `>=5.3`

## Installation

```sh
npm install -D p-args
```

## Usage

### Simple Parsing

```ts
import { build } from 'p-args'

const program = build({
  name: 'my-cli',
  description: 'A command-line tool.',
  version: '0.1.0',
})

const parsed = await program.parse()

console.log(JSON.stringify(parsed, null, 2))
```

<details>

<summary>Show output</summary>

```json
❯ npx tsx examples/simple-parsing.ts baz wow --type=bar
{
  "command": "baz",
  "args": [
    "wow"
  ],
  "options": {
    "type": "bar"
  }
}
```

</details>

### Simple Command with Options

```ts
import { build } from 'p-args'

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
```

<details>

<summary>Show output</summary>

```sh
❯ npx tsx examples/simple-options.ts --ip=192.168.178.70 --port=4000

# todo
```

</details>

## License

This project is under MIT license.
