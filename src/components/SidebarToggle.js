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
        size="small"
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
