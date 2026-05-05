import { RadioGroup, RadioItem, ItemIndicator } from "@radix-ui/react-menubar";
import PropTypes from "prop-types";

const MenuBarRadioGroup = ({ value, onValueChange, items }) => {

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
      flex: "0 0 10px",
    }
  }


  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
    >
      {items.map((item) => (
        <RadioItem
          style={style.item}
          key={item.value}
          value={item.value}
        >
          <ItemIndicator 
          style={{...style.indicator, opacity: item.value === value ? 1 : 0}}
          forceMount
          >
            &bull;
          </ItemIndicator>
          {item.label}
        </RadioItem>
      ))}
    </RadioGroup>
  )
}

export default MenuBarRadioGroup;

MenuBarRadioGroup.propTypes = {
    value: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    ).isRequired
};