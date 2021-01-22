/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, { useCallback, useContext, useState } from 'react'

import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { EmbedContainer } from './EmbedContainer'
import { LookerExtensionSDK } from '@looker/extension-sdk'


export const EmbedDashboard = ({ id, type, filters, setFilters }) => {
  const [dashboard, setDashboard] = useState()
  const context = useContext(ExtensionContext)

  const canceller = (event) => {
    console.log('%c canceller:', 'color: green; font-weight:bold', event)
    return { cancel: !event.modal }
  }

  const filtersUpdated = (event) => {
    if (event?.dashboard?.dashboard_filters) {
      setFilters({...filters, ...event.dashboard.dashboard_filters})
    }
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
        // const db = LookerEmbedSDK.createDashboardWithUrl('https://pebl.dev.looker.com/embed/dashboards-next/33?embed_domain=https%3A%2F%2Fpebl.dev.looker.com&sdk=2&sandboxed_host=true&Region=&Account+ID=8261&Category=&tile_id136.trans.category=Household')
        if (type === "next") {
          db.withNext()
        }
        db.appendTo(el)
          .withClassName('looker-dashboard')
          .withFilters(filters)

          // @looker/embed-sdk/src/types.ts - export interface LookerEmbedEventMap
          .on('dashboard:run:start', canceller)
          .on('dashboard:run:complete', canceller)

          .on('dashboard:tile:start', canceller)
          .on('dashboard:tile:complete', canceller)
          .on('dashboard:tile:download', canceller)
          .on('dashboard:tile:explore', canceller)
          .on('dashboard:tile:view', canceller)
        
          .on('drillmenu:click', canceller)
          .on('drillmodal:explore', canceller)
        
          .on('explore:run:start', canceller)
          .on('explore:run:complete', canceller)
        
          .on('look:run:start', canceller)
          .on('look:run:complete', canceller)
        
          .on('page:changed', canceller)

          // Handled event
          .on('page:properties:changed', (e) => resizeContent(e.height))
          .on('dashboard:filters:changed', filtersUpdated)

          .build()
          .connect()
          .catch((error) => {
            console.error('Connection error', error)
          })
        
        el.addEventListener('message', function(event) {
          console.log('Event Listener:', JSON.parse(event.data));
          if (event.source === document.getElementsByClassName('looker-dashboard')[0].contentWindow) {
            console.log('Event Listener:', JSON.parse(event.data));
          }
        });
      }
    },
    [id, type]
  )

  return <EmbedContainer id='looker-embed' ref={embedCtrRef} />
}