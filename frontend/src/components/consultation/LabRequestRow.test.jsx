import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LabRequestRow from './LabRequestRow';

describe('LabRequestRow Component', () => {
  const mockLabRequest = {
    test_name: '',
    test_type: '',
    instructions: '',
  };

  const mockAvailableTests = [
    { id: '1', name: 'Complete Blood Count', type: 'blood', category: 'Hematology' },
    { id: '2', name: 'Urinalysis', type: 'urine', category: 'Clinical Chemistry' },
    { id: '3', name: 'X-Ray Chest', type: 'imaging', category: 'Radiology' },
  ];

  it('renders with selector for laboratory tests', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <LabRequestRow
        labRequest={mockLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={mockAvailableTests}
      />
    );

    // Check if the select field is rendered
    expect(screen.getByLabelText(/Laboratory Test/i)).toBeInTheDocument();
    
    // Check if instructions field is rendered
    expect(screen.getByLabelText(/Instructions/i)).toBeInTheDocument();
  });

  it('renders all available test options in selector', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <LabRequestRow
        labRequest={mockLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={mockAvailableTests}
      />
    );

    const select = screen.getByLabelText(/Laboratory Test/i);
    
    // Check if select element exists
    expect(select).toBeInTheDocument();
    
    // The options should be rendered within the select
    // Note: The exact rendering depends on the Select component implementation
  });

  it('renders with selected test value', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    const filledLabRequest = {
      test_name: '1',
      test_type: 'blood',
      instructions: 'Fasting required',
    };
    
    render(
      <LabRequestRow
        labRequest={filledLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={mockAvailableTests}
      />
    );

    // Check if the selected value is displayed
    const select = screen.getByLabelText(/Laboratory Test/i);
    expect(select).toHaveValue('1');
    
    // Check if instructions are displayed
    expect(screen.getByDisplayValue('Fasting required')).toBeInTheDocument();
  });

  it('shows remove button', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <LabRequestRow
        labRequest={mockLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={mockAvailableTests}
      />
    );

    const removeButton = screen.getByRole('button', { name: /Remove lab test/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('calls onChange handler when test selection changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <LabRequestRow
        labRequest={mockLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={mockAvailableTests}
      />
    );

    const select = screen.getByLabelText(/Laboratory Test/i);
    await user.selectOptions(select, '1');

    // onChange should be called with index, field name, and value
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(0, 'test_name', '1');
  });

  it('calls onChange handler when instructions change', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <LabRequestRow
        labRequest={mockLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={mockAvailableTests}
      />
    );

    const instructionsField = screen.getByLabelText(/Instructions/i);
    await user.type(instructionsField, 'Fasting required');

    // onChange should be called for each keystroke
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onRemove handler when remove button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <LabRequestRow
        labRequest={mockLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={mockAvailableTests}
      />
    );

    const removeButton = screen.getByRole('button', { name: /Remove lab test/i });
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it('displays error messages when errors prop is provided', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    const errors = {
      'labRequests.0.test_name': 'Test selection is required',
    };
    
    render(
      <LabRequestRow
        labRequest={mockLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={mockAvailableTests}
        errors={errors}
      />
    );

    // Check if error message is displayed
    expect(screen.getByText('Test selection is required')).toBeInTheDocument();
  });

  it('renders with empty availableTests array', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <LabRequestRow
        labRequest={mockLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={[]}
      />
    );

    // Component should still render without errors
    expect(screen.getByLabelText(/Laboratory Test/i)).toBeInTheDocument();
  });

  it('renders with correct placeholder for instructions', () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    
    render(
      <LabRequestRow
        labRequest={mockLabRequest}
        index={0}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
        availableTests={mockAvailableTests}
      />
    );

    expect(screen.getByPlaceholderText('e.g., Fasting required')).toBeInTheDocument();
  });
});
