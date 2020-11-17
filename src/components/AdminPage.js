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
  Flex,
  FlexItem,
  Form,
  Fieldset,
  FieldText,
  Heading, 
  InputColor
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
      portalBoardAttributeId = userAttributes.find(attr => attr.name === 'portal_board').id
    } catch (error) {
      let response = await sdk.ok(sdk.create_user_attribute(
        {
          name: 'portal_board',
          label: 'Portal Board',
          type: 'string',
          value_is_hidden: false,
          user_can_view: true,
          user_can_edit: true
        }))
    }

    try {
      console.log('set default boards to:', updatedConfig.boardList)
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
              <InputColor defaultValue={config.color} name="color" />
              <InputColor defaultValue={config.backgroundColor} name="backgroundColor" />
              <FieldText defaultValue={config.logoUrl} label="Logo URL" name="logoUrl" />
            </Fieldset>
            <Button type="submit">Update configuration</Button>
          </Form>
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
