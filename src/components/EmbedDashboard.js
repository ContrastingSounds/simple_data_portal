import React, { useCallback, useContext } from 'react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { EmbedContainer } from './EmbedContainer'


export const EmbedDashboard = ({ id, type }) => {
  const context = useContext(ExtensionContext)

  const canceller = (event) => {
    return { cancel: !event.modal }
  }

  const resizeContent = (height) => {
    var elem = document.getElementById('looker-embed').firstChild
    elem.setAttribute('height', height)
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = context?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        context.extensionSDK.track('extension.data_portal.load_dashboard', 'dashboard-component-rendered')
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        const db = LookerEmbedSDK.createDashboardWithId(id)
        if (type==="next") {
          db.withNext()
        }
        db.appendTo(el)
          .withClassName('looker-dashboard')
          .on('page:properties:changed', (e) => resizeContent(e.height))
          .on('drillmenu:click', canceller)
          .on('drillmodal:explore', canceller)
          .on('dashboard:tile:explore', canceller)
          .on('dashboard:tile:view', canceller)
          .build()
          .connect()
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    },
    [id, type]
  )
  console.log(id)
  return <EmbedContainer id='looker-embed' ref={embedCtrRef} />
}