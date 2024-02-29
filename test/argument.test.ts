import { deepStrictEqual, throws } from 'node:assert/strict'
import { describe, it } from 'node:test'

import { argument } from '../src/argument'

describe('argument', () => {
  it('should throw errors for empty or non-object data', () => {
    throws(() => {
      // @ts-expect-error - inserted object must be a non-empty object
      argument(undefined)
    }, new Error('Argument must be a non-empty object.'))

    throws(() => {
      // @ts-expect-error - inserted object must be a non-empty object
      argument(null)
    }, new Error('Argument must be a non-empty object.'))

    throws(() => {
      // @ts-expect-error - inserted object must have all required properties
      argument(42)
    }, new Error('Argument must be a non-empty object.'))
  })

  it('should throw errors for invalid data', () => {
    throws(() => {
      argument({
        'invalid-array': {
          // @ts-expect-error - expected default `string` but got `string[]`
          default: ['content'],
        },
      })
    }, new Error(
      "Invalid type for 'default' property in argument 'invalid-array'. Expected 'string' but got 'object'."
    ))

    throws(() => {
      argument({
        'still-invalid-array': {
          multiple: false,
          // @ts-expect-error - expected default `string` but got `string[]`
          default: ['content'],
        },
      })
    }, new Error(
      "Invalid type for 'default' property in argument 'still-invalid-array'. Expected 'string' but got 'object'."
    ))
  })

  it('should accept valid data', () => {
    const validData = argument({
      'default-string': {
        default: 'content',
      },
      'still-default-string': {
        multiple: false,
        default: 'content',
      },
      'required-default-string': {
        required: true,
        default: 'content',
      },
      'still-required-default-string': {
        multiple: false,
        required: true,
        default: 'content',
      },
      'required-only': {
        required: true,
      },
      'multiple-only': {
        multiple: true,
      },
      'multiple-array': {
        multiple: true,
        default: ['content', 'content'],
      },
      'multiple-required': {
        multiple: true,
        required: true,
      },
      'multiple-required-default-array': {
        multiple: true,
        required: true,
        default: ['content', 'content'],
      },
    })

    deepStrictEqual(validData, {
      'default-string': { default: 'content' },
      'still-default-string': { multiple: false, default: 'content' },
      'required-default-string': { required: true, default: 'content' },
      'still-required-default-string': {
        multiple: false,
        required: true,
        default: 'content',
      },
      'required-only': { required: true },
      'multiple-only': { multiple: true },
      'multiple-array': { multiple: true, default: ['content', 'content'] },
      'multiple-required': { multiple: true, required: true },
      'multiple-required-default-array': {
        multiple: true,
        required: true,
        default: ['content', 'content'],
      },
    })
  })
})
