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

  it('shown error message when passwords do not match', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, 'newPassword123!');
    await user.type(confirmPasswordInput, 'differentPassword123!');

    await user.click(submitButton);

    expect(getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('shows error message when current password is not provided', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(newPasswordInput, 'newPassword123!');
    await user.type(confirmPasswordInput, 'newPassword123!');

    await user.click(submitButton);

    expect(getByText('Current password is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error message when new password too short', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, 'sH0rt!');
    await user.type(confirmPasswordInput, 'sH0rt!');

    await user.click(submitButton);

    expect(getByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error message when new password is too long', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, `${'a'.repeat(33)}A1!`);
    await user.type(confirmPasswordInput, `${'a'.repeat(33)}A1!`);

    await user.click(submitButton);

    expect(getByText('Password cannot be longer than 32 characters')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error message when new password does not has an uppercase letter', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, 'newpassword123!');
    await user.type(confirmPasswordInput, 'newpassword123!');

    await user.click(submitButton);

    expect(getByText('Password must contain at least one uppercase character')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error message when new password does not has a lowercase letter', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, 'NEWPASSWORD123!');
    await user.type(confirmPasswordInput, 'NEWPASSWORD123!');

    await user.click(submitButton);

    expect(getByText('Password must contain at least one lowercase character')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error message when new password does not has a number', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, 'NewPassword!');
    await user.type(confirmPasswordInput, 'NewPassword!');

    await user.click(submitButton);

    expect(getByText('Password must contain at least one number')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error message when new password does not has a special character', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, 'NewPassword123');
    await user.type(confirmPasswordInput, 'NewPassword123');

    await user.click(submitButton);

    expect(getByText('Password must contain at least one special character (#$%&@*¡!¿?)')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('error messages are cleared when user corrects the input', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, queryByText } = render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const currentPasswordInput = getByPlaceholderText('Current Password');
    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm New Password');
    const submitButton = getByRole('button', { name: 'Change Password' });

    await user.type(currentPasswordInput, 'currentPassword123!');
    await user.type(newPasswordInput, 'sH0rt!');
    await user.type(confirmPasswordInput, 'sH0rt!');

    await user.click(submitButton);

    expect(queryByText('Password must be at least 8 characters')).toBeInTheDocument();

    await user.clear(newPasswordInput);
    await user.clear(confirmPasswordInput);
    await user.type(newPasswordInput, 'newPassword123!');
    await user.type(confirmPasswordInput, 'newPassword123!');

    await user.click(submitButton);

    expect(queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith({ current_password: 'currentPassword123!', new_password: 'newPassword123!' });
  });
});
