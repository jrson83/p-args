import type { ParseArgsArgumentsConfig, Validate } from './types'

/**
 * Validates and ensures consistency in the types of default values based on the 'multiple' property for each argument.
 * Throws an error if the types do not match the expected structure.
 *
 * @param {Validate<T>} data - The arguments configuration to be validated.
 * @returns {Validate<T>} The validated arguments configuration.
 * @throws {Error} Error if the 'default' property type mismatches with the 'multiple' property.
 */
export const argument = <const T extends ParseArgsArgumentsConfig>(
  data: Validate<T>
): Validate<T> => {
  if (!data || typeof data !== 'object') {
    throw new Error('Argument must be a non-empty object.')
  }

  for (const key in data) {
    const arg = data[key]

    /**
     * If 'multiple' is 'true', the validation error will be thrown only if 'default' is defined and not an array.
     */
    if (
      arg.multiple &&
      arg.default !== undefined &&
      !Array.isArray(arg.default)
    ) {
      throw new Error(
        `Invalid type for 'default' property in argument '${key}'. Expected 'string[]' but got '${typeof arg.default}'.`
      )
    }

    /**
     * If 'multiple' is 'false', the validation error will be thrown only if 'default' is defined and not a string.
     */
    if (
      !arg.multiple &&
      typeof arg.default !== 'string' &&
      arg.default !== undefined
    ) {
      throw new Error(
        `Invalid type for 'default' property in argument '${key}'. Expected 'string' but got '${typeof arg.default}'.`
      )
    }
  }

  /**
   * The function returns the validated arguments configuration.
   * Note: It should infer the type without explicitly specifying 'as Validate<T>'.
   */
  return data
}
