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

const logUrl = (url, context) => {
  console.log('logUrl()', url)
  console.log('hostUrl', context?.extensionSDK?.lookerHostData?.hostUrl)
  url = new URL(url, 'https://pebl.dev.looker.com')
  const params = url.searchParams.entries()
  console.log('--link:')
  console.log('  --pathname', url.pathname)
  console.log('  --search', url.search)
  console.log('    --fields', url.searchParams.get('fields').split(','))
  for(const entry of params) {
    if (entry[0].startsWith('f[')) {
      console.log(`    ${entry[0]}: ${entry[1]}`);
    }
  }
  console.log('    --dynamic fields', JSON.parse(url.searchParams.get('dynamic_fields')))
  console.log('    --vis config', JSON.parse(url.searchParams.get('vis_config')))
  console.log('    --limit', url.searchParams.get('limit'))
}

export const EmbedDashboard = ({ id, type, filters, setFilters, history }) => {
  const [dashboard, setDashboard] = useState()
  const context = useContext(ExtensionContext)

  const canceller = (event) => {
    console.log('%c canceller:', 'color: red; font-weight:bold', event)
    return { cancel: !event.modal }
  }

  // drillmenu:click
  const drillMenu = (event) => {
    console.log('%c drillMenu:', 'color: green; font-weight:bold', event)
    if (event.modal) {
      console.log('launch modal...')
      logUrl(event.url, context)
      // context.extensionSDK.updateLocation(event.url)
      history.push('/explore/pebl/trans?qid=oV43HNuS6wkgDjklAPKK9a&origin_space=1&toggle=vis')
      return { cancel: true }
    } else {
      // context.extensionSDK.openBrowserWindow(event.url.replace('/embed/','/'),'_self')
      context.extensionSDK.updateLocation(event.url.replace('/embed/','/'))
      return { cancel: true }
    }
    
    // const is_look_or_dashboard = (['look','dashboard'].indexOf(event.link_type) > -1);
    // const is_dashboard_next = ( event.url.startsWith('/embed/dashboards-next/') || event.url.startsWith('/dashboards-next/') )
    // context.extensionSDK.openBrowserWindow(event.url.replace('/embed/','/'),'_blank')
    // context.extensionSDK.openBrowserWindow(event.url,'_blank')
    
    // return { cancel: !event.modal }
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
          .on('dashboard:run:start', canceller)
          .on('dashboard:run:complete', canceller)

          .on('dashboard:tile:start', canceller)
          .on('dashboard:tile:complete', canceller)
          .on('dashboard:tile:download', canceller)
          // .on('dashboard:tile:explore', canceller)
          .on('dashboard:tile:view', canceller)
        
          // .on('drillmenu:click', canceller)
          // .on('drillmodal:explore', canceller)
        
          .on('explore:run:start', canceller)
          .on('explore:run:complete', canceller)
        
          .on('look:run:start', canceller)
          .on('look:run:complete', canceller)
        
          .on('page:changed', canceller)

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