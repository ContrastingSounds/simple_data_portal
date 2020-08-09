import React, { useCallback, useContext } from 'react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { EmbedContainer } from './EmbedContainer'


export const EmbedDashboard = ({ id }) => {
  const [dashboardNext, setDashboardNext] = React.useState(false)
  const [running, setRunning] = React.useState(true)
  const [dashboard, setDashboard] = React.useState(id)
  const extensionContext = useContext(ExtensionContext)

  console.log('EmbedDashboard called for', dashboard)

  const canceller = (event) => {
    return { cancel: !event.modal }
  }

  const updateRunButton = (running) => {
    setRunning(running)
  }

  const setupDashboard = (dashboard) => {
    setDashboard(dashboard)
  }

  const resizeContent = (height) => {
    console.log('resizeContent()', height)
    var elem = document.getElementById('looker-embed')
    elem.setAttribute('height', height)
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        console.log('el', el)
        LookerEmbedSDK.init(hostUrl)
        const db = LookerEmbedSDK.createDashboardWithId(id)
        if (dashboardNext) {
          db.withNext()
        }
        db.appendTo(el)
          .withClassName('looker-dashboard')
          .on('dashboard:loaded', updateRunButton.bind(null, false))
          .on('dashboard:run:start', updateRunButton.bind(null, true))
          .on('dashboard:run:complete', updateRunButton.bind(null, false))
          .on('page:properties:changed', (e) => resizeContent(e.height))
          .on('drillmenu:click', canceller)
          .on('drillmodal:explore', canceller)
          .on('dashboard:tile:explore', canceller)
          .on('dashboard:tile:view', canceller)
          .build()
          .connect()
          .then(setupDashboard)
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    },
    [dashboardNext]
  )

  return <EmbedContainer id='looker-embed' data-content-id={id} ref={embedCtrRef} />
}