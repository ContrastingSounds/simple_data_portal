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

import React, { useContext, useState, useEffect } from 'react'
import { Switch, Route, Link, Redirect, useHistory, useLocation } from 'react-router-dom'
import styled from "styled-components";
import { ExtensionContext } from '@looker/extension-sdk-react'


import { 
  Heading, 
  Paragraph
} from '@looker/components'



/**
 * Builds the simple data portal extension
 * 
 * useEffects in order:
 * 1. Get user
 * 2. Get list of boards
 *      Get the id of the portal_board user attribute
 *      Get the user's values for that attribute, split the string of IDs into an array
 * 3. Get the details for each of those boards
 *      Set the first board as the selected board
 * 4. Populate the main board object with the properties of the selected board
 *      Set render to true
 * 5. history.push with filter values
 */
export const AdminPage = ({ canAdminister }) => {
  // const context = useContext(ExtensionContext)
  // const sdk = context.core40SDK
  // let history = useHistory();
  // let location = useLocation();

  // const [user, setUser] = useState({})
  // const [sidebarOpen, setSidebarOpen] = useState(true)
  // const [boardIds, setBoardIds] = useState([])
  // const [boards, setBoards] = useState([])
  // // const [selectedBoardId, setSelectedBoardId] = useState()
  // const [board, setBoard] = useState({})
  // const [renderBoard, setRenderBoard] = useState(false)
  // const [filters, setFilters] = useState(qs.parse(location.search))
  // const [canAdminister, setCanAdminister] = useState(false)

  if (canAdminister) {
    return (    
      <>
        <Heading>Admin Page</Heading>
        <Paragraph>
          TBC - this page will enable Looker administrators to manage their Data Portal extension.
        </Paragraph>
      </>  
    )
  } else {
    return (
      <>
      <Heading>Admin Page - Permission Denied </Heading>
      <Paragraph>
        This page enables Looker administrators to manage their Data Portal extension.
      </Paragraph>
    </>
    )
  }
}
