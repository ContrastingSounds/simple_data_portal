import React, { useContext, useState } from 'react'
import styled from "styled-components";
import {ExtensionContext} from '@looker/extension-sdk-react'

import { 
  Heading, 
  Flex, 
  FlexItem,
  MenuList,
  MenuGroup,
  MenuItem,
  Spinner,
  theme 
} from '@looker/components'
import SidebarToggle from './SidebarToggle'


let headerTitle = 'Looker Data Platform'
let headerColor = theme.colors.palette.white
let headerBackground = theme.colors.palette.purple400
let headerImage = 'https://berlin-test-2.s3-us-west-1.amazonaws.com/spirals.png'
let configUrl = ''
let boardId = 2

// Config notes
// Add a user attribute 'portal_board'. Data Type: Number. User Access: View. Hide: No. Set default board id.

const Extension = () => {
  const context = useContext(ExtensionContext)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [board, setBoard] = useState({})
  const [user, setUser] = useState({})
  const [renderBoard, setRenderBoard] = useState(false)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const menuGroups = []

  console.log('ExtensionContext:', context)

  // TODO
  // + set up a portal_board user attribute
  // + default to the Analytics Homepage board (and unset that board as homepage)
  // + set a default value
  // - set a user value
  // + function to find the portal_board attribute id
  // + function to get board id for the user's assigned portal_board
  // + function to take menu item's icon from the board section description
  // - onClick function to load dashboard, look
  // - if an explore icon is used, load the explore behind the look 
  // - try setting up Google auth
  // + take a cloud bucket as a setting
  // - function to use logo, html pages stored in bucket

  const getUser = async () => {
    try {
      const userDetails = await context.core40SDK.ok(
        context.core40SDK.me()
      )
      setUser(userDetails)
    } catch (error) {
      console.log('failed to get user', error)
    }
  }

  const getBoardId = async () => {
    let portalBoardAttributeId = null
    try {
      const userAttributes = await context.core40SDK.ok(
        context.core40SDK.all_user_attributes({fields: ['id', 'name']})
      )
      userAttributes.forEach(attribute => {
        if (attribute.name === 'portal_board') {
          portalBoardAttributeId = attribute.id
          console.log('portalBoardAttributeId', portalBoardAttributeId)
        }
      })
    } catch (error) {
      console.log('failed to get id of portal_board attribute', error)
    }
    
    if (portalBoardAttributeId) {
      try {
        const attributeValue = await context.core40SDK.ok(
          context.core40SDK.user_attribute_user_values({
            user_id: user.id,
            user_attribute_ids: [portalBoardAttributeId],
          })
        )
        console.log('attributeValue', attributeValue)
        boardId = parseInt(attributeValue[0].value)
      } catch (error) {
        console.log('failed to get id of portal_board attribute', error)
      }
    }
  }

  const getBoard = async () => {
    try {
      const boardDetails = await context.core40SDK.ok(
        context.core40SDK.board(boardId)
      )
      setBoard(boardDetails)
      setRenderBoard(true)
    } catch (error) {
      console.log('failed to get board', error)
      setRenderBoard(true)
    }
  }

  getUser()
    .then(getBoardId)
    .then(getBoard)
    .then(() => {
      setRenderBoard(true)
      console.log('User:', user)
      console.log('Board:'. board)
    })

  if (board.title) {
    headerTitle = board.title
  }

  if (typeof board.description !== 'undefined') {
    const descriptionLines = board.description.split('\n')
    console.log('descriptionLines', descriptionLines)

    descriptionLines.forEach(line => {
      var tags = line.split(':')
      if (tags.length === 2) {
        switch(tags[0]) {
          case 'color':
            headerColor = tags[1]
            break
          case 'background':
            headerBackground = tags[1]
            break
          case 'image':
            headerImage = tags[1]
            break
          case 'config':
            configUrl = tags[1]
            break
        }
      }
    })
  }
  
  if (typeof board.board_sections !== 'undefined') {
    board.board_sections.forEach((board_section, i) => {
      const group = {
        key: i,
        title: board_section.title,
        items: []
      }
      const icons = board_section.description.split(',')
      board_section.board_items.forEach((item, j) => {
        group.items.push({
          key: j,
          title: item.title,
          url: item.url,
          icon: icons[j] ? icons[j] : 'Dashboard'
        })
      })
      menuGroups.push(group)
    })
  }

  console.log('menuGroups:', menuGroups)

  if (renderBoard) {
    return (
      <>
        <PageHeader
            color={headerColor} 
            backgroundColor={headerBackground}
            image={headerImage}
        >
          <FlexItem>
            <Heading as="h1" fontWeight='bold'>{headerTitle}</Heading>
          </FlexItem>
        </PageHeader>
  
        <PageLayout open={sidebarOpen}>
          <LayoutSidebar>
            {sidebarOpen &&
              <MenuList>
                {menuGroups.map(group => (
                  <MenuGroup key={group.key} label={group.title}>
                    {group.items.map(item => <MenuItem key={item.key} icon={item.icon}>{item.title}</MenuItem>)}
                  </MenuGroup>
                ))}
              </MenuList>
            }
          </LayoutSidebar>
  
          <SidebarDivider open={sidebarOpen}>
            <SidebarToggle
              isOpen={sidebarOpen}
              onClick={toggleSidebar}
              headerHeigh="114px"
            />
          </SidebarDivider>
  
          <PageContent></PageContent>
  
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
  background-color: ${props => props.backgroundColor};
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: 836px 120px;
  padding: ${theme.space.large};
  background-image: url(${props => props.image});
  h1 {
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
