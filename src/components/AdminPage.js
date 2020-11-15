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
  Form,
  Fieldset,
  FieldText,
  Heading, 
  Paragraph
} from '@looker/components'


export const AdminPage = ({ canAdminister }) => {
  const context = useContext(ExtensionContext)
  const sdk = context.core40SDK
  let history = useHistory();

  const updateConfiguration = async (event) => {
    event.preventDefault()
    let newConfig = {
      defaultBoardIds: event.target.elements.boardList.value,
      color: event.target.elements.color.value,
      backgroundColor: event.target.elements.backgroundColor.value,
      logoUrl: event.target.elements.logoUrl.value
    }

    let configuration = await context.extensionSDK.getContextData()
    let oldConfig = JSON.parse(configuration || "{}")

    const updatedConfig = {...oldConfig, ...newConfig}
    await context.extensionSDK.saveContextData(JSON.stringify(updatedConfig))

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
      console.log('create_user_attribute response', response)
    }

    try {
      console.log('set default boards to:', newConfig.defaultBoardIds)
      let response = await sdk.ok(
        sdk.update_user_attribute(
          portalBoardAttributeId,
          { default_value: newConfig.defaultBoardIds }
        )
      )
      console.log('update_user_attribute response', response)
    } catch (error) {
      console.log('update_user_attribute failed', error)
    }

    history.push({ pathname: '/', search: ''})
  }
  
  if (canAdminister) {
    return (    
      <>
        <Heading>Admin Page</Heading>
        <Paragraph>
          TBC - this page will enable Looker administrators to manage their Data Portal extension.
        </Paragraph>
        <Form m="small" onSubmit={updateConfiguration}>
          <Fieldset legend="Data Portal Configuration Options">
            <FieldText label="Default List of Boards" name="boardList" />
            <FieldText label="Color" name="color" />
            <FieldText label="Background Color" name="backgroundColor" />
            <FieldText label="Logo URL" name="logoUrl" />
          </Fieldset>
          <Button type="submit">Update configuration</Button>
        </Form>
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
