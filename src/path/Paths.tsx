import React from 'react'
import Link from 'next/link'
import { Paths } from '../../data'
import { List, H2 } from '../ui'

type Props = {
  paths: Paths
}

const PathsList = ({ paths }: Props) => {
  return (
    <List>
      {Object.entries(paths).map(([pathName, path]) => (
        <Link key={pathName} href={`/paths/${pathName}`}>
          <a>The {path.title} learning path</a>
        </Link>
      ))}
    </List>
  )
}

export default PathsList
