import React from 'react'
import { Resource } from '../../data'
import { Link, Typography, Box, List, ListItem } from '../theme'

type Props = {
  resources: Array<Resource>
}

const resourcesListTestId = 'resources.list'
const resourcesListItemTestId = 'resources.list.item'
const resourcesListItemLinkTestId = 'resources.list.item.link'
const resourcesListItemTitleTestId = 'resources.list.item.title'
const resourcesListItemSourceTestId = 'resources.list.item.source'

const ResourcesList = ({ resources }: Props) => {
  return (
    <Box data-testid={resourcesListTestId}>
      <List>
        {resources.map((resource) => (
          <ListItem
            marker={
              <ListItem.Checkbox
                inputProps={{ 'aria-label': resource.title }}
              />
            }
            key={resource.url}
          >
            <Box data-testid={resourcesListItemTestId}>
              <Link
                data-testid={resourcesListItemLinkTestId}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
              >
                <Typography
                  data-testid={resourcesListItemSourceTestId}
                  variant="overline"
                  color="text.secondary"
                >
                  {resource.source}
                </Typography>
                <Typography
                  data-testid={resourcesListItemTitleTestId}
                  component="span"
                  variant="h6"
                  display="block"
                  gutterBottom
                >
                  {resource.title}
                </Typography>
              </Link>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default ResourcesList
