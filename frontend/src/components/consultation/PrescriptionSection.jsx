import React from "react";
import PrescriptionRow from "./PrescriptionRow";
import Button from "../common/Button";

const PrescriptionSection = ({ prescriptions, onChange, onAdd, onRemove, errors = {}, disabled = false }) => {
  return (
    <section className={`bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-6 ${disabled ? 'opacity-60' : ''}`}>
      {/* Section Title with Divider */}
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Prescriptions
        </h2>
        {errors.prescriptions && (
          <p className="text-sm text-red-600 mt-1">{errors.prescriptions}</p>
        )}
      </div>

      {disabled && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Prescription section is disabled while waiting for lab results
        </div>
      )}

      {/* Prescription Rows */}
      <div className="space-y-4">
        {prescriptions.map((prescription, index) => (
          <div
            key={index}
            className="transition-all duration-300 ease-in-out"
          >
            <PrescriptionRow
              prescription={prescription}
              index={index}
              onChange={onChange}
              onRemove={onRemove}
              errors={errors}
              showRemove={prescriptions.length > 1}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {/* Add Medicine Button */}
      <div className="mt-4">
        <Button
          variant="secondary"
          onClick={onAdd}
          type="button"
          disabled={disabled}
          aria-label="Add new prescription"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Medicine
        </Button>
      </div>
    </section>
  );
};

export default PrescriptionSection;
