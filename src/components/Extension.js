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
import qs from 'query-string';
import { ExtensionContext } from '@looker/extension-sdk-react'
import { EmbedDashboard } from './EmbedDashboard'
import { EmbedLook } from './EmbedLook'
import { AdminPage } from './AdminPage'

import { 
  Heading, 
  Flex, 
  FlexItem,
  Menu,
  MenuDisclosure,
  MenuList,
  MenuGroup,
  MenuItem,
  Paragraph,
  Spinner,
  theme 
} from '@looker/components'
import SidebarToggle from './SidebarToggle'

const placeholderLogo = 'data:image/png;base64,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'

/**
 * Builds the simple data portal extension
 * 
 * useEffects in order:
 * 1. Get user
 * 2. Get list of boards
 *      Get the id of the portal_boards user attribute
 *      Get the user's values for that attribute, split the string of IDs into an array
 * 3. Get the details for each of those boards
 *      Set the first board as the selected board
 * 4. Populate the main board object with the properties of the selected board
 *      Set render to true
 * 5. history.push with filter values
 */
const Extension = ( { route, routeState } ) => {
  const context = useContext(ExtensionContext)
  const sdk = context.core40SDK
  let history = useHistory();
  let location = useLocation();

  const [config, setConfig] = useState({})
  const [user, setUser] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [boardIds, setBoardIds] = useState([])
  const [boards, setBoards] = useState([])
  const [board, setBoard] = useState({})
  const [renderBoard, setRenderBoard] = useState(false)
  const [filters, setFilters] = useState(qs.parse(location.search))
  const [canAdminister, setCanAdminister] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const menuGroups = [];

  useEffect(() => {
    const initialize = async () => {
      try {
        let configuration = await context.extensionSDK.getContextData()
        setConfig(JSON.parse(configuration || "{}"))
      } catch (error) {
        console.log('failed to load configuration', error)
      }
    }

    initialize();
    getUser();
  }, [])

  useEffect(() => {
    if (user && user.id) {
      getBoardIds();
    }
  }, [user])

  useEffect(() => {
    if (boardIds.length > 0) {
      getBoards()
    }
  }, [boardIds])

  useEffect(() => {
    if (boards.length > 0) {
      setBoard({...boards[0]})
      setRenderBoard(true)
    }
  }, [boards])

  useEffect(() => {
    if (menuGroups.length > 0) {
      history.push({
        pathname: menuGroups[0].items[0].url,
        search: ''
      })
    }
  }, [board])

  useEffect(()=>{
    if (filters) {
      history.push({
        pathname: location.pathname,
        search: qs.stringify(filters)
      })
    }
  }, [filters])

  const getUser = async () => {
    try {
      const userDetails = await sdk.ok(
        sdk.me()
      )
      setUser(userDetails)
      const userRoles = await sdk.ok(sdk.user_roles(
        {
          user_id: userDetails.id,
          fields: 'id,name',
          direct_association_only: true
        })
      )
      if (typeof userRoles.find(role => role.name === 'Admin') !== undefined) {
        setCanAdminister(true)
      }
    } catch (error) {
      console.log('failed to get user', error)
    }
  }

  const getBoardIds = async () => {
    let portalBoardAttributeId = null
    try {
      const userAttributes = await sdk.ok(
        sdk.all_user_attributes({fields: ['id', 'name']})
      )
      portalBoardAttributeId = userAttributes.find(attr => attr.name === 'portal_boards').id
    } catch (error) {
      console.log('portal_boards attribute not available')
    }
    
    if (portalBoardAttributeId) {
      try {
        const attributeValue = await sdk.ok(
          sdk.user_attribute_user_values({
            user_id: user.id,
            user_attribute_ids: [portalBoardAttributeId],
          })
        )
        if (attributeValue && attributeValue.length > 0 && attributeValue[0].value.length > 0 ) {
          setBoardIds([...attributeValue[0].value.split(',')])
        } else {
          const allBoards = await sdk.ok(
            sdk.all_boards('id,title,can')
          )
          const firstBoard = allBoards.find(board => board.can.show)
          setBoardIds([firstBoard.id])
        }
      } catch (error) {
        console.log('failed to get list of board ids', error)
      }
    } else {
      try {
        const allBoards = await sdk.ok(
          sdk.all_boards('id,title,can')
        )
        const firstBoard = allBoards.find(board => board.can.show)
        setBoardIds([firstBoard.id])
      } catch (error) {
        console.log('failed to get a default board for display', error)
      }
    }
  }

  const getBoards = async () => {
    for (const boardId of boardIds) {
      const boardDetails = await sdk.ok(
        sdk.board(boardId)
      )
      setBoards(boards => [...boards, boardDetails])
    }
  }

  const updateConfig = async (updatedConfig) => {
    await context.extensionSDK.saveContextData(JSON.stringify(updatedConfig))
    setConfig(updatedConfig)
  }
  
  board?.section_order?.forEach(ref => {
    const board_section = board.board_sections.find(board_section => board_section.id === ref)
    const group = {
      key: ref,
      title: board_section.title,
      items: []
    }
    const icons = board_section.description.split(',')
    board_section.item_order.forEach((ref, idx) => {
      const item = board_section.board_items.find(item => item.id === ref)
      group.items.push({
        key: ref,
        title: item.title,
        type: item.url.split('/')[1],
        url: item.url,
        icon: icons[idx] ? icons[idx] : 'Dashboard'
      })
    })
    menuGroups.push(group)
  })

  if (renderBoard) {
    return (
      <>
        <PageHeader
            color={config.color || theme.colors.palette.white} 
            backgroundColor={config.backgroundColor || theme.colors.palette.blue400}
        >
          <FlexItem width="40%">
            <Menu>
              <MenuDisclosure tooltip="Select board">
                <Heading as="h3" fontWeight='bold'>{board.title || 'Looker Data Platform'}</Heading>
              </MenuDisclosure>
              <MenuList>
                {boards.map(board => {
                  return (
                    <MenuItem 
                      onClick={() => setBoard(boards.find(sourceBoard => sourceBoard.id === board.id ))}
                      icon="BrowseTable"
                      key={board.id}
                    >
                      {board.title}
                    </MenuItem>
                  )
                })}
              </MenuList>
            </Menu>
          </FlexItem>
          <FlexItem>
            {config.logoUrl && config.logoUrl.length > 0 && <img src={config.logoUrl} alt="logo" height="40px" />}
          </FlexItem>
          <FlexItem width="40%" onClick={() => history.push({ pathname: '/admin', search: '' }) }>
            {canAdminister && <Paragraph textAlign="right" fontSize="xsmall">Configure Portal</Paragraph>}
          </FlexItem>
        </PageHeader>
  
        <PageLayout open={sidebarOpen}>
          <LayoutSidebar>
            {sidebarOpen &&
              <MenuList>
                {menuGroups.map(group => (
                  <MenuGroup key={group.key} label={group.title}>
                    {group.items.map(item => {
                      return (
                      <Link 
                        key={item.key}  
                        to={{
                          pathname: item.url, 
                          search: location.search
                        }}
                      >
                        <MenuItem 
                          current={(location.pathname===item.url) ? true : false}
                          icon={item.icon}
                        >{item.title}</MenuItem>
                      </Link>
                      )}
                    )}
                  </MenuGroup>
                ))}
              </MenuList>
            }
          </LayoutSidebar>
  
          <SidebarDivider open={sidebarOpen}>
            <SidebarToggle
              isOpen={sidebarOpen}
              onClick={toggleSidebar}
              headerHeight="40px"
            />
          </SidebarDivider>
  
          <PageContent>
            <Switch>
              <Redirect exact from='/' to={menuGroups[0].items[0].url} />
              <Route path='/dashboards-next/:ref' render={props => 
                <EmbedDashboard 
                  id={props.match.params.ref} 
                  type="next" 
                  {...{filters, setFilters}}
                />
              } />
              <Route path='/dashboards/:ref' render={props => 
                <EmbedDashboard 
                  id={props.match.params.ref} 
                  type="legacy" 
                  {...{filters, setFilters}}
                />
              } />
              <Route path='/looks/:ref' render={props => 
                <EmbedLook 
                  id={props.match.params.ref} 
                  {...{filters, setFilters}}
                />
              } />
              <Route path='/admin' render={props =>
                <AdminPage 
                  canAdminister={canAdminister}
                  config={config}
                  updateConfig={updateConfig}
                />
              } />
            </Switch>
          </PageContent>
  
        </PageLayout>
      </>
    )
  } else {
    return (
      <Flex width='100%' height='90%' alignItems='center' justifyContent='center'>
        <Spinner color='black' />
      </Flex>
    )
  }
  
}


const PageHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: ${props => props.backgroundColor};
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: 836px 50px;
  padding: ${theme.space.xsmall};
  h3 {
    color: ${props => props.color};
  }
`

const PageLayout = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: ${props =>
    props.open ? "16.625rem 0 1fr" : "1.5rem 0 1fr"};
  grid-template-areas: "sidebar divider main";
  position: relative;
`

const PageContent = styled.div`
  grid-area: main;
  position: relative;
`

const LayoutSidebar = styled.aside`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16.625rem;
  grid-area: sidebar;
  z-index: 0;
`

const SidebarDivider = styled.div`
  transition: border 0.3s;
  border-left: 1px solid
    ${props =>
      props.open ? theme.colors.palette.charcoal200 : "transparent"};
  grid-area: divider;
  overflow: visible;
  position: relative;
  &:hover {
    border-left: 1px solid
      ${props =>
        props.open
          ? theme.colors.palette.charcoal300
          : theme.colors.palette.charcoal200};
  }
`

export default Extension
