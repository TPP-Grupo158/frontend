import { expect, describe, it, vi } from "vitest";
import { render } from '@testing-library/react';

import userEvent from "@testing-library/user-event";

import LogoutButton from "../../src/components/LogoutButton";

describe("LogoutButton", () => {
  it("renders the LogoutButton component", () => {
    const { getByText } = render(<LogoutButton />);
    const buttonElement = getByText(/Logout/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it("calls onClick when the button is clicked", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();
    const { getByText } = render(<LogoutButton onClick={onClickMock} />);
    const buttonElement = getByText(/Logout/i);
    
    await user.click(buttonElement);
    
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});