import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatientHeaderCard from "./PatientHeaderCard";
import VitalsCard from "./VitalsCard";
import ClinicalDetailsCard from "./ClinicalDetailsCard";
import PrescriptionSection from "./PrescriptionSection";
import LabRequestSection from "./LabRequestSection";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Alert from "../common/Alert";
import { getAppointment, getLabTests, submitConsultation } from "../../services/consultationService";
import { validateConsultationForm, transformConsultationPayload } from "../../utils/consultationHelpers";
import { useAuth } from "../../context/AuthContext";

const ConsultationForm = () => {
  // Get appointmentId from URL params
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
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
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch appointment and patient data
  const fetchData = useCallback(async () => {
    if (!appointmentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);

    // Fetch appointment data
    const appointmentResponse = await getAppointment(appointmentId);
    if (appointmentResponse.success) {
      const appointmentData = appointmentResponse.data;
      setAppointment(appointmentData);
      
      // Patient data might be nested in appointment response
      if (appointmentData.patient) {
        setPatient(appointmentData.patient);
      }
    } else {
      console.error("Failed to fetch appointment:", appointmentResponse.error);
      setFetchError(appointmentResponse.error);
    }

    // Fetch available lab tests
    const labTestsResponse = await getLabTests();
    if (labTestsResponse.success) {
      setAvailableTests(labTestsResponse.data || []);
    } else {
      console.error("Failed to fetch lab tests:", labTestsResponse.error);
      // Don't block the form if lab tests fail to load
    }

    setLoading(false);
  }, [appointmentId]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Track unsaved changes
  useEffect(() => {
    // Check if any form fields have been modified
    const hasChanges =
      symptoms !== "" ||
      diagnosis !== "" ||
      icdCode !== "" ||
      notes !== "" ||
      Object.values(vitals).some((v) => v !== "") ||
      prescriptions.some((p) => p.drug_name !== "" || p.dosage !== "");

    setHasUnsavedChanges(hasChanges);
  }, [symptoms, diagnosis, icdCode, notes, vitals, prescriptions]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && !submitting) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, submitting]);

  // Handle vitals change
  const handleVitalsChange = useCallback((field, value) => {
    setVitals((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle prescription change
  const handlePrescriptionChange = useCallback((index, field, value) => {
    setPrescriptions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  }, []);

  // Handle lab request change
  const handleLabRequestChange = useCallback((index, field, value) => {
    setLabRequests((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
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
      { test_name: "", test_type: "", instructions: "" },
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

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Clear previous messages
      setSuccessMessage("");
      setErrorMessage("");

      // Prepare form data for validation
      const formData = {
        symptoms,
        diagnosis,
        vitals,
        prescriptions,
      };

      // Validate form
      const validationResult = validateConsultationForm(formData);

      if (!validationResult.isValid) {
        // Set errors and prevent submission
        setErrors(validationResult.errors);
        setErrorMessage("Please fix the validation errors before submitting.");
        return;
      }

      // Clear errors if validation passes
      setErrors({});

      // Set submitting state
      setSubmitting(true);

      try {
        // Get doctor ID from auth context or localStorage
        const doctorId = user?.id || localStorage.getItem("userId");

        if (!doctorId) {
          setErrorMessage("Unable to identify doctor. Please log in again.");
          setSubmitting(false);
          return;
        }

        // Transform form data to backend payload
        const payload = transformConsultationPayload({
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

        // Submit consultation
        const response = await submitConsultation(payload);

        if (response.success) {
          // Show success message
          setSuccessMessage(response.message || "Consultation saved successfully");
          
          // Clear unsaved changes flag
          setHasUnsavedChanges(false);
          
          // Navigate to appointments page after a short delay
          setTimeout(() => {
            navigate("/appointments");
          }, 1500);
        } else {
          // Show error message from server
          // Check for specific error message from response
          const errorMsg = response.error || "Failed to submit consultation";
          setErrorMessage(errorMsg);
          
          // If there are detailed validation errors, set them
          if (response.details && Object.keys(response.details).length > 0) {
            setErrors(response.details);
          }
        }
      } catch (error) {
        // Handle unexpected errors
        console.error("Submission error:", error);
        setErrorMessage("Network error. Please check your connection and try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [symptoms, diagnosis, vitals, prescriptions, labRequests, icdCode, notes, appointment, patient, user, navigate]
  );

  // Show loader while fetching data
  if (loading) {
    return <Loader />;
  }

  // Show error if appointment fetch failed
  if (fetchError && !loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Alert type="error" message={fetchError} />
          </div>
          <Button onClick={fetchData} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Show error if appointment not found
  if (!loading && (!appointment || !patient)) {
    return (
      <div className="flex justify-center items-center p-16">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Alert 
              type="error" 
              message="Appointment not found or unable to load appointment data." 
            />
          </div>
          <Button onClick={fetchData} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        {/* Display success message */}
        {successMessage && (
          <div className="mb-6">
            <Alert type="success" message={successMessage} />
          </div>
        )}

        {/* Display error message */}
        {errorMessage && (
          <div className="mb-6">
            <Alert type="error" message={errorMessage} />
          </div>
        )}

        {/* Two-column grid layout: desktop 2 columns, mobile 1 column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Patient Header and Vitals */}
          <div className="space-y-6">
            <PatientHeaderCard patient={patient} appointment={appointment} />
            <VitalsCard
              vitals={vitals}
              onChange={handleVitalsChange}
              errors={errors}
            />
          </div>

          {/* Right Column: Clinical Details, Prescriptions, Lab Requests */}
          <div className="space-y-6">
            <ClinicalDetailsCard
              symptoms={symptoms}
              diagnosis={diagnosis}
              icdCode={icdCode}
              notes={notes}
              onChange={handleClinicalDetailsChange}
              errors={errors}
            />
            <PrescriptionSection
              prescriptions={prescriptions}
              onChange={handlePrescriptionChange}
              onAdd={addPrescription}
              onRemove={removePrescription}
              errors={errors}
            />
            <LabRequestSection
              labRequests={labRequests}
              availableTests={availableTests}
              onChange={handleLabRequestChange}
              onAdd={addLabRequest}
              onRemove={removeLabRequest}
              errors={errors}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            className="px-8"
          >
            {submitting ? "Saving..." : "Save Consultation"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;
