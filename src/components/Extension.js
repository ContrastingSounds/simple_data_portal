import React from 'react'
import styled from "styled-components";
import { 
  Heading, 
  Flex, 
  FlexItem,
  Box,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  theme 
} from '@looker/components'

const headerTextColor = theme.colors.palette.white
const headerBackground = theme.colors.palette.purple400
const headerImage = 'https://berlin-test-2.s3-us-west-1.amazonaws.com/spirals.png'


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
`;


class ExtensionInternal extends React.Component {
  render() {
    return (
      <>
        <PageHeader>
          <FlexItem>
            <Heading as="h1" fontWeight='bold'>Simple Extension</Heading>
          </FlexItem>
        </PageHeader>
        <Box>
          <Sidebar>
            <SidebarGroup>
              <SidebarItem>Item One</SidebarItem>
              <SidebarItem>Item Two</SidebarItem>
            </SidebarGroup>
          </Sidebar>
        </Box>
      </>
    )
  }
}


export const Extension = ExtensionInternal