import React, { useCallback, useContext } from 'react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { EmbedContainer } from './EmbedContainer'
import { ExtensionContext } from '@looker/extension-sdk-react'

export const EmbedLook = ({ id }) => {
  const extensionContext = useContext(ExtensionContext)

  const embedCtrRef = useCallback(
    (el) => {
      console.log('embedCtrRef() id', id)
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        console.log('el', el)
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        LookerEmbedSDK.createLookWithId(id)
          .appendTo(el)
          .withClassName('looker-look')
          .on('look:loaded', updateRunButton.bind(null, false))
          .on('look:run:start', updateRunButton.bind(null, true))
          .on('look:run:complete', updateRunButton.bind(null, false))
          .build()
          .connect()
          .then(setupLook)
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    }, [id])

  return <EmbedContainer id='looker-embed' data-content-id={id} ref={embedCtrRef} />
}