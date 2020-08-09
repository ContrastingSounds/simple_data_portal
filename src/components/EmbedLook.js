import React, { useCallback, useContext } from 'react'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { EmbedContainer } from './EmbedContainer'
import { ExtensionContext } from '@looker/extension-sdk-react'

export const EmbedLook = ({ id }) => {
  const [running, setRunning] = React.useState(true)
  const [look, setLook] = React.useState(id)
  const extensionContext = useContext(ExtensionContext)

  // console.log('EmbedLook() called for', look)

  const updateRunButton = (running) => {
    setRunning(running)
  }

  const setupLook = (look) => {
    setLook(look)
  }

  const embedCtrRef = useCallback((el) => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl) {
      console.log('el', el)
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      LookerEmbedSDK.createLookWithId(look)
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
  }, [])

  return <EmbedContainer id='looker-embed' data-content-id={id} ref={embedCtrRef} />
}