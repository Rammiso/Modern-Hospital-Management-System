import React, { useState } from "react";
import { GENDER_OPTIONS, BLOOD_GROUPS } from "../../utils/constants";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateAge,
} from "../../utils/validators";

// Floating Label Input Component - MOVED OUTSIDE to prevent re-creation
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  required = false,
  error,
  onChange,
  onFocus,
  onBlur,
  isFocused,
}) => {
  const hasValue = value && value.length > 0;
  // Date inputs should always keep label floating
  const shouldFloat = isFocused || hasValue || type === "date";

  return (
    <div className="relative">
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`peer w-full px-4 ${
          shouldFloat ? "pt-6 pb-2" : "py-3"
        } rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-300 outline-none cursor-text ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
            : isFocused || hasValue
            ? "border-medical-400 focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/20 shadow-glow"
            : "border-medical-200 hover:border-medical-300"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          shouldFloat
            ? "top-2 text-xs font-medium text-medical-600"
            : "top-3.5 text-base text-slate-500"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-pulse">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// Floating Label Select Component - MOVED OUTSIDE to prevent re-creation
const FloatingSelect = ({
  label,
  name,
  value,
  required = false,
  error,
  options,
  onChange,
  onFocus,
  onBlur,
  isFocused,
}) => {
  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`peer w-full px-4 ${
          shouldFloat ? "pt-6 pb-2" : "py-3"
        } rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-300 outline-none appearance-none cursor-pointer ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
            : isFocused || hasValue
            ? "border-medical-400 focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/20 shadow-glow"
            : "border-medical-200 hover:border-medical-300"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          shouldFloat
            ? "top-2 text-xs font-medium text-medical-600"
            : "top-3.5 text-base text-slate-500"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <svg
        className={`absolute right-4 ${
          shouldFloat ? "top-5" : "top-4"
        } w-5 h-5 text-medical-400 pointer-events-none transition-all duration-300`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-pulse">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// Floating Label Textarea Component - MOVED OUTSIDE to prevent re-creation
const FloatingTextarea = ({
  label,
  name,
  value,
  rows = 3,
  maxLength,
  onChange,
  onFocus,
  onBlur,
  isFocused,
}) => {
  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className="relative">
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        rows={rows}
        maxLength={maxLength}
        className={`peer w-full px-4 ${
          shouldFloat ? "pt-6 pb-2" : "py-3"
        } rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-300 outline-none resize-none cursor-text ${
          isFocused || hasValue
            ? "border-medical-400 focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/20 shadow-glow"
            : "border-medical-200 hover:border-medical-300"
        }`}
      />
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          shouldFloat
            ? "top-2 text-xs font-medium text-medical-600"
            : "top-3.5 text-base text-slate-500"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const PatientForm = ({ onSubmit, initialData, onCancel }) => {
  const data = initialData || {};
  const isEditing = !!data.id;

  const [formData, setFormData] = useState({
    full_name: data.full_name || "",
    phone: data.phone || "",
    email: data.email || "",
    date_of_birth: data.date_of_birth || "",
    gender: data.gender || "",
    address: data.address || "",
    emergency_contact: data.emergency_contact || "",
    blood_group: data.blood_group || "",
    allergies: data.allergies || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    const nameError = validateRequired(formData.full_name, "Full name");
    if (nameError) newErrors.full_name = nameError;

    // Phone validation
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    // Email validation (optional but must be valid if provided)
    if (formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    // Date of birth validation
    if (formData.date_of_birth) {
      const ageError = validateAge(formData.date_of_birth);
      if (ageError) newErrors.date_of_birth = ageError;
    }

    // Gender validation
    const genderError = validateRequired(formData.gender, "Gender");
    if (genderError) newErrors.gender = genderError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Submit error:", error);
      // Handle error response from backend
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save patient. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: "", label: "" },
    { value: GENDER_OPTIONS.MALE, label: "Male" },
    { value: GENDER_OPTIONS.FEMALE, label: "Female" },
    { value: GENDER_OPTIONS.OTHER, label: "Other" },
  ];

  const bloodGroupOptions = [
    { value: "", label: "" },
    ...BLOOD_GROUPS.map((group) => ({
      value: group,
      label: group,
    })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-accent-cyan mb-2">
            {data.id ? "Update Patient" : "Patient Registration"}
          </h1>
          <p className="text-slate-600">
            {data.id
              ? "Update patient information"
              : "Register a new patient in the system"}
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-glass border border-medical-200/50 p-8 transition-all duration-300 hover:shadow-glow">
            {/* Error Alert */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-pulse">
                <svg
                  className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 font-medium">{submitError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitError("")}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Section: Personal Information */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-500 to-accent-cyan flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingInput
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  required
                  error={errors.full_name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("full_name")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "full_name"}
                />

                <FloatingInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  required
                  error={errors.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "phone"}
                />

                <FloatingInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  error={errors.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "email"}
                />

                <FloatingInput
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  error={errors.date_of_birth}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("date_of_birth")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "date_of_birth"}
                />

                <FloatingSelect
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  required
                  error={errors.gender}
                  options={genderOptions}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("gender")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "gender"}
                />

                <FloatingSelect
                  label="Blood Group"
                  name="blood_group"
                  value={formData.blood_group}
                  options={bloodGroupOptions}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("blood_group")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "blood_group"}
                />
              </div>
            </div>

            {/* Section: Contact & Emergency */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-medical-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Contact & Emergency
                </h2>
              </div>

              <div className="space-y-6">
                <FloatingInput
                  label="Emergency Contact"
                  name="emergency_contact"
                  type="tel"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("emergency_contact")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "emergency_contact"}
                />

                <FloatingTextarea
                  label="Address"
                  name="address"
                  value={formData.address}
                  rows={3}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "address"}
                />
              </div>
            </div>

            {/* Section: Medical Information */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-teal to-medical-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Medical Information
                </h2>
              </div>

              <FloatingTextarea
                label="Known Allergies"
                name="allergies"
                value={formData.allergies}
                rows={3}
                maxLength={500}
                onChange={handleChange}
                onFocus={() => setFocusedField("allergies")}
                onBlur={() => setFocusedField(null)}
                isFocused={focusedField === "allergies"}
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-medical-200">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-white/70 backdrop-blur-sm text-slate-700 font-semibold rounded-xl border-2 border-medical-200 hover:border-medical-400 hover:bg-medical-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-medical-500 to-accent-cyan text-white font-semibold rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {data.id ? "Update Patient" : "Register Patient"}
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
