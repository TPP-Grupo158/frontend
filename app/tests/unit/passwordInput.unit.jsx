import { expect, describe, it, vi } from "vitest";
import { render } from '@testing-library/react';

import userEvent from "@testing-library/user-event";

import PasswordInput from "../../src/components/PasswordInput";

describe('PasswordInput', () => {
  it('renders the input correctly', () => {
    const mockOnChange = vi.fn();
    const { getByPlaceholderText } = render(<PasswordInput value="" onChange={mockOnChange} placeholder="Password" />);

    const passwordInput = getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility when the icon button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { getByPlaceholderText, getByRole } = render(<PasswordInput value="" onChange={mockOnChange} placeholder="Password" />);

    const passwordInput = getByPlaceholderText('Password');
    const toggleButton = getByRole('button');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password'); 
  });

  it('shows tooltip when provided and focused', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const tooltipText = "Password must be at least 8 characters long.";
    const { getByPlaceholderText, getByText } = render(
      <PasswordInput value="" onChange={mockOnChange} placeholder="Password" tooltip={tooltipText} />
    );

    const passwordInput = getByPlaceholderText('Password');

    // Tooltip should not be visible initially
    expect(getByText(tooltipText)).not.toHaveClass('open');

    // Focus the input to show the tooltip
    await user.click(passwordInput);
    expect(getByText(tooltipText)).toHaveClass('open');

    // Blur the input to hide the tooltip
    await user.tab();
    expect(getByText(tooltipText)).not.toHaveClass('open');
  });
});
