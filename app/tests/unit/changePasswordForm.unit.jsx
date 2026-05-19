import { expect, describe, it, vi } from "vitest";
import { render } from '@testing-library/react';

import userEvent from "@testing-library/user-event";

import ChangePasswordForm from "../../src/components/changePasswordForm";

describe('ChangePasswordForm', () => {
  it('renders the form correctly', () => {
    const mockOnSubmit = vi.fn();
    const { getByPlaceholderText, getByRole } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    expect(getByPlaceholderText('Current Password')).toBeInTheDocument();
    expect(getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Change Password' })).toBeInTheDocument();
  });

  it('calls onSubmit with the correct data when the form is submitted', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, 'newPassword123!');
    await user.type(confirmPasswordInput, 'newPassword123!');

    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({ current_password: 'currentPassword123!', new_password: 'newPassword123!' });
  });

  it('does not call onSubmit if the passwords do not match', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, 'newPassword123!');
    await user.type(confirmPasswordInput, 'differentPassword123!');

    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});