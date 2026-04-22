import { expect, describe, it, vi } from "vitest";
import { render } from '@testing-library/react';
import PatientForm  from "../../src/components/PatientForm";
import userEvent from "@testing-library/user-event";
import { fireEvent } from '@testing-library/react';

describe('Patient Form', () => {
  it('it should have name input field', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    
    const { getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

    const nameInput = getByPlaceholderText("Fullname");
    expect(nameInput).toBeInTheDocument();
  });

  it('it should have DNI input field', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    
    const { getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

    const dniInput = getByPlaceholderText("DNI");
    expect(dniInput).toBeInTheDocument();
  });

  it('it should have email input field', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    
    const { getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

    const emailInput = getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
  });

  it('it should have date of birth input field', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    
    const { getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

    const dobInput = getByPlaceholderText("Date of Birth");
    expect(dobInput).toBeInTheDocument();
  });

  it('is should have create button', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    
    const { getByRole } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

    const submitButton = getByRole('button', { name: /create/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('is should have cancel button', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    
    const { getByRole } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

    const cancelButton = getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);
    const cancelButton = getByRole('button', { name: /cancel/i });

    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit with form data when create button is clicked', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();
    
    const { getByRole, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

    const nameInput = getByPlaceholderText("Fullname");
    const dniInput = getByPlaceholderText("DNI");
    const emailInput = getByPlaceholderText("Email");
    const dobInput = getByPlaceholderText("Date of Birth");
    const submitButton = getByRole('button', { name: /create/i });

    await user.type(nameInput, "John Doe");
    await user.type(dniInput, "12345678");
    await user.type(emailInput, "email@gmail.com");
    await user.type(dobInput, "1990-01-01");
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      fullname: "John Doe",
      dni: "12345678",
      email: "email@gmail.com",
      dateOfBirth: "1990-01-01"
    });
  });

  describe('Patient Form Validation for fullname', () => {
    it('should not allow empty fullname', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByText, getByRole } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      const errorMessage = getByText("Fullname is required");
      expect(errorMessage).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should not allow fullname shorter than 3 characters', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByText, getByRole, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const nameInput = getByPlaceholderText("Fullname");
      await user.type(nameInput, "Jo");
      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      const errorMessage = getByText("Fullname must be at least 3 characters");
      expect(errorMessage).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should not allow fullname longer than 100 characters', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByText, getByRole, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const nameInput = getByPlaceholderText("Fullname");
      await user.type(nameInput, "J".repeat(101));
      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      const errorMessage = getByText("Fullname cannot exceed 100 characters");
      expect(errorMessage).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should allow composing name input', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      
      const { getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const nameInput = getByPlaceholderText("Fullname");
      fireEvent.compositionStart(nameInput);
      fireEvent.change(nameInput, { target: { value: "Sebastia" } });
      expect(nameInput.value).toBe("Sebastia");

      fireEvent.compositionEnd(nameInput, { data: "án" });
      fireEvent.change(nameInput, { target: { value: "Sebastián" } });

      expect(nameInput.value).toBe("Sebastián");
    });

    it('should show sanitized input', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const dniInput = getByPlaceholderText("Fullname");
      await user.type(dniInput, "1234abcd!$");
      
      expect(dniInput.value).toBe("abcd");
    })
  });
  
  describe('Patient Form Validation for DNI', () => {
    it('should not allow empty DNI', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByText, getByRole } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      const errorMessage = getByText("DNI is required");
      expect(errorMessage).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should only accept numbers', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const dniInput = getByPlaceholderText("DNI");
      await user.type(dniInput, "1234abcd");
      
      expect(dniInput.value).toBe("1234");
      expect(onSubmit).not.toHaveBeenCalled();
    })

    it('should not allow DNI shorter than 7 characters', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByText, getByRole, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const dniInput = getByPlaceholderText("DNI");
      await user.type(dniInput, "123456");
      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      const errorMessage = getByText("DNI must be at least 7 characters");
      expect(errorMessage).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should not allow DNI longer than 8 characters', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByText, getByRole, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const dniInput = getByPlaceholderText("DNI");
      await user.type(dniInput, "123456789");
      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      const errorMessage = getByText('DNI cannot exceed 8 characters');
      expect(errorMessage).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should not show error for a valid DNI', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { queryByText, getByRole, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const dniInput = getByPlaceholderText("DNI");
      await user.type(dniInput, "12345678");
      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      const errorMessage1 = queryByText("DNI must be at least 7 characters");
      const errorMessage2 = queryByText('DNI cannot exceed 8 characters');
      expect(errorMessage1).not.toBeInTheDocument();
      expect(errorMessage2).not.toBeInTheDocument();
    });
  });

  describe('Patient Form Validation for email', () => {
    it('should not allow empty email', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByText, getByRole } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      const errorMessage = getByText("Email is required");
      expect(errorMessage).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should not allow invalid email format', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByText, getByRole, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const emailInput = getByPlaceholderText("Email");
      await user.type(emailInput, "invalid-email");
      const submitButton = getByRole('button', { name: /create/i });

      await user.click(submitButton);

      const errorMessage = getByText("Invalid email format");
      expect(errorMessage).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should not allow email longer than 150 characters', async () => {
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      const user = userEvent.setup();
      
      const { getByText, getByRole, getByPlaceholderText } = render(<PatientForm onSubmit={onSubmit} onCancel={onCancel} />);

      const emailInput = getByPlaceholderText("Email");
      await user.type(emailInput, "a".repeat(151) + "@example.com");
      const submitButton = getByRole('button', { name: /create/i });
      await user.click(submitButton);

      const errorMessage = getByText("Email cannot exceed 150 characters");
      expect(errorMessage).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

});
