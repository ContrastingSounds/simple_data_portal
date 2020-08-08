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
  theme 
} from '@looker/components'
import SidebarToggle from './SidebarToggle'


const headerTextColor = theme.colors.palette.white
const headerBackground = theme.colors.palette.purple400
const headerImage = 'https://berlin-test-2.s3-us-west-1.amazonaws.com/spirals.png'
const boardId = 2


const Extension = () => {
  const context = useContext(ExtensionContext)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [board, setBoard] = useState({})
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const menuGroups = []

  console.log('ExtensionContext:', context)

  const getBoard = async () => {
    try {
      const boardDetails = await context.core40SDK.ok(
        context.core40SDK.board(boardId)
      )
      setBoard(boardDetails)
    } catch (error) {
      console.log('failed to get board', error)
    }
  }

  getBoard()
    .then(console.log('Board:', board))
  
  if (typeof board.board_sections !== 'undefined') {
    board.board_sections.forEach(board_section => {
      const group = {
        title: board_section.title,
        items: []
      }
      board_section.board_items.forEach(item => {
        group.items.push({
          title: item.title,
          url: item.url,
          icon: 'Dashboard'
        })
      })
      menuGroups.push(group)
    })
  }

  console.log('menuGroups:', menuGroups)

  return (
    <>
      <PageHeader>
        <FlexItem>
          <Heading as="h1" fontWeight='bold'>Simple Extension</Heading>
        </FlexItem>
      </PageHeader>

      <PageLayout open={sidebarOpen}>
        <LayoutSidebar>
          {sidebarOpen &&
            <MenuList>
              
              {menuGroups.map(group => (
                <MenuGroup label={group.title}></MenuGroup>
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
}



{/* <MenuGroup>
<MenuItem icon="DashboardGauge">Business Pulse</MenuItem>
<MenuItem icon="DigitalMarketingApp">Brand Analytics</MenuItem>
</MenuGroup>
<MenuGroup label="Operations">
<MenuItem icon="Sync">Shipping Logistics</MenuItem>
</MenuGroup>
<MenuGroup label="Salesforce">
<MenuItem icon="Popular">All Sales Pulse</MenuItem>
</MenuGroup>
<MenuGroup label="Data Exploration">
<MenuItem icon="ExploreOutline">Orders</MenuItem>
</MenuGroup> */}

const PageHeader = styled(Flex)`
  background-color: ${headerBackground};
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: 836px 120px;
  padding: ${theme.space.large};
  background-image: url(${headerImage});
  h1 {
    color: ${headerTextColor};
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
