import React from "react";
import { formatDate, formatTime } from "../../utils/helpers";
import Badge from "../common/Badge";
import Card from "../common/Card";

/**
 * MedicalRecordPanel - Left panel showing patient's full medical history
 * Always visible with scrollable content
 */
const MedicalRecordPanel = ({ medicalHistory, loading }) => {
  if (loading) {
    return (
      <div className="h-full bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!medicalHistory) {
    return (
      <div className="h-full bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Medical History</h2>
        <p className="text-gray-500">No medical history available</p>
      </div>
    );
  }

  const {
    previousConsultations = [],
    diagnoses = [],
    labResults = [],
    prescriptions = [],
    billingHistory = [],
    previousVisits = [],
  } = medicalHistory;

  return (
    <div className="h-full bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Medical History
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Previous Consultations */}
        {previousConsultations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
              Previous Consultations
            </h3>
            <div className="space-y-3">
              {previousConsultations.map((consultation, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {formatDate(consultation.date)}
                    </span>
                    <Badge variant="info" size="sm">
                      {consultation.doctor_name}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Symptoms:</span> {consultation.symptoms}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Diagnosis:</span> {consultation.diagnosis}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Diagnoses */}
        {diagnoses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
              Diagnoses
            </h3>
            <div className="space-y-2">
              {diagnoses.map((diagnosis, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">{diagnosis.diagnosis}</p>
                  {diagnosis.icd_code && (
                    <p className="text-xs text-gray-500 mt-1">ICD: {diagnosis.icd_code}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{formatDate(diagnosis.date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lab Results */}
        {labResults.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
              Lab Results
            </h3>
            <div className="space-y-3">
              {labResults.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">{result.test_name}</span>
                    <Badge 
                      variant={result.status === 'completed' ? 'success' : 'warning'} 
                      size="sm"
                    >
                      {result.status}
                    </Badge>
                  </div>
                  {result.result && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Result:</span> {result.result}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{formatDate(result.date)}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Prescriptions */}
        {prescriptions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
              Prescriptions
            </h3>
            <div className="space-y-2">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">{prescription.drug_name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {prescription.dosage} - {prescription.frequency} for {prescription.duration}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(prescription.date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing History */}
        {billingHistory.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
              Billing History
            </h3>
            <div className="space-y-2">
              {billingHistory.map((bill, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{bill.bill_number}</p>
                    <p className="text-xs text-gray-500">{formatDate(bill.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">${bill.amount}</p>
                    <Badge 
                      variant={bill.status === 'paid' ? 'success' : 'warning'} 
                      size="sm"
                    >
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous Visits */}
        {previousVisits.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
              Previous Visits
            </h3>
            <div className="space-y-2">
              {previousVisits.map((visit, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{visit.visit_type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(visit.date)} at {formatTime(visit.time)}
                      </p>
                    </div>
                    <Badge variant="info" size="sm">
                      {visit.department}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {previousConsultations.length === 0 && 
         diagnoses.length === 0 && 
         labResults.length === 0 && 
         prescriptions.length === 0 && 
         billingHistory.length === 0 && 
         previousVisits.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No medical history available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordPanel;
