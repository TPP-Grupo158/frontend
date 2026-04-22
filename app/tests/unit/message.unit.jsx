import { expect, describe, it, vi } from "vitest";
import { render } from '@testing-library/react';

import Message from "../../src/components/Message";

describe('Message component', () => {
  it('renders message when it has a text', () => {
    const { getByText } = render(<Message message="Test message" visible />);

    expect(getByText("Test message")).toBeInTheDocument();
  });

  it('does not render anything when message is empty', () => {
    const { container } = render(<Message message="" visible />);
    expect(container).toBeEmptyDOMElement();
    
  });

  it('does not render anything when visible is false', () => {
    const { queryByText } = render(<Message message="Test message" visible={false} />);
    expect(queryByText("Test message")).toBeNull();
  });

  it('calls onClick when close button is clicked', () => {
    const onClick = vi.fn();
    const { getByText } = render(<Message message="Test message" visible onClick={onClick} />);
    const closeButton = getByText('×');
    closeButton.click();
    expect(onClick).toHaveBeenCalled();
  });
});