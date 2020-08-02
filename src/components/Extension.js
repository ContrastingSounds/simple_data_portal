import React from 'react'
import { Heading } from '@looker/components'

class ExtensionInternal extends React.Component {
  render() {
    return (
      <Heading fontWeight='bold'>Simple Extension</Heading>
    )
  }
}

export const Extension = ExtensionInternal