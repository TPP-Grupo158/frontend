import { CheckboxItem, ItemIndicator } from "@radix-ui/react-menubar"
import PropTypes from "prop-types";

const MenubarCheckboxItem = ({ checked, onCheckedChange, label }) => {

  const style = {
    item: {
      padding: "4px 4px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      whiteSpace: "nowrap",
      gap: 4,
    },
    indicator: {
      width: 10,
      textAlign: "center",
      opacity: checked ? 1 : 0,
      flex: "0 0 10px",
    }
  }

  return (
    <CheckboxItem
      style={style.item}
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <ItemIndicator style={style.indicator}
        forceMount
      >
        ✓
      </ItemIndicator>
      {label}
    </CheckboxItem>
  )
}

export default MenubarCheckboxItem;

MenubarCheckboxItem.propTypes = {
    checked: PropTypes.bool.isRequired,
    onCheckedChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
};