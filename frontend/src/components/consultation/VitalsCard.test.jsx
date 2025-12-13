import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VitalsCard from './VitalsCard';

describe('VitalsCard Component', () => {
  const mockVitals = {
    blood_pressure_systolic: 120,
    blood_pressure_diastolic: 80,
    heart_rate: 75,
    temperature: 37.2,
    height: 175,
    weight: 70,
    spo2: 98,
  };

  it('renders all vital sign input fields', () => {
    const mockOnChange = vi.fn();
    
    render(<VitalsCard vitals={mockVitals} onChange={mockOnChange} />);

    // Check if all vital sign labels are present
    expect(screen.getByLabelText(/Systolic BP/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Diastolic BP/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Heart Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SpO2/i)).toBeInTheDocument();
  });

  it('calculates and displays BMI correctly', () => {
    const mockOnChange = vi.fn();
    
    render(<VitalsCard vitals={mockVitals} onChange={mockOnChange} />);

    // BMI = 70 / (1.75)² = 22.86
    const bmiInput = screen.getByDisplayValue('22.86');
    expect(bmiInput).toBeInTheDocument();
    expect(bmiInput).toBeDisabled();
  });

  it('displays BMI as -- when height or weight is missing', () => {
    const mockOnChange = vi.fn();
    const incompleteVitals = {
      ...mockVitals,
      height: '',
      weight: '',
    };
    
    render(<VitalsCard vitals={incompleteVitals} onChange={mockOnChange} />);

    const bmiInput = screen.getByDisplayValue('--');
    expect(bmiInput).toBeInTheDocument();
  });

  it('calls onChange handler when input values change', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<VitalsCard vitals={{ ...mockVitals, temperature: '' }} onChange={mockOnChange} />);

    const tempInput = screen.getByLabelText(/Temperature/i);
    await user.type(tempInput, '37');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays error messages when errors prop is provided', () => {
    const mockOnChange = vi.fn();
    const errors = {
      temperature: 'Temperature must be between 35-42°C',
      heart_rate: 'Pulse rate must be between 30-220 bpm',
    };
    
    render(<VitalsCard vitals={mockVitals} onChange={mockOnChange} errors={errors} />);

    expect(screen.getByText('Temperature must be between 35-42°C')).toBeInTheDocument();
    expect(screen.getByText('Pulse rate must be between 30-220 bpm')).toBeInTheDocument();
  });

  it('applies correct card styling classes', () => {
    const mockOnChange = vi.fn();
    
    const { container } = render(<VitalsCard vitals={mockVitals} onChange={mockOnChange} />);

    const card = container.firstChild;
    expect(card).toHaveClass('bg-white', 'rounded-xl', 'border', 'border-gray-200', 'shadow-md', 'hover:shadow-lg', 'transition-shadow', 'p-6');
  });

  it('uses grid layout for responsive design', () => {
    const mockOnChange = vi.fn();
    
    const { container } = render(<VitalsCard vitals={mockVitals} onChange={mockOnChange} />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
  });

  it('recalculates BMI when height or weight changes', () => {
    const mockOnChange = vi.fn();
    
    const { rerender } = render(<VitalsCard vitals={mockVitals} onChange={mockOnChange} />);

    // Initial BMI
    expect(screen.getByDisplayValue('22.86')).toBeInTheDocument();

    // Update weight
    const updatedVitals = { ...mockVitals, weight: 80 };
    rerender(<VitalsCard vitals={updatedVitals} onChange={mockOnChange} />);

    // New BMI = 80 / (1.75)² = 26.12
    expect(screen.getByDisplayValue('26.12')).toBeInTheDocument();
  });
});
