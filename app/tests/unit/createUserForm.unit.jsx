import { expect, describe, it, vi } from "vitest";
import { render } from '@testing-library/react';

import userEvent from "@testing-library/user-event";

import CreateUserForm from "../../src/components/UserRegistrationForm.jsx";

describe('CreateUserForm', () => {
  it('renders the form correctly', () => {
    const mockOnSubmit = vi.fn();
    const { getByPlaceholderText, getByRole } = render(<CreateUserForm onSubmit={mockOnSubmit} />);

    expect(getByPlaceholderText('Fullname')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('calls onSubmit with the correct data when the form is submitted', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole } = render(<CreateUserForm onSubmit={mockOnSubmit} />);

    const fullnameInput = getByPlaceholderText('Fullname');
    const emailInput = getByPlaceholderText('Email');
    const submitButton = getByRole('button', { name: 'Create' });

    await user.type(fullnameInput, 'John Doe');
    await user.type(emailInput, 'john.doe@example.com');

    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({ fullname: 'John Doe', email: 'john.doe@example.com' });
  });

  it('displays error when email is not valid', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<CreateUserForm onSubmit={mockOnSubmit} />);

    const fullnameInput = getByPlaceholderText('Fullname');
    const emailInput = getByPlaceholderText('Email');
    const submitButton = getByRole('button', { name: 'Create' });

    await user.type(fullnameInput, 'John Doe');
    await user.type(emailInput, 'invalid-email');

    await user.click(submitButton);

    expect(getByText('Invalid email format')).toBeInTheDocument();
  });

  it('displays error when fullname is too short', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<CreateUserForm onSubmit={mockOnSubmit} />);

    const fullnameInput = getByPlaceholderText('Fullname');
    const emailInput = getByPlaceholderText('Email');
    const submitButton = getByRole('button', { name: 'Create' });

    await user.type(fullnameInput, 'Jo');
    await user.type(emailInput, 'john.doe@example.com');

    await user.click(submitButton);

    expect(getByText('Fullname must be at least 3 characters')).toBeInTheDocument();
  });

  it('displays error when fullname is too long', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<CreateUserForm onSubmit={mockOnSubmit} />);

    const fullnameInput = getByPlaceholderText('Fullname');
    const emailInput = getByPlaceholderText('Email');
    const submitButton = getByRole('button', { name: 'Create' });

    await user.type(fullnameInput, 'J'.repeat(101));
    await user.type(emailInput, 'john.doe@example.com');

    await user.click(submitButton);

    expect(getByText('Fullname cannot exceed 100 characters')).toBeInTheDocument();
  });

  it('displays error when email is too long', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<CreateUserForm onSubmit={mockOnSubmit} />);

    const fullnameInput = getByPlaceholderText('Fullname');
    const emailInput = getByPlaceholderText('Email');
    const submitButton = getByRole('button', { name: 'Create' });

    await user.type(fullnameInput, 'John Doe');
    await user.type(emailInput, 'a'.repeat(151) + '@example.com');

    await user.click(submitButton);

    expect(getByText('Email cannot exceed 150 characters')).toBeInTheDocument();
  });

  it('displays error when fullname is not provided', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<CreateUserForm onSubmit={mockOnSubmit} />);

    const emailInput = getByPlaceholderText('Email');
    const submitButton = getByRole('button', { name: 'Create' });

    await user.type(emailInput, 'john.doe@example.com');
    await user.click(submitButton);

    expect(getByText('Fullname is required')).toBeInTheDocument();
  }); 

  it('displays error when email is not provided', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();
    const { getByPlaceholderText, getByRole, getByText } = render(<CreateUserForm onSubmit={mockOnSubmit} />);

    const fullnameInput = getByPlaceholderText('Fullname');
    const submitButton = getByRole('button', { name: 'Create' });

    await user.type(fullnameInput, 'John Doe');
    await user.click(submitButton);

    expect(getByText('Email is required')).toBeInTheDocument();
  });
});