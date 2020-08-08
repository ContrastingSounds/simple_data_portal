import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Extension from './components/Extension'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { ComponentsProvider } from '@looker/components'

window.addEventListener('DOMContentLoaded', async (event) => {
  const root = document.createElement('div')
  document.body.appendChild(root)

  ReactDOM.render(
    <ExtensionProvider requiredLookerVersion='>=7.12.0'>
      <ComponentsProvider>
        <Extension />
      </ComponentsProvider>
    </ExtensionProvider>,
    root
  )
})