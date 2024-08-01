/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { open, diff, input, choice, log } from '../_utils'
import { getAllByResourceId } from '../../src/topic'
import Resource, { getByUrl } from '../../src/resource'
import Healthcheck from '../../src/healthcheck/runner'
import { ResourceData } from '../../types'

const getResource = async () => {
  let resource: Resource | undefined

  while (!resource) {
    const url = await input(`Enter resource url`)

    if (url === null) return null

    const urlResource = await getByUrl(url)

    if (!urlResource) {
      log.error(`Resource "${url}" not found`)
      continue
    }

    resource = urlResource
  }

  return resource
}

const getResourceUpdate = async (resourceData: ResourceData) => {
  const resourceUpdate = { ...resourceData }

  for (const [key, value] of Object.entries(resourceData)) {
    const valueUpdate = await input(`${key}(${value})`)

    if (!valueUpdate) continue

    resourceUpdate[key] = valueUpdate
  }

  return resourceUpdate
}

const updateResource = async (resource: Resource) => {
  let resourceUpdate = await getResourceUpdate(resource.data)

  while (true) {
    log.text(`Updated resource data:`)
    log.text(
      `${diff(log.stringify(resource.data), log.stringify(resourceUpdate))}`,
    )

    const action = await choice('Choose action', [
      'change',
      'healthcheck',
      'persist',
    ])

    switch (action) {
      case 'change':
        resourceUpdate = await getResourceUpdate(resourceUpdate)
        continue
      case 'healthcheck':
        await healthcheck(resourceUpdate, resource.healthcheck)
        continue
      case 'persist':
        try {
          await resource.change(resourceUpdate)
          log.success(`Resource update succeeded`)
        } catch (error) {
          log.error(`Resource update failed.`)
          log.error(error)
        }
        return
      case null:
        return
    }
  }
}

const healthcheck = async (
  { url, title }: ResourceData,
  strategy: NonNullable<ResourceData['healthcheck']>,
) => {
  const healthcheckRunner = new Healthcheck()
  const healthCheckResult = await healthcheckRunner.run(url, strategy)

  if (!healthCheckResult.success) {
    log.error(`Health check failed`)
    log.error(`${healthCheckResult.error}`)
    return
  }

  log.success(`Health check succeeded`)
  log.text(
    `${diff(
      log.stringify({ url, title }),
      log.stringify({
        url: healthCheckResult.url,
        title: healthCheckResult.data.title,
      }),
    )}`,
  )

  await healthcheckRunner.teardown()
}

const deleteResource = async (resource: Resource) => {
  const topics = await getAllByResourceId(resource.id)

  log.warning(
    `The resource is listed in the following topics:${topics.map(
      (t) => t.topic,
    )}`,
  )

  while (true) {
    log.inspect(resource.data)

    const action = await choice(
      `The resource occurs in the following topics:\n${topics
        .map((t) => t.topic)
        .join(', ')}`,
      ['display occurrences', 'delete resource and update topics'],
    )

    switch (action) {
      case 'display occurrences':
        topics.forEach((t) => {
          const { topic, main, resources } = t.data
          const display = {
            topic,
            main,
            resources,
          }

          log.inspect(display, {
            highlight: resource.id,
          })
        })
        break
      case 'delete resource and update topics':
        console.log('delete')
        return
      case null:
        return
    }
  }
}

const update = async (resource: Resource) => {
  while (true) {
    log.inspect(resource.data)

    const action = await choice('Choose action', [
      'open',
      'update',
      'healthcheck',
      'delete',
    ])

    switch (action) {
      case 'open':
        open(resource.url)
        break
      case 'update':
        await updateResource(resource)
        break
      case 'healthcheck':
        await healthcheck(resource.data, resource.healthcheck)
        break
      case 'delete':
        await deleteResource(resource)
      case null:
        return
    }
  }
}

;(async function main() {
  while (true) {
    const resource = await getResource()

    if (resource === null) process.exit(0)

    await update(resource)
  }
})().catch((err) => {
  log.error(err)
  process.exit(1)
})
