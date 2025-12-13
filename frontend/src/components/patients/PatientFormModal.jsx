import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GENDER_OPTIONS, BLOOD_GROUPS } from "../../utils/constants";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateAge,
} from "../../utils/validators";

const PatientFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
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
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save patient. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="backdrop-blur-xl bg-slate-900/95 rounded-2xl border-2 border-indigo-500/30 
                   shadow-2xl shadow-indigo-500/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {isEditing ? "✏️ Edit Patient" : "➕ Register New Patient"}
                </h2>
                <p className="text-indigo-300/70">
                  {isEditing
                    ? "Update patient information"
                    : "Add a new patient to the system"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-indigo-300 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
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
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Alert */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-300"
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
                </div>
                <p className="text-red-300 font-semibold flex-1">{submitError}</p>
                <button
                  type="button"
                  onClick={() => setSubmitError("")}
                  className="text-red-300 hover:text-red-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )}

            {/* Section: Personal Information */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-indigo-500/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
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
                <h3 className="text-lg font-bold text-white">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white
                             focus:outline-none focus:ring-2 transition-all duration-300 ${
                               errors.full_name
                                 ? "border-red-500/50 focus:ring-red-500/50"
                                 : "border-indigo-500/30 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                             }`}
                    placeholder="Enter full name"
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-400">{errors.full_name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white
                             focus:outline-none focus:ring-2 transition-all duration-300 ${
                               errors.phone
                                 ? "border-red-500/50 focus:ring-red-500/50"
                                 : "border-indigo-500/30 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                             }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white
                             focus:outline-none focus:ring-2 transition-all duration-300 ${
                               errors.email
                                 ? "border-red-500/50 focus:ring-red-500/50"
                                 : "border-indigo-500/30 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                             }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white
                             focus:outline-none focus:ring-2 transition-all duration-300 ${
                               errors.date_of_birth
                                 ? "border-red-500/50 focus:ring-red-500/50"
                                 : "border-indigo-500/30 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                             }`}
                  />
                  {errors.date_of_birth && (
                    <p className="mt-1 text-sm text-red-400">{errors.date_of_birth}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white
                             focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                               errors.gender
                                 ? "border-red-500/50 focus:ring-red-500/50"
                                 : "border-indigo-500/30 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                             }`}
                  >
                    <option value="" className="bg-slate-800">Select gender</option>
                    <option value={GENDER_OPTIONS.MALE} className="bg-slate-800">Male</option>
                    <option value={GENDER_OPTIONS.FEMALE} className="bg-slate-800">Female</option>
                    <option value={GENDER_OPTIONS.OTHER} className="bg-slate-800">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-400">{errors.gender}</p>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Blood Group
                  </label>
                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-indigo-500/30 rounded-xl text-white
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                             transition-all duration-300 appearance-none"
                  >
                    <option value="" className="bg-slate-800">Select blood group</option>
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group} className="bg-slate-800">
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Contact & Emergency */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-indigo-500/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
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
                <h3 className="text-lg font-bold text-white">Contact & Emergency</h3>
              </div>

              <div className="space-y-4">
                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-indigo-500/30 rounded-xl text-white
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                             transition-all duration-300"
                    placeholder="Enter emergency contact number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-indigo-300 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-indigo-500/30 rounded-xl text-white
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                             transition-all duration-300 resize-none"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Section: Medical Information */}
            <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-indigo-500/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
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
                <h3 className="text-lg font-bold text-white">Medical Information</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-indigo-300 mb-2">
                  Known Allergies
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-white/5 border border-indigo-500/30 rounded-xl text-white
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                           transition-all duration-300 resize-none"
                  placeholder="List any known allergies (e.g., Penicillin, Peanuts)"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-indigo-500/30 
                         hover:border-indigo-500/50 text-indigo-300 hover:text-indigo-200 font-semibold rounded-xl
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
                         hover:from-indigo-600 hover:to-purple-600
                         text-white font-semibold rounded-xl
                         shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50
                         transition-all duration-300 transform hover:scale-105
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {isEditing ? "Update Patient" : "Register Patient"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PatientFormModal;
