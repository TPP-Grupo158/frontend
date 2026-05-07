import { expect, describe, it} from "vitest";
import { render } from '@testing-library/react';

import LabelsDisplay from "@components/Niivue/LabelsDisplay";

describe('LabelsDisplay component', () => {

  it('renders one label when it is provided', () => {
    const coloredLabels = {
      "Label 1": [255, 0, 0, 255]
    };

    const { getByText } = render(<LabelsDisplay coloredLabels={coloredLabels} />);

    expect(getByText('Label 1')).toBeInTheDocument();
  });

  it('renders rgba color when it is provided', () => {
    const coloredLabels = {
      "Label 1": [255, 0, 0, 255]
    };

    const { getByText } = render(<LabelsDisplay coloredLabels={coloredLabels} />);

    const colorBox = getByText('Label 1').previousSibling;
    expect(colorBox).toHaveStyle('background-color: rgba(255, 0, 0, 255)');
  });

  it('renders multiple labels when they are provided', () => {
    const coloredLabels = {
      "Label 1": [255, 0, 0, 255],
      "Label 2": [0, 255, 0, 255],
    };

    const { getByText } = render(<LabelsDisplay coloredLabels={coloredLabels} />);

    expect(getByText('Label 1')).toBeInTheDocument();
    expect(getByText('Label 2')).toBeInTheDocument();
  });

  it('renders nothing when no labels are provided', () => {
    const { container } = render(<LabelsDisplay coloredLabels={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

});