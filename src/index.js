import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Extension from './components/Extension'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { ComponentsProvider, Flex, Spinner } from '@looker/components'

window.addEventListener('DOMContentLoaded', async (event) => {
  const root = document.createElement('div')
  document.body.appendChild(root)

  ReactDOM.render(
    <Main/>,
    root
  )
})

const Main = () => {
  const [route, setRoute] = React.useState('')
  const [routeState, setRouteState] = React.useState()
  const loading = (
    <Flex width='100%' height='90%' alignItems='center' justifyContent='center'>
      <Spinner color='black' />
    </Flex>
  )
  const onRouteChange = (route, routeState) => {
    setRoute(route)
    setRouteState(routeState)
  }
  return <>
    <ExtensionProvider 
      loadingComponent={loading} 
      requiredLookerVersion='>=7.12.0'
      onRouteChange={onRouteChange}
    >
      <ComponentsProvider>
        <Extension route={route} routeState={routeState}/>
      </ComponentsProvider>
    </ExtensionProvider>
  </>
}