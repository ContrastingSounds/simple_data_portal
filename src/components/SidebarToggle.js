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

import React from "react";
import { IconButton } from "@looker/components";
import styled from "styled-components";

const SidebarToggle = ({
  isOpen,
  onClick,
  headerHeight
}) => {
  const iconName = isOpen ? "CaretLeft" : "CaretRight";

  return (
    <SidebarToggleWrapper headerHeight={headerHeight}>
      <IconButton
        shape="round"
        icon={iconName}
        onClick={onClick}
        label={isOpen ? "Close Sidebar" : "Open Sidebar"}
        size="xxsmall"
        outline
      />
    </SidebarToggleWrapper>
  );
};

const SidebarToggleWrapper = styled.div`
  position: relative;
  margin-top: calc(${props => props.headerHeight} / 2);
  z-index: 1;
  ${IconButton} {
    background: #fff;
    transform: translateX(-50%) translateY(-50%);
    position: absolute;
  }
`;

export default SidebarToggle
