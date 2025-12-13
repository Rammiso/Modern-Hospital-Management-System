import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VitalInput from './VitalInput';

describe('VitalInput Component', () => {
  it('renders correctly with required props', () => {
    const mockOnChange = vi.fn();
    
    render(
      <VitalInput
        label="Blood Pressure"
        name="bp_systolic"
        value="120"
        onChange={mockOnChange}
        unit="mmHg"
      />
    );

    // Check if label is rendered
    expect(screen.getByLabelText(/Blood Pressure/i)).toBeInTheDocument();
    
    // Check if input has correct value
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(120);
    
    // Check if unit is displayed
    expect(screen.getByText('mmHg')).toBeInTheDocument();
  });

  it('renders with required indicator when required prop is true', () => {
    const mockOnChange = vi.fn();
    
    render(
      <VitalInput
        label="Temperature"
        name="temperature"
        value=""
        onChange={mockOnChange}
        unit="°C"
        required={true}
      />
    );

    // Check if required asterisk is present
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const mockOnChange = vi.fn();
    const errorMessage = 'Temperature must be between 35.0-42.0°C';
    
    render(
      <VitalInput
        label="Temperature"
        name="temperature"
        value="50"
        onChange={mockOnChange}
        unit="°C"
        error={errorMessage}
      />
    );

    // Check if error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    
    // Check if input has error styling
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveClass('border-red-500');
  });

  it('calls onChange handler when input value changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(
      <VitalInput
        label="Heart Rate"
        name="heart_rate"
        value=""
        onChange={mockOnChange}
        unit="bpm"
      />
    );

    const input = screen.getByRole('spinbutton');
    await user.type(input, '75');

    // onChange should be called for each keystroke
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders as disabled when disabled prop is true', () => {
    const mockOnChange = vi.fn();
    
    render(
      <VitalInput
        label="Weight"
        name="weight"
        value="70"
        onChange={mockOnChange}
        unit="kg"
        disabled={true}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-gray-100');
  });

  it('renders with custom placeholder', () => {
    const mockOnChange = vi.fn();
    
    render(
      <VitalInput
        label="Height"
        name="height"
        value=""
        onChange={mockOnChange}
        unit="cm"
        placeholder="Enter height"
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('placeholder', 'Enter height');
  });

  it('renders with correct step attribute', () => {
    const mockOnChange = vi.fn();
    
    render(
      <VitalInput
        label="Temperature"
        name="temperature"
        value=""
        onChange={mockOnChange}
        unit="°C"
        step="0.1"
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('step', '0.1');
  });
});
