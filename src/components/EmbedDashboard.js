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
import { useHistory, useLocation } from 'react-router-dom'
import qs from 'query-string';

import { LookerEmbedSDK } from '@looker/embed-sdk'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { EmbedContainer } from './EmbedContainer'
import { LookerExtensionSDK } from '@looker/extension-sdk'


export const EmbedDashboard = ({ id, type, filters, setFilters }) => {
  const [dashboard, setDashboard] = useState()
  const context = useContext(ExtensionContext)
  let history = useHistory()
  let location = useLocation()

  const clickHandler = (event) => {
    console.log('clickHandler() event:', event)
    let shouldCancel = false                                     // by default, let the click be handled
    let currentFilters = qs.parse(location.search)
    if (event.link_type === "dashboard") {                       // dashboard link, should open within extension
      let dash = event.url.substring(18).split('?')[0]

      let linkFilters = qs.parse(event.url.substring(18).split('?')[1])
      let combinedFilters = { ...currentFilters, ...linkFilters }

      let search = qs.stringify(filters)

      console.log('linkFilters', linkFilters)
      console.log('currentFilters', currentFilters)
      console.log('combinedFilters', combinedFilters)
      
      // setFilters(combinedFilters)
      history.push({
        pathname: '/dashboards/' + dash,
        search: qs.stringify(combinedFilters)
      })
      shouldCancel = true
    } else if (event.context === "table_cell" && event.target === "_blank") { // url defined in LookML, should open in new tab
      let urlStub = event.url.split('?')[0]
      let urlFilters = qs.parse(event.url.split('?')[1])
      console.log('urlStub', urlStub)
      console.log('urlFilters', urlFilters)
      console.log('currentFilters', currentFilters)
      let destination = [urlStub, qs.stringify({ ...currentFilters, ...urlFilters})].join('?')
      context.extensionSDK.openBrowserWindow(destination)
    } 
    return { cancel: shouldCancel }
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
        if (type === "next") {
          db.withNext()
        }
        db.appendTo(el)
          .withClassName('looker-dashboard')
          .withFilters(filters)
          // .withSandboxAttr('allow-same-origin','allow-scripts', 'allow-popups', 'allow-popups-to-escape-sandbox')
          //main-98b665660fcada9811ac.chunk.js:185 Blocked opening 'https://jdsports.cloud.looker.com/dashboards/13?Brand=NIKE' in a new window because the request was made in a sandboxed frame whose 'allow-popups' permission is not set.
          
          // .withSandboxAttr('allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox')
          // DOMException: Failed to execute 'add' on 'DOMTokenList': The token provided ('allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox') contains HTML space characters, which are not valid in tokens.

          // .withSandboxAttr('allow-same-origin')
          // .withSandboxAttr('allow-scripts') 
          // .withSandboxAttr('allow-popups')
          // .withSandboxAttr('allow-popups-to-escape-sandbox')
          // Blocked opening 'https://jdsports.cloud.looker.com/dashboards/13?Brand=NIKE' in a new window because the request was made in a sandboxed frame whose 'allow-popups' permission is not set.
          
          // .withSandboxAttr('allow-popups')
          // Blocked script execution in '<URL>' because the document's frame is sandboxed and the 'allow-scripts' permission is not set.

          // .withSandboxAttr('allow-scripts') 
          // .withSandboxAttr('allow-popups')
          // Uncaught (in promise) DOMException: Failed to read the 'cookie' property from 'Document': The document is sandboxed and lacks the 'allow-same-origin' flag.

          .withSandboxAttr('allow-scripts')
          .withSandboxAttr('allow-same-origin') 
          .withSandboxAttr('allow-popups')
          // Blocked opening 'https://jdsports.cloud.looker.com/dashboards/13?Brand=NIKE' in a new window because the request was made in a sandboxed frame whose 'allow-popups' permission is not set.

          .on('page:properties:changed', (e) => resizeContent(e.height))
          .on('dashboard:filters:changed', filtersUpdated)
          .on('drillmenu:click', clickHandler)
          .on('drillmodal:explore', clickHandler)
          .on('dashboard:tile:explore', clickHandler)
          .on('dashboard:tile:view', clickHandler)
          .build()
          .connect()
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    },
    [id, type]
  )

  return <EmbedContainer id='looker-embed' ref={embedCtrRef} />
}