import React from 'react'
import styled from "styled-components";
import { Heading, Flex, FlexItem } from '@looker/components'

headerTextColor = theme.colors.palette.white
headerBackground = theme.colors.palette.purple400
headerImage = 'https://berlin-test-2.s3-us-west-1.amazonaws.com/spirals.png'


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
      <PageHeader>
        <FlexItem>
          <Heading fontWeight='bold'>Simple Extension</Heading>
        </FlexItem>
      </PageHeader>
    )
  }
}

export const Extension = ExtensionInternal