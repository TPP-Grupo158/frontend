import { Item } from "@radix-ui/react-menubar";
import * as Slider from "@radix-ui/react-slider";
import PropTypes from "prop-types";


const MenubarSlider = ({ value, onChange, min, max, step }) => {

    const sliderStyle = {
        root: {
            display: "flex",
            alignItems: "center",
            width: 180,
            height: 20,
        },
        track: {
            position: "relative",
            flexGrow: 1,
            height: 6,
            background: "#e5e7eb",
            borderRadius: "999px",
        },
        thumb: {
            width: 20,
            height: 20,
            background: "#111827",
            borderRadius: "50%",
            backgroundColor: "white",
        },
        range: {
            position: "absolute",
            height: "100%",
            background: '#007bff',
            borderRadius: "999px",
        }
    };

  return (
    <Item 
    style={{ padding: '4px 8px', cursor: 'pointer' }}
    onSelect={(event) => event.preventDefault()}
    >
      <Slider.Root style={sliderStyle.root}
      max={max} 
      min={min} 
      step={step}
      value={[value]}
      onValueChange={(value) => onChange(value[0])}
      >
        <Slider.Track style={sliderStyle.track}>
            <Slider.Range style={sliderStyle.range} />
        </Slider.Track>
            <Slider.Thumb aria-label="Volume" 
            style={sliderStyle.thumb}/>
      </Slider.Root>
    </Item>
  )

}

export default MenubarSlider;

MenubarSlider.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired
}