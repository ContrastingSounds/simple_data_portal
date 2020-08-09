import React, { useCallback, useContext } from 'react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { EmbedContainer } from './EmbedContainer'


export const EmbedDashboard = ({ id }) => {
  const [dashboardNext, setDashboardNext] = React.useState(true)
  const [running, setRunning] = React.useState(true)
  const [dashboard, setDashboard] = React.useState()
  const extensionContext = useContext(ExtensionContext)

  const canceller = (event) => {
    return { cancel: !event.modal }
  }

  const updateRunButton = (running) => {
    setRunning(running)
  }

  const setupDashboard = (dashboard) => {
    setDashboard(dashboard)
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        console.log('el', el)
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        const db = LookerEmbedSDK.createDashboardWithId(id)
        if (dashboardNext) {
          db.withNext()
        }
        db.appendTo(el)
          .on('dashboard:loaded', updateRunButton.bind(null, false))
          .on('dashboard:run:start', updateRunButton.bind(null, true))
          .on('dashboard:run:complete', updateRunButton.bind(null, false))
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

  return <EmbedContainer id='looker-embed' ref={embedCtrRef} />
}