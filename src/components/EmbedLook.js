import React, { useCallback, useContext } from 'react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { EmbedContainer } from './EmbedContainer'
import { ExtensionContext } from '@looker/extension-sdk-react'

export const EmbedLook = ({ id }) => {
  const context = useContext(ExtensionContext)

  const embedCtrRef = useCallback(
    (el) => {
      console.log('embedCtrRef() id', id)
      const hostUrl = context?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        context.extensionSDK.track('extension.data_portal.load_look', 'look-component-rendered')
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        LookerEmbedSDK.createLookWithId(id)
          .appendTo(el)
          .withClassName('looker-look')
          .build()
          .connect()
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    }, [id])

  return <EmbedContainer id='looker-embed' ref={embedCtrRef} />
}