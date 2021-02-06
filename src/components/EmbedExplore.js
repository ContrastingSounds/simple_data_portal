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
import { useLocation } from 'react-router-dom'
import { LookerEmbedSDK } from '@looker/embed-sdk'
import { EmbedContainer } from './EmbedContainer'
import { ExtensionContext } from '@looker/extension-sdk-react'

export const EmbedExplore = ({ model, explore, filters, setFilters }) => {
  const context = useContext(ExtensionContext)

  const url = useLocation()
  console.log('EmbedExplore() url', url)
  const search = useLocation().search
  console.log('EmbedExplore() model, explore, params:', model, explore, search)

  const logEvent = (event) => {
    console.log('%c logEvent:', 'color: red; font-weight:bold', event)
    return { cancel: !event.modal }
  }

  const filtersUpdated = (event) => {
    if (event?.dashboard?.dashboard_filters) {
      setFilters({...filters, ...event.dashboard.dashboard_filters})
    }
  }

  // const db = LookerEmbedSDK.createDashboardWithUrl('https://pebl.dev.looker.com/embed/dashboards-next/33?embed_domain=https%3A%2F%2Fpebl.dev.looker.com&sdk=2&sandboxed_host=true&Region=&Account+ID=8261&Category=&tile_id136.trans.category=Household')
  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = context?.extensionSDK?.lookerHostData?.hostUrl
      console.log('hostUrl', hostUrl)
      if (el && hostUrl) {
        el.innerHTML = ''
        LookerEmbedSDK.init(hostUrl)
        // https://pebl.dev.looker.com/explore/pebl/trans?qid=oV43HNuS6wkgDjklAPKK9a&origin_space=1&toggle=vis
        // LookerEmbedSDK.createExploreWithUrl('https://pebl.dev.looker.com/explore/pebl/trans?qid=oV43HNuS6wkgDjklAPKK9a&origin_space=1&toggle=vis')
        const stub = `/embed/query/${model}/${explore}`
        const testSearch = '?qid=kOil1noYOHUCF662bcCQS9&origin_space=1'
        const embedFlags = `&embed_domain=${hostUrl}&sdk=2&sandboxed_host=true`
        // const layoutFlags = '&toggle=dat,pik,vis' // explores only, not /embed/query
        
        const testUrl = hostUrl + stub + testSearch + embedFlags
        console.log('testUrl', testUrl)
        LookerEmbedSDK.createExploreWithUrl(testUrl)
          .appendTo(el)
          .withClassName('looker-explore')
          .on('explore:ready', logEvent)
          .on('explore:run:start', logEvent)
          .on('explore:run:complete', logEvent)
          .on('explore:state:changed', logEvent)
          .on('drillmenu:click', logEvent)
          .on('drillmodal:explore', logEvent)
          .on('page:changed', logEvent)
          .build()
          .connect()
          .catch((error) => {
            console.error('Connection error', error)
          })
      }
    }, [url])

  return <EmbedContainer id='looker-embed' ref={embedCtrRef} />
}