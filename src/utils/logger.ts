import { debuglog } from 'node:util'

/**
 * Creates a function, `debug`, that conditionally writes debug messages to `stderr`
 * based on the existence of the `NODE_DEBUG` environment variable.
 *
 * The debug function is created using the `debuglog` utility from the Node.js `util` module.
 * It allows logging messages with a specific section name (`p-args:cli` in this case).
 *
 * @see {@link https://nodejs.org/api/util.html#utildebuglogsection-callback}
 *
 * @example
 * ```typescript
 * debug('hello from p-args:cli [%d]', 123);
 * ```
 *
 * If this program is run with `NODE_DEBUG=p-args:cli` in the environment,
 * it will output debug messages to `stderr`. For example:
 *
 * ```shell
 * // usage with TypeScript
 * NODE_DEBUG=p-args:cli npx ts-node path/file.ts
 *
 * // usage with JavaScript
 * NODE_DEBUG=p-args:cli node path/file.js
 * ```
 *
 * P-ARGS:CLI 3245: hello from p-args:cli [123]
 *
 * @param {string} message - The debug message to log. It can include format specifiers.
 * @param {...any} params - The values to replace the format specifiers in the message.
 */
export const debug = debuglog('p-args:cli')
