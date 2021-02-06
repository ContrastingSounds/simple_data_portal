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
import qs from 'query-string'

import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { EmbedContainer } from './EmbedContainer'

import { logUrl, parseExploreUrl } from '../utils/utils'

export const EmbedDashboard = ({ id, type, filters, setFilters, history }) => {
  const [dashboard, setDashboard] = useState()
  const context = useContext(ExtensionContext)

  const logEvent = (event) => {
    console.log('%c logEvent:', 'color: red; font-weight:bold', event)
    return { cancel: !event.modal }
  }

  // drillmenu:click
  const drillMenu = (event) => {
    console.log('%c drillMenu:', 'color: green; font-weight:bold', event)
    const exploreDefinition = parseExploreUrl(event.url.replace('/embed/','/'))
    // logUrl(event.url, context)
    if (event.modal) {
      console.log('launch modal...')
      history.push(exploreDefinition.url)
      return { cancel: true }
    } else {
      history.push(exploreDefinition.url)
      return { cancel: true }
    }

  }

  // drillmodal:explore
  // dashboard:tile:explore
  const loadExplore = (event) => {
    console.log('%c loadExplore:', 'color: darkorange; font-weight:bold', event)
    // context.extensionSDK.openBrowserWindow(event.url.replace('/embed/','/'),'_blank')
    // context.extensionSDK.openBrowserWindow(event.url)
    context.extensionSDK.updateLocation(event.url.replace('/embed/','/'))
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
          .on('dashboard:run:start', logEvent)
          .on('dashboard:run:complete', logEvent)

          .on('dashboard:tile:start', logEvent)
          .on('dashboard:tile:complete', logEvent)
          .on('dashboard:tile:download', logEvent)
          // .on('dashboard:tile:explore', logEvent)
          .on('dashboard:tile:view', logEvent)
        
          // .on('drillmenu:click', logEvent)
          // .on('drillmodal:explore', logEvent)
        
          .on('explore:run:start', logEvent)
          .on('explore:run:complete', logEvent)
        
          .on('look:run:start', logEvent)
          .on('look:run:complete', logEvent)
        
          .on('page:changed', logEvent)

          // Handled events
          .on('page:properties:changed', (e) => resizeContent(e.height))
          .on('dashboard:filters:changed', filtersUpdated)

          .on('drillmenu:click', drillMenu)
          // .on('dashboard:tile:view', loadContent)

          .on('drillmodal:explore', loadExplore)
          .on('dashboard:tile:explore', loadExplore)

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