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

import React, { useCallback, useContext } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { EmbedContainer } from './EmbedContainer'
import { ExtensionContext } from '@looker/extension-sdk-react'

import { logUrl, parseExploreUrl } from '../utils/utils'

export const EmbedExplore = ({ model, explore, filters, setFilters }) => {
  const context = useContext(ExtensionContext)

  const url = useLocation()
  const history = useHistory()
  // console.log('EmbedExplore() url', url)
  const search = useLocation().search
  // console.log('EmbedExplore() model:', model)
  // console.log('EmbedExplore() explore:', explore)
  // console.log('EmbedExplore() params:', search)

  const logEvent = (event) => {
    console.log('%c logEvent:', 'color: red; font-weight:bold', event)
    return { cancel: !event.modal }
  }

  // drillmenu:click
  const drillMenuClick = (event) => {
    console.log('%c drillMenu:', 'color: green; font-weight:bold', event)
    const exploreDefinition = parseExploreUrl(event.url.replace('/embed/','/'))
    if (event.modal) {
      console.log('launch modal...')
      history.push(exploreDefinition.url)
      return { cancel: true }
    } else {
      history.push(exploreDefinition.url)
      return { cancel: true }
    }
  }

  const filtersUpdated = (event) => {
    if (event?.dashboard?.dashboard_filters) {
      setFilters({...filters, ...event.dashboard.dashboard_filters})
    }
  }

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = context?.extensionSDK?.lookerHostData?.hostUrl
      if (el && hostUrl) {
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        const stub = `/embed/query/${model}/${explore}`
        const embedFlags = `&embed_domain=${hostUrl}&sdk=2&sandboxed_host=true`
        // const layoutFlags = '&toggle=dat,pik,vis' // explores only, not /embed/query
        
        // console.log('embed url - search:', search)
        const embedUrl = hostUrl + stub + search + embedFlags
        LookerEmbedSDK.createExploreWithUrl(embedUrl)
          .appendTo(el)
          .withClassName('looker-explore')

          .on('explore:ready', logEvent)
          .on('explore:run:start', logEvent)
          .on('explore:run:complete', logEvent)
          .on('explore:state:changed', logEvent)
          .on('drillmodal:explore', logEvent)
          .on('page:changed', logEvent)

          .on('drillmenu:click', drillMenuClick)

          .build()
          .connect()
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    }, [url])

  return <EmbedContainer id='looker-embed' ref={embedCtrRef} />
}