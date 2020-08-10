import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Extension from './components/Extension'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { ComponentsProvider, Flex, Spinner } from '@looker/components'

window.addEventListener('DOMContentLoaded', async (event) => {
  const root = document.createElement('div')
  document.body.appendChild(root)

  const loading = (
    <Flex width='100%' height='90%' alignItems='center' justifyContent='center'>
      <Spinner color='black' />
    </Flex>
  )

  ReactDOM.render(
    <ExtensionProvider loadingComponent={loading} requiredLookerVersion='>=7.12.0'>
      <ComponentsProvider>
        <Extension />
      </ComponentsProvider>
    </ExtensionProvider>,
    root
  )
})