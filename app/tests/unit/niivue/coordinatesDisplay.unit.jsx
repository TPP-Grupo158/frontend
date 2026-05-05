import { expect, describe, it} from "vitest";
import { render } from '@testing-library/react';

import CoordinatesDisplay from "@components/Niivue/CoordinatesDisplay";

describe('CoordinatesDisplay component', () => {
  it('renders coordinates when they are provided', () => {
    const coordinates = { x: 10, y: 20, z: 30 };
    const { getByText } = render(<CoordinatesDisplay coordinates={coordinates} />);

    expect(getByText('X: 10')).toBeInTheDocument();
    expect(getByText('Y: 20')).toBeInTheDocument();
    expect(getByText('Z: 30')).toBeInTheDocument();
  });

  it('renders nothing when coordinates are not provided', () => {
    const { container } = render(<CoordinatesDisplay coordinates={null} />);
    expect(container).toBeEmptyDOMElement();
  });

});