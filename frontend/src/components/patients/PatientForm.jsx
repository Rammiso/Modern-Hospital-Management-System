import React, { useState } from "react";
import { Input, Select, Textarea, Button, Alert } from "../common";
import { GENDER_OPTIONS, BLOOD_GROUPS } from "../../utils/constants";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateAge,
} from "../../utils/validators";

const PatientForm = ({ onSubmit, initialData, onCancel }) => {
  const data = initialData || {};

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
      setSubmitError(
        error.message || "Failed to save patient. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: GENDER_OPTIONS.MALE, label: "Male" },
    { value: GENDER_OPTIONS.FEMALE, label: "Female" },
    { value: GENDER_OPTIONS.OTHER, label: "Other" },
  ];

  const bloodGroupOptions = BLOOD_GROUPS.map((group) => ({
    value: group,
    label: group,
  }));

  return (
    <form onSubmit={handleSubmit} className="patient-form">
      {submitError && (
        <Alert type="error" onClose={() => setSubmitError("")}>
          {submitError}
        </Alert>
      )}

      <div className="form-grid">
        {/* Full Name */}
        <Input
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
          error={errors.full_name}
          placeholder="Enter patient's full name"
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          error={errors.phone}
          placeholder="+251 or 09..."
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="patient@example.com (optional)"
        />

        {/* Date of Birth */}
        <Input
          label="Date of Birth"
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          error={errors.date_of_birth}
        />

        {/* Gender */}
        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={genderOptions}
          required
          error={errors.gender}
          placeholder="Select gender"
        />

        {/* Blood Group */}
        <Select
          label="Blood Group"
          name="blood_group"
          value={formData.blood_group}
          onChange={handleChange}
          options={bloodGroupOptions}
          placeholder="Select blood group (optional)"
        />

        {/* Emergency Contact */}
        <Input
          label="Emergency Contact"
          type="tel"
          name="emergency_contact"
          value={formData.emergency_contact}
          onChange={handleChange}
          placeholder="Emergency contact number"
        />
      </div>

      {/* Address - Full width */}
      <Textarea
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        rows={3}
        placeholder="Enter full address"
      />

      {/* Allergies - Full width */}
      <Textarea
        label="Known Allergies"
        name="allergies"
        value={formData.allergies}
        onChange={handleChange}
        rows={3}
        maxLength={500}
        placeholder="List any known allergies (medications, food, etc.)"
      />

      {/* Form Actions */}
      <div className="form-actions">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : data.id
            ? "Update Patient"
            : "Register Patient"}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;
