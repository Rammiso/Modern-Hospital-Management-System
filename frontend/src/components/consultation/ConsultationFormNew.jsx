import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatientHeaderCard from "./PatientHeaderCard";
import VitalsCard from "./VitalsCard";
import ClinicalDetailsCard from "./ClinicalDetailsCard";
import PrescriptionSection from "./PrescriptionSection";
import LabRequestSection from "./LabRequestSection";
import MedicalRecordPanel from "./MedicalRecordPanel";
import OngoingConsultationsPanel from "./OngoingConsultationsPanel";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Alert from "../common/Alert";
import {
  getOrCreateConsultation,
  getLabTests,
  submitConsultation,
  finishConsultation,
  saveDraft,
  sendLabRequest,
  getLabRequestStatus,
  getPatientMedicalHistory,
  getOngoingConsultations,
} from "../../services/consultationService";
import { validateConsultationForm, transformConsultationPayload } from "../../utils/consultationHelpers";
import { useAuth } from "../../context/AuthContext";

/**
 * ConsultationFormNew - Complete consultation form with three-panel layout
 * Left: Medical History | Center: Consultation Form | Right: Ongoing Consultations
 */
const ConsultationFormNew = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const pollIntervalRef = useRef(null);

  // Core state
  const [consultation, setConsultation] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [consultationStatus, setConsultationStatus] = useState("DRAFT"); // DRAFT, WAITING_FOR_LAB_RESULTS, READY_FOR_REVIEW, COMPLETED

  // Form state
  const [vitals, setVitals] = useState({
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    heart_rate: "",
    temperature: "",
    height: "",
    weight: "",
    spo2: "",
  });
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [icdCode, setIcdCode] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    { drug_name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [labRequests, setLabRequests] = useState([]);

  // Panel state
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [ongoingConsultations, setOngoingConsultations] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [sendingLab, setSendingLab] = useState(false);
  const [submittingPrescription, setSubmittingPrescription] = useState(false);
  const [prescriptionSubmitted, setPrescriptionSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [medicalHistoryLoading, setMedicalHistoryLoading] = useState(false);
  const [ongoingLoading, setOngoingLoading] = useState(false);

  // Fetch consultation data
  const fetchConsultationData = useCallback(async () => {
    if (!appointmentId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Get or create consultation
      const consultationResponse = await getOrCreateConsultation(appointmentId);
      if (consultationResponse.success) {
        const consultationData = consultationResponse.data;
        setConsultation(consultationData);
        setAppointment(consultationData.appointment);
        setPatient(consultationData.patient);
        setConsultationStatus(consultationData.status || "DRAFT");

        // Load existing data if consultation exists
        if (consultationData.vitals) {
          setVitals(consultationData.vitals);
        }
        if (consultationData.symptoms) setSymptoms(consultationData.symptoms);
        if (consultationData.diagnosis) setDiagnosis(consultationData.diagnosis);
        if (consultationData.icd_code) setIcdCode(consultationData.icd_code);
        if (consultationData.notes) setNotes(consultationData.notes);
        if (consultationData.prescriptions && consultationData.prescriptions.length > 0) {
          setPrescriptions(consultationData.prescriptions);
          // If prescriptions exist in saved consultation, mark as submitted
          setPrescriptionSubmitted(true);
        }
        if (consultationData.lab_requests && consultationData.lab_requests.length > 0) {
          setLabRequests(consultationData.lab_requests);
        }

        // Start polling if waiting for lab results
        if (consultationData.status === "WAITING_FOR_LAB_RESULTS" && consultationData.lab_request_id) {
          startLabPolling(consultationData.lab_request_id);
        }
      } else {
        setErrorMessage(consultationResponse.error);
      }

      // Fetch available lab tests
      const labTestsResponse = await getLabTests();
      if (labTestsResponse.success) {
        setAvailableTests(labTestsResponse.data || []);
      }
    } catch (error) {
      console.error("Error fetching consultation:", error);
      setErrorMessage("Failed to load consultation data");
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  // Fetch medical history
  const fetchMedicalHistory = useCallback(async () => {
    if (!patient?.id) return;

    setMedicalHistoryLoading(true);
    const response = await getPatientMedicalHistory(patient.id);
    if (response.success) {
      setMedicalHistory(response.data);
    }
    setMedicalHistoryLoading(false);
  }, [patient]);

  // Fetch ongoing consultations
  const fetchOngoingConsultations = useCallback(async () => {
    setOngoingLoading(true);
    const response = await getOngoingConsultations();
    if (response.success) {
      setOngoingConsultations(response.data || []);
    }
    setOngoingLoading(false);
  }, []);

  // Start polling for lab results
  const startLabPolling = useCallback((labRequestId) => {
    // Clear any existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    // Poll every 20 seconds
    pollIntervalRef.current = setInterval(async () => {
      const response = await getLabRequestStatus(labRequestId);
      if (response.success && response.data.status === "completed") {
        // Lab results are ready
        setConsultationStatus("READY_FOR_REVIEW");
        clearInterval(pollIntervalRef.current);
        setSuccessMessage("Lab results received! You can now continue the consultation.");
      }
    }, 20000); // 20 seconds
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchConsultationData();
    fetchOngoingConsultations();
  }, [fetchConsultationData, fetchOngoingConsultations]);

  // Fetch medical history when patient is loaded
  useEffect(() => {
    if (patient) {
      fetchMedicalHistory();
    }
  }, [patient, fetchMedicalHistory]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Handle vitals change
  const handleVitalsChange = useCallback((field, value) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle prescription change
  const handlePrescriptionChange = useCallback((index, field, value) => {
    setPrescriptions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Handle lab request change
  const handleLabRequestChange = useCallback((index, field, value) => {
    setLabRequests((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Add prescription
  const addPrescription = useCallback(() => {
    setPrescriptions((prev) => [
      ...prev,
      { drug_name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  }, []);

  // Remove prescription
  const removePrescription = useCallback((index) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Add lab request
  const addLabRequest = useCallback(() => {
    setLabRequests((prev) => [
      ...prev,
      { test_name: "", urgency: "normal", instructions: "" },
    ]);
  }, []);

  // Remove lab request
  const removeLabRequest = useCallback((index) => {
    setLabRequests((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Handle clinical details change
  const handleClinicalDetailsChange = useCallback((field, value) => {
    switch (field) {
      case "symptoms":
        setSymptoms(value);
        break;
      case "diagnosis":
        setDiagnosis(value);
        break;
      case "icdCode":
        setIcdCode(value);
        break;
      case "notes":
        setNotes(value);
        break;
      default:
        break;
    }
  }, []);

  // Save draft
  const handleSaveDraft = useCallback(async () => {
    setSavingDraft(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const doctorId = user?.id || localStorage.getItem("userId");
      const payload = transformConsultationPayload({
        consultation,
        appointment,
        patient,
        vitals,
        symptoms,
        diagnosis,
        icdCode,
        notes,
        prescriptions,
        labRequests,
        doctorId,
      });

      const response = await saveDraft(payload);
      if (response.success) {
        setSuccessMessage("Draft saved successfully");
        setConsultation(response.data);
      } else {
        setErrorMessage(response.error);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      setErrorMessage("Failed to save draft");
    } finally {
      setSavingDraft(false);
    }
  }, [consultation, appointment, patient, vitals, symptoms, diagnosis, icdCode, notes, prescriptions, labRequests, user]);

  // Submit prescription to pharmacy
  const handleSubmitPrescription = useCallback(async () => {
    setSubmittingPrescription(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Validate prescriptions
    const validPrescriptions = prescriptions.filter(
      (p) => p.drug_name && p.drug_name.trim() !== "" && p.dosage && p.dosage.trim() !== ""
    );

    if (validPrescriptions.length === 0) {
      setErrorMessage("Please add at least one prescription with drug name and dosage");
      setSubmittingPrescription(false);
      return;
    }

    try {
      // First save the consultation with prescriptions
      const doctorId = user?.id || localStorage.getItem("userId");
      const payload = transformConsultationPayload({
        consultation,
        appointment,
        patient,
        vitals,
        symptoms,
        diagnosis,
        icdCode,
        notes,
        prescriptions,
        labRequests,
        doctorId,
      });

      const response = await saveDraft(payload);
      if (response.success) {
        setPrescriptionSubmitted(true);
        setSuccessMessage("Prescription submitted to pharmacy successfully! You can now finish the consultation.");
        setConsultation(response.data);
      } else {
        setErrorMessage(response.error || "Failed to submit prescription");
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
      setErrorMessage("Failed to submit prescription to pharmacy");
    } finally {
      setSubmittingPrescription(false);
    }
  }, [prescriptions, consultation, appointment, patient, vitals, symptoms, diagnosis, icdCode, notes, labRequests, user]);

  // Send lab request
  const handleSendToLab = useCallback(async () => {
    if (labRequests.length === 0) {
      setErrorMessage("Please add at least one lab test");
      return;
    }

    // Validate lab requests
    const hasEmptyTests = labRequests.some(req => !req.test_name);
    if (hasEmptyTests) {
      setErrorMessage("Please select a test for all lab requests");
      return;
    }

    setSendingLab(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const doctorId = user?.id || localStorage.getItem("userId");
      
      // First save as draft
      const draftPayload = transformConsultationPayload({
        consultation,
        appointment,
        patient,
        vitals,
        symptoms,
        diagnosis,
        icdCode,
        notes,
        prescriptions,
        labRequests,
        doctorId,
      });

      const draftResponse = await saveDraft(draftPayload);
      if (!draftResponse.success) {
        setErrorMessage("Failed to save consultation before sending lab request");
        setSendingLab(false);
        return;
      }

      // Send lab request
      const labPayload = {
        consultation_id: draftResponse.data.id || consultation?.id,
        lab_requests: labRequests,
      };

      const response = await sendLabRequest(labPayload);
      if (response.success) {
        setConsultationStatus("WAITING_FOR_LAB_RESULTS");
        setSuccessMessage("Lab tests sent successfully. Consultation paused until results are available.");
        
        // Start polling for results
        if (response.data.lab_request_id) {
          startLabPolling(response.data.lab_request_id);
        }

        // Refresh ongoing consultations
        fetchOngoingConsultations();
      } else {
        setErrorMessage(response.error);
      }
    } catch (error) {
      console.error("Error sending lab request:", error);
      setErrorMessage("Failed to send lab request");
    } finally {
      setSendingLab(false);
    }
  }, [labRequests, consultation, appointment, patient, vitals, symptoms, diagnosis, icdCode, notes, prescriptions, user, startLabPolling, fetchOngoingConsultations]);

  // Finish consultation
  const handleFinishConsultation = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Validate form
    const formData = { symptoms, diagnosis, vitals, prescriptions };
    const validationResult = validateConsultationForm(formData);

    if (!validationResult.isValid) {
      console.log('Validation errors:', validationResult.errors);
      console.log('Form data:', formData);
      setErrors(validationResult.errors);
      
      // Create detailed error message
      const errorFields = Object.keys(validationResult.errors);
      const errorList = errorFields.map(field => {
        const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return fieldName;
      }).join(', ');
      
      setErrorMessage(`Validation failed. Please check: ${errorList}`);
      setSubmitting(false);
      
      // Scroll to first error
      setTimeout(() => {
        const firstErrorElement = document.querySelector('[class*="border-red"]');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }

    setErrors({});

    try {
      // First, save the consultation with all data
      const doctorId = user?.id || localStorage.getItem("userId");
      const draftPayload = transformConsultationPayload({
        consultation,
        appointment,
        patient,
        vitals,
        symptoms,
        diagnosis,
        icdCode,
        notes,
        prescriptions,
        labRequests,
        doctorId,
      });

      // Save draft first to ensure all data is persisted
      const draftResponse = await saveDraft(draftPayload);
      if (!draftResponse.success) {
        setErrorMessage(draftResponse.error || "Failed to save consultation data");
        setSubmitting(false);
        return;
      }

      // Now finish the consultation (mark as completed)
      const finishPayload = {
        consultation_id: consultation?.id,
        id: consultation?.id,
      };

      const response = await finishConsultation(finishPayload);
      if (response.success) {
        setSuccessMessage("Consultation completed successfully");
        setConsultationStatus("COMPLETED");
        
        // Navigate after delay
        setTimeout(() => {
          navigate("/appointments");
        }, 1500);
      } else {
        setErrorMessage(response.error);
        if (response.details) {
          setErrors(response.details);
        }
      }
    } catch (error) {
      console.error("Error finishing consultation:", error);
      setErrorMessage("Failed to complete consultation");
    } finally {
      setSubmitting(false);
    }
  }, [symptoms, diagnosis, vitals, prescriptions, consultation, appointment, patient, icdCode, notes, labRequests, user, navigate]);

  // Check if save draft should be enabled
  const canSaveDraft = () => {
    const hasPrescriptions = prescriptions.some(p => p.drug_name && p.dosage);
    const hasLabRequests = labRequests.some(l => l.test_name);
    return hasPrescriptions || hasLabRequests;
  };

  // Check if fields should be disabled
  const isWaitingForLab = consultationStatus === "WAITING_FOR_LAB_RESULTS";
  const fieldsDisabled = isWaitingForLab;

  if (loading) {
    return <Loader />;
  }

  if (!appointment || !patient) {
    return (
      <div className="flex justify-center items-center p-16">
        <Alert type="error" message="Consultation data not found" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-cyan-50">
      {/* Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert type="success" message={successMessage} />
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert type="error" message={errorMessage} />
        </div>
      )}

      {/* Three-Panel Layout */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Panel - Medical History */}
        <div className="w-1/4 overflow-hidden">
          <MedicalRecordPanel 
            medicalHistory={medicalHistory} 
            loading={medicalHistoryLoading}
          />
        </div>

        {/* Center Panel - Consultation Form */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleFinishConsultation} className="space-y-6 pb-6">
            {/* Patient Header */}
            <PatientHeaderCard 
              patient={patient} 
              appointment={appointment}
              hasOngoingLabTests={isWaitingForLab}
            />

            {/* Lab Request Section - ABOVE Diagnosis */}
            <LabRequestSection
              labRequests={labRequests}
              availableTests={availableTests}
              onChange={handleLabRequestChange}
              onAdd={addLabRequest}
              onRemove={removeLabRequest}
              onSendToLab={handleSendToLab}
              errors={errors}
              consultationStatus={consultationStatus}
              disabled={sendingLab}
            />

            {/* Vitals */}
            <VitalsCard
              vitals={vitals}
              onChange={handleVitalsChange}
              errors={errors}
            />

            {/* Clinical Details - Diagnosis Section */}
            <ClinicalDetailsCard
              symptoms={symptoms}
              diagnosis={diagnosis}
              icdCode={icdCode}
              notes={notes}
              onChange={handleClinicalDetailsChange}
              errors={errors}
              disabled={fieldsDisabled}
            />

            {/* Prescriptions */}
            <PrescriptionSection
              prescriptions={prescriptions}
              onChange={handlePrescriptionChange}
              onAdd={addPrescription}
              onRemove={removePrescription}
              errors={errors}
              disabled={fieldsDisabled}
            />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sticky bottom-0 bg-white/90 backdrop-blur-lg p-4 rounded-xl border border-gray-200 shadow-lg">
              {/* Prescription Submission Notice */}
              {!prescriptionSubmitted && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>Important:</strong> You must submit the prescription to pharmacy before finishing the consultation.
                  </span>
                </div>
              )}

              {/* Success Notice */}
              {prescriptionSubmitted && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>Prescription Submitted!</strong> You can now finish the consultation.
                  </span>
                </div>
              )}

              {/* Button Row */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveDraft}
                  disabled={savingDraft || !canSaveDraft() || isWaitingForLab}
                >
                  {savingDraft ? "Saving..." : "Save Draft"}
                </Button>
                
                <Button
                  type="button"
                  variant="success"
                  onClick={handleSubmitPrescription}
                  disabled={submittingPrescription || prescriptionSubmitted || isWaitingForLab || prescriptions.filter(p => p.drug_name && p.dosage).length === 0}
                  className={prescriptionSubmitted ? "opacity-50" : ""}
                >
                  {submittingPrescription ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : prescriptionSubmitted ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submitted to Pharmacy
                    </span>
                  ) : (
                    "Submit Prescription to Pharmacy"
                  )}
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting || isWaitingForLab || !prescriptionSubmitted}
                  title={!prescriptionSubmitted ? "Please submit prescription to pharmacy first" : ""}
                >
                  {submitting ? "Finishing..." : "Finish Consultation"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Panel - Ongoing Consultations */}
        <div className="w-1/4 overflow-hidden">
          <OngoingConsultationsPanel 
            consultations={ongoingConsultations}
            currentConsultationId={consultation?.id}
            loading={ongoingLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsultationFormNew;
