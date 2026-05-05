import {Menu, Trigger, Portal, Content} from "@radix-ui/react-menubar";
import PropTypes from "prop-types";
import { useState } from "react";

const MenubarMenu = ({ children, label, style }) => {

  const [hovered, setHovered] = useState(false);

  const defaultStyle = {
    trigger: {
      backgroundColor: hovered ? "lightgray" : "white",
      borderRadius: 4,
      padding: "4px 8px",
      cursor: "pointer",
      border: "0px",
      width: 75,
    },
    content: { 
      backgroundColor: 'white', 
      border: '1px solid #ccc',
      borderRadius: '4px', 
      padding: '8px',
      width: "max-content",
      maxWidth: "90vw",
      ...style
    }
  };

  return (
    <Menu>
      <Trigger 
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}

      style={defaultStyle.trigger}
      >
        {label}
      </Trigger>
      <Portal>
          <Content style={defaultStyle.content}
            
            align="start"
            sideOffset={5}
            alignOffset={-3}
          >
            { children }
          </Content>
      </Portal>
  </Menu>
  )
}

export default MenubarMenu;

MenubarMenu.propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    style: PropTypes.object
};

