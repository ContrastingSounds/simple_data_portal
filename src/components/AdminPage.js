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

import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ExtensionContext } from '@looker/extension-sdk-react'


import { 
  Button,
  Divider,
  Flex,
  FlexItem,
  Form,
  Fieldset,
  FieldText,
  Heading, 
  InputColor,
  Link,
  List,
  ListItem,
  Paragraph
} from '@looker/components'


export const AdminPage = ({ canAdminister, config, updateConfig }) => {
  const context = useContext(ExtensionContext)
  const sdk = context.core40SDK
  let history = useHistory();

  const updateConfiguration = async (event) => {
    event.preventDefault()
    let newConfig = {
      boardList: event.target.elements.boardList.value,
      color: event.target.elements.color.value,
      backgroundColor: event.target.elements.backgroundColor.value,
      logoUrl: event.target.elements.logoUrl.value
    }
    const updatedConfig = {...config, ...newConfig}
    
    let portalBoardAttributeId = null
    try {
      const userAttributes = await sdk.ok(
        sdk.all_user_attributes({fields: ['id', 'name']})
      )
      portalBoardAttributeId = userAttributes.find(attr => attr.name === 'portal_boards').id
    } catch (error) {
      let response = await sdk.ok(sdk.create_user_attribute(
        {
          name: 'portal_boards',
          label: 'Portal Boards',
          type: 'string',
          default_value: '',
          value_is_hidden: false,
          user_can_view: true,
          user_can_edit: true
        }))
    }

    try {
      let response = await sdk.ok(
        sdk.update_user_attribute(
          portalBoardAttributeId,
          { default_value: updatedConfig.boardList }
        )
      )
    } catch (error) {
      console.log('update_user_attribute failed', error)
    }

    updateConfig(updatedConfig)
    history.push({ pathname: '/', search: ''})
  }
  
  if (canAdminister) {
    return (    
      <Flex flexDirection="column" padding="large">
        <FlexItem>
          <Heading>Configure Portal</Heading>
        </FlexItem>
        <FlexItem width="50%">
          <Form m="small" onSubmit={updateConfiguration}>
            <Fieldset legend="Data Portal Configuration Options">
              <FieldText defaultValue={config.boardList} label="Default Boards (users can set their own using the Portal Boards attribute)" name="boardList" />
              <InputColor defaultValue={config.color} label="text" name="color" />
              <InputColor defaultValue={config.backgroundColor} label="background" name="backgroundColor" />
              <FieldText defaultValue={config.logoUrl} label="Logo URL" name="logoUrl" />
            </Fieldset>
            <Button type="submit">Update configuration</Button>
          </Form>
        </FlexItem>
        <FlexItem>
          <Divider mt="medium" appearance="dark" />
          <Heading>Instructions</Heading>
          <Paragraph>
            The Data Portal is a light skin on top of your boards. A number of boards can be chosen to populate the portal. A single 
            set of boards can be used, stored as the default value for the portal_boards attribute. If a user or group has a different
            list of boards for their portal_boards user attribute, those will be used instead.
          </Paragraph>
          <Divider mt="medium" appearance="dark" />
          <List type="number">
            <ListItem>Set a list of boards</ListItem>
            <ListItem>Set text and background colours</ListItem>
            <ListItem>Choose a logo</ListItem>
            <ListItem>On each board, set icons</ListItem>
          </List>
          <Divider mt="medium" appearance="dark" />
          <Heading>Setting icons for dashboards and looks.</Heading>
          <Paragraph>
            Each dashboard and look in a board can be given an icon for the sidebar. To do so, for each section of the board, 
            put the list of icons you would like to use in the description e.g. "Dashboard,DashboardGauge,ChartBar". The icons
            are taken from the Looker Components library. The full list is here: 
            <Link href="https://components.looker.com/components/content/icon/" target="_blank"> https://components.looker.com/components/content/icon/</Link>
          </Paragraph>
        </FlexItem>
      </Flex>  
    )
  } else {
    return (
      <Flex flexDirection="column" padding="large">
        <FlexItem>
          <Heading>Admin Page - Permission Denied </Heading>
        </FlexItem>
        <FlexItem>
          This page enables Looker administrators to manage their Data Portal extension.
        </FlexItem>
      </Flex>
    )
  }
}
