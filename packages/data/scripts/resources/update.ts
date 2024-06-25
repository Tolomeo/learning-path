// import * as fs from 'node:fs'
// import * as path from 'node:path'
// import * as util from 'node:util'
import * as readline from 'node:readline'
import open from 'open'
import Resource from '../../src/model/resource'
// import { listPaths, readPath } from './paths/read'
// import pathsData from '../src/store/paths'
// import { listResources, readResources } from './resources/read'

/* const {
  positionals: [],
} = util.parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
}) */

/* if (!url) {
  console.error('A resource url must be specified')
  console.error(
    'For example: tsx scripts/resources/update.ts "http://www.resource-url.com"\n',
  )
  process.exit(1)
} */
type Nullable<T> = T | null

const input = (question: string): Promise<Nullable<string>> => {
  const describedQuestion = `\n${question}\n[:q] exit\n> `
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(describedQuestion, (answer) => {
      rl.close()

      if (answer.trim() === ':q') resolve(null)
      else resolve(answer)
    })
  })
}

const choice = async <T extends string>(
  question: string,
  options: T[],
): Promise<Nullable<T>> => {
  const describedQuestion = `${question}\n${options
    .map((option, idx) => `[${idx + 1}] ${option}`)
    .join('\n')}`

  let optionAnswer: T | undefined

  while (!optionAnswer) {
    const answer = await input(describedQuestion)

    if (answer === null) return null

    const answerIndex = parseInt(answer, 10)

    if (isNaN(answerIndex) || !options[answerIndex - 1]) {
      console.log('\nInvalid choice')
      continue
    }

    optionAnswer = options[answerIndex - 1]
  }

  return optionAnswer
}

const getResource = async () => {
  let resource: Resource | undefined

  while (!resource) {
    const url = await input(`Enter resource url`)

    if (url === null) return null

    const urlResource = new Resource(url)
    const urlResourceExists = await urlResource.exists()

    if (!urlResourceExists) {
      console.log(`\nResource "${url}" not found`)
      continue
    }

    resource = urlResource
  }

  return resource
}

const update = async (resource: Resource) => {
  const resourceData = await resource.get()

  if (!resourceData) return

  let updating = true

  while (updating) {
    console.log(`\n${JSON.stringify(resourceData, null, 2)}`)

    const action = await choice('Choose action', ['open'])

    switch (action) {
      case 'open':
        await open(resource.url)
        break
      case null:
        updating = false
    }
  }
}

;(async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition -- the user needs to break out explicitly
  while (true) {
    const resource = await getResource()

    if (resource === null) break

    await update(resource)
  }
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
