import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LabRequestSection from "./LabRequestSection";

describe("LabRequestSection", () => {
  const mockAvailableTests = [
    { id: "1", name: "Complete Blood Count", type: "blood", category: "Hematology" },
    { id: "2", name: "Urinalysis", type: "urine", category: "Clinical Chemistry" },
  ];

  const mockLabRequests = [
    { test_name: "1", instructions: "Fasting required" },
  ];

  const mockOnChange = vi.fn();
  const mockOnAdd = vi.fn();
  const mockOnRemove = vi.fn();

  it("renders section title", () => {
    render(
      <LabRequestSection
        labRequests={mockLabRequests}
        availableTests={mockAvailableTests}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText("Laboratory Tests")).toBeInTheDocument();
  });

  it("renders all lab request rows", () => {
    const multipleRequests = [
      { test_name: "1", instructions: "Fasting required" },
      { test_name: "2", instructions: "Morning sample" },
    ];

    const { container } = render(
      <LabRequestSection
        labRequests={multipleRequests}
        availableTests={mockAvailableTests}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    // Count the number of lab request rows by looking for the container divs
    const labRequestRows = container.querySelectorAll('.bg-gray-50.rounded-lg');
    expect(labRequestRows).toHaveLength(2);
  });

  it("renders Add Lab Test button", () => {
    render(
      <LabRequestSection
        labRequests={mockLabRequests}
        availableTests={mockAvailableTests}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByRole("button", { name: /Add Lab Test/i })).toBeInTheDocument();
  });

  it("calls onAdd when Add Lab Test button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <LabRequestSection
        labRequests={mockLabRequests}
        availableTests={mockAvailableTests}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const addButton = screen.getByRole("button", { name: /Add Lab Test/i });
    await user.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it("applies correct styling classes", () => {
    const { container } = render(
      <LabRequestSection
        labRequests={mockLabRequests}
        availableTests={mockAvailableTests}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("bg-white", "rounded-xl", "border", "border-gray-200", "shadow-md", "p-6");
  });

  it("renders with empty lab requests array", () => {
    render(
      <LabRequestSection
        labRequests={[]}
        availableTests={mockAvailableTests}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText("Laboratory Tests")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Lab Test/i })).toBeInTheDocument();
  });
});
