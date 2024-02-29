import type { CodeError } from '../types'

/**
 * Type guard function to check if a given value is an instance of CodeError.
 * Returns true if the value is an Error instance with a 'code' property of type string.
 *
 * @param {unknown} err - The value to check for CodeError type.
 * @returns {boolean} A boolean indicating whether the value is a CodeError.
 */
export function isCodeError(err: unknown): err is CodeError {
  return err instanceof Error && 'code' in err && typeof err.code === 'string'
}
