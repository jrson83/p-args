#!/usr/bin/env node
import { readdir } from 'node:fs/promises'
import { cpus } from 'node:os'
import { basename, join } from 'node:path'
import { run } from 'node:test'
import { spec as Spec } from 'node:test/reporters'
import { URL } from 'node:url'

const __filename = new URL('', import.meta.url).pathname
const __dirname = new URL('.', import.meta.url).pathname

const spec = new Spec()

const files = await resolveTestFiles()

const testStream = run({
  files,
  timeout: 60 * 1000,
  concurrency: cpus().length,
  watch: false,
})

testStream
  .on('test:fail', () => {
    process.exitCode = 1
  })
  .compose(spec)
  .pipe(process.stdout)

async function resolveTestFiles(root = __dirname) {
  const files: string[] = []

  try {
    const contents = await readdir(root, {
      withFileTypes: true,
      recursive: true,
    })

    const filteredContents = contents.filter(
      (content) =>
        !content.isDirectory() &&
        content.name.endsWith('.test.ts') &&
        content.name !== basename(__filename)
    )

    files.push(
      ...filteredContents.map((content) => join(content.path, content.name))
    )

    return files
  } catch (err) {
    console.error('Error reading directory:', err)

    return process.exit(1)
  }
}
