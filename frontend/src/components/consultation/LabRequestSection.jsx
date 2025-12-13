import React from "react";
import LabRequestRow from "./LabRequestRow";
import Button from "../common/Button";
import Alert from "../common/Alert";

const LabRequestSection = ({
  labRequests,
  availableTests = [],
  onChange,
  onAdd,
  onRemove,
  onSendToLab,
  errors = {},
  consultationStatus,
  disabled = false,
}) => {
  const isWaitingForLab = consultationStatus === "WAITING_FOR_LAB_RESULTS";
  const isReadyForReview = consultationStatus === "READY_FOR_REVIEW";

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      {/* Section Title with Divider */}
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Laboratory Tests
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Request diagnostic tests and laboratory investigations
        </p>
      </div>

      {/* Status Alerts */}
      {isWaitingForLab && (
        <div className="mb-4">
          <Alert 
            type="info" 
            message="Lab tests sent. Waiting for results... Diagnosis and Prescription sections are disabled until results are available."
          />
        </div>
      )}

      {isReadyForReview && (
        <div className="mb-4">
          <Alert 
            type="success" 
            message="Lab Results Received — Continue Consultation. You can now complete the diagnosis and prescription."
          />
        </div>
      )}

      {/* Lab Request Rows */}
      <div className="space-y-4">
        {labRequests.length > 0 ? (
          labRequests.map((labRequest, index) => (
            <div
              key={index}
              className="transition-all duration-300 ease-in-out"
            >
              <LabRequestRow
                labRequest={labRequest}
                index={index}
                onChange={onChange}
                onRemove={onRemove}
                availableTests={availableTests}
                errors={errors}
                disabled={disabled || isWaitingForLab}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="text-sm">No lab tests requested yet</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">
        <Button
          variant="secondary"
          onClick={onAdd}
          type="button"
          disabled={disabled || isWaitingForLab}
          aria-label="Add new laboratory test"
          className="flex-1"
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
          Add Lab Test
        </Button>

        {labRequests.length > 0 && !isWaitingForLab && (
          <Button
            variant="primary"
            onClick={onSendToLab}
            type="button"
            disabled={disabled}
            className="flex-1"
          >
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send to Lab
          </Button>
        )}
      </div>

      {/* Ethiopian MOH Standard Lab Tests Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tests follow Ethiopian MOH Standard Lab Test list
        </p>
      </div>
    </section>
  );
};

export default LabRequestSection;
