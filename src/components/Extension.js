import React, { useContext } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'

import { Heading } from '@looker/components'

class ExtensionInternal extends React.Component {
  extensionContext = useContext(ExtensionContext)
  
  render() {
    return (
      <Heading fontWeight='bold'>Simple Extension</Heading>
    )
  }
}

export const Extension = ExtensionInternal