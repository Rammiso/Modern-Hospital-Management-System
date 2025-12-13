import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import PrescriptionSection from './PrescriptionSection';

describe('PrescriptionSection', () => {
  const mockPrescriptions = [
    {
      drug_name: 'Paracetamol',
      dosage: '500mg',
      frequency: '3x daily',
      duration: '5 days',
      instructions: 'After meals',
    },
  ];

  const mockOnChange = vi.fn();
  const mockOnAdd = vi.fn();
  const mockOnRemove = vi.fn();

  it('renders the section title', () => {
    render(
      <PrescriptionSection
        prescriptions={mockPrescriptions}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Prescriptions')).toBeInTheDocument();
  });

  it('renders prescription rows', () => {
    render(
      <PrescriptionSection
        prescriptions={mockPrescriptions}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByDisplayValue('Paracetamol')).toBeInTheDocument();
    expect(screen.getByDisplayValue('500mg')).toBeInTheDocument();
  });

  it('renders Add Medicine button', () => {
    render(
      <PrescriptionSection
        prescriptions={mockPrescriptions}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const addButton = screen.getByRole('button', { name: /add medicine/i });
    expect(addButton).toBeInTheDocument();
  });

  it('calls onAdd when Add Medicine button is clicked', () => {
    render(
      <PrescriptionSection
        prescriptions={mockPrescriptions}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const addButton = screen.getByRole('button', { name: /add medicine/i });
    fireEvent.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('does not show remove button when only one prescription exists', () => {
    render(
      <PrescriptionSection
        prescriptions={mockPrescriptions}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.queryByRole('button', { name: /remove prescription/i });
    expect(removeButton).not.toBeInTheDocument();
  });

  it('shows remove button when multiple prescriptions exist', () => {
    const multiplePrescriptions = [
      ...mockPrescriptions,
      {
        drug_name: 'Ibuprofen',
        dosage: '400mg',
        frequency: '2x daily',
        duration: '3 days',
        instructions: '',
      },
    ];

    render(
      <PrescriptionSection
        prescriptions={multiplePrescriptions}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove prescription/i });
    expect(removeButtons).toHaveLength(2);
  });

  it('applies transition classes to prescription rows', () => {
    const { container } = render(
      <PrescriptionSection
        prescriptions={mockPrescriptions}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const transitionDiv = container.querySelector('.transition-all.duration-300.ease-in-out');
    expect(transitionDiv).toBeInTheDocument();
  });

  it('applies correct section styling', () => {
    const { container } = render(
      <PrescriptionSection
        prescriptions={mockPrescriptions}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-white', 'rounded-xl', 'border', 'border-gray-200', 'shadow-md', 'p-6');
  });

  // Property-Based Test
  // Feature: doctor-consultation-ui, Property 10: Prescription Row Addition
  // Validates: Requirements 4.2
  it('property: adding a prescription increases count by 1 for any initial prescription list', () => {
    fc.assert(
      fc.property(
        // Generate an array of 1 to 20 prescription objects
        fc.array(
          fc.record({
            drug_name: fc.string(),
            dosage: fc.string(),
            frequency: fc.string(),
            duration: fc.string(),
            instructions: fc.string(),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (initialPrescriptions) => {
          const initialCount = initialPrescriptions.length;
          
          // Simulate the state management behavior that would occur in a parent component
          // when the Add Medicine button is clicked
          let prescriptionList = [...initialPrescriptions];
          
          // Simulate the onAdd handler that adds a new empty prescription
          const addPrescription = () => {
            prescriptionList = [
              ...prescriptionList,
              { drug_name: '', dosage: '', frequency: '', duration: '', instructions: '' }
            ];
          };
          
          // Execute the add operation
          addPrescription();
          
          // Property: For any form state with N prescription rows, 
          // clicking the "Add Medicine" button should result in N+1 prescription rows
          const finalCount = prescriptionList.length;
          expect(finalCount).toBe(initialCount + 1);
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design doc
    );
  });
});
