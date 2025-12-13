import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrescriptionRow from './PrescriptionRow';

describe('PrescriptionRow Component', () => {
  const mockPrescription = {
    drug_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  };

  it('renders all required fields', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <PrescriptionRow
        prescription={mockPrescription}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        showRemove={true}
      />
    );

    // Check if all input fields are rendered
    expect(screen.getByLabelText(/Medicine Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dosage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Frequency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Instructions/i)).toBeInTheDocument();
  });

  it('renders with prescription data', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    const filledPrescription = {
      drug_name: 'Paracetamol',
      dosage: '500mg',
      frequency: '3x daily',
      duration: '5 days',
      instructions: 'After meals',
    };
    
    render(
      <PrescriptionRow
        prescription={filledPrescription}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        showRemove={true}
      />
    );

    // Check if values are displayed
    expect(screen.getByDisplayValue('Paracetamol')).toBeInTheDocument();
    expect(screen.getByDisplayValue('500mg')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3x daily')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5 days')).toBeInTheDocument();
    expect(screen.getByDisplayValue('After meals')).toBeInTheDocument();
  });

  it('shows remove button when showRemove is true', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <PrescriptionRow
        prescription={mockPrescription}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        showRemove={true}
      />
    );

    const removeButton = screen.getByRole('button', { name: /Remove prescription/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('hides remove button when showRemove is false', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <PrescriptionRow
        prescription={mockPrescription}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        showRemove={false}
      />
    );

    const removeButton = screen.queryByRole('button', { name: /Remove prescription/i });
    expect(removeButton).not.toBeInTheDocument();
  });

  it('calls onChange handler when field value changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <PrescriptionRow
        prescription={mockPrescription}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        showRemove={true}
      />
    );

    const drugNameInput = screen.getByLabelText(/Medicine Name/i);
    await user.type(drugNameInput, 'Aspirin');

    // onChange should be called with index, field name, and value
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(0, 'drug_name', expect.any(String));
  });

  it('calls onRemove handler when remove button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <PrescriptionRow
        prescription={mockPrescription}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        showRemove={true}
      />
    );

    const removeButton = screen.getByRole('button', { name: /Remove prescription/i });
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it('displays error messages when errors prop is provided', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    const errors = {
      'prescriptions.0.drug_name': 'Medicine name is required',
      'prescriptions.0.dosage': 'Dosage is required',
    };
    
    render(
      <PrescriptionRow
        prescription={mockPrescription}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        errors={errors}
        showRemove={true}
      />
    );

    // Check if error messages are displayed
    expect(screen.getByText('Medicine name is required')).toBeInTheDocument();
    expect(screen.getByText('Dosage is required')).toBeInTheDocument();
  });

  it('renders with correct placeholders', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <PrescriptionRow
        prescription={mockPrescription}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        showRemove={true}
      />
    );

    // Check placeholders
    expect(screen.getByPlaceholderText('e.g., Paracetamol')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 500mg')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 3x daily')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 5 days')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., After meals')).toBeInTheDocument();
  });
});
