# Requirements Document

## Introduction

This document specifies the requirements for a modern, professional Consultation Form UI component in the Hospital Management System. The consultation form is a critical interface used by doctors to record clinical encounters during patient appointments. The interface must support comprehensive data entry including patient information, vital signs, symptoms, diagnosis, prescriptions, and laboratory test requests while maintaining a medical-grade design aesthetic with clean spacing, calm color palette, and smooth user interactions.

## Glossary

- **Consultation Form**: The primary user interface component used by doctors to document patient clinical encounters
- **Vitals**: Physiological measurements including blood pressure, heart rate, temperature, height, weight, and SpO2
- **Prescription**: A medical order for medication including drug name, dosage, frequency, and duration
- **Lab Request**: A doctor's order for laboratory tests or diagnostic procedures
- **ICD**: International Classification of Diseases - a standardized diagnostic coding system
- **SpO2**: Blood oxygen saturation level measured as a percentage
- **Glassmorphism**: A UI design technique using frosted glass effects with transparency and blur
- **Neumorphism**: A design style featuring soft shadows and highlights to create subtle 3D effects
- **Floating Label**: An input field design where the label animates from placeholder to label position
- **Chief Complaint**: The primary symptom or reason for the patient's visit
- **Consultation Payload**: The structured data object sent to the backend API containing all consultation information
- **Backend Schema**: The predefined data structure expected by the server API

## Requirements

### Requirement 1

**User Story:** As a doctor, I want to view comprehensive patient information at the top of the consultation form, so that I can quickly verify patient identity and review appointment context before documenting the clinical encounter.

#### Acceptance Criteria

1. WHEN the Consultation Form loads, THE Consultation Form SHALL display the patient's full name, age, sex, and patient ID in a prominent header section
2. WHEN the Consultation Form loads, THE Consultation Form SHALL display the appointment date, time, and appointment type in the patient header section
3. WHEN the patient header section renders, THE Consultation Form SHALL format all patient demographic data with clear visual hierarchy and readable typography
4. WHEN the patient has known allergies, THE Consultation Form SHALL display allergy information with visual prominence in the patient header section
5. WHEN the patient header section displays, THE Consultation Form SHALL use a card-based layout with subtle visual effects consistent with the medical-grade design system

### Requirement 2

**User Story:** As a doctor, I want to record patient vital signs with appropriate input validation, so that I can capture accurate physiological measurements during the clinical encounter.

#### Acceptance Criteria

1. WHEN entering vital signs, THE Consultation Form SHALL provide input fields for blood pressure (systolic and diastolic), heart rate, temperature, height, weight, and SpO2
2. WHEN a doctor enters a blood pressure value, THE Consultation Form SHALL validate that systolic pressure is between 50 and 250 mmHg and diastolic pressure is between 30 and 150 mmHg
3. WHEN a doctor enters a heart rate value, THE Consultation Form SHALL validate that the value is between 30 and 220 beats per minute
4. WHEN a doctor enters a temperature value, THE Consultation Form SHALL validate that the value is between 35.0 and 42.0 degrees Celsius
5. WHEN a doctor enters a SpO2 value, THE Consultation Form SHALL validate that the value is between 70 and 100 percent
6. WHEN a doctor enters height and weight values, THE Consultation Form SHALL automatically calculate and display the Body Mass Index (BMI)
7. WHEN validation fails for any vital sign field, THE Consultation Form SHALL highlight the field with error styling and display a descriptive error message
8. WHEN all vital signs are entered correctly, THE Consultation Form SHALL store the values in a structured vitals object compatible with the backend schema

### Requirement 3

**User Story:** As a doctor, I want to document symptoms and diagnosis with flexible text input, so that I can record the patient's chief complaint and my clinical assessment.

#### Acceptance Criteria

1. WHEN documenting the clinical encounter, THE Consultation Form SHALL provide a text area for entering the patient's symptoms or chief complaint
2. WHEN documenting the clinical encounter, THE Consultation Form SHALL provide a text area for entering the diagnosis
3. WHEN entering diagnosis information, THE Consultation Form SHALL provide an optional field for ICD code entry
4. WHEN entering clinical notes, THE Consultation Form SHALL provide a text area for additional observations or notes
5. WHEN any text area receives focus, THE Consultation Form SHALL provide visual feedback through border highlighting or subtle glow effects
6. WHEN text areas are rendered, THE Consultation Form SHALL use floating label design patterns for improved user experience

### Requirement 4

**User Story:** As a doctor, I want to create prescriptions with multiple medications dynamically, so that I can specify all required medications for the patient's treatment plan.

#### Acceptance Criteria

1. WHEN creating a prescription, THE Consultation Form SHALL provide input fields for medicine name, dosage, frequency, and duration
2. WHEN a doctor clicks an "Add Medicine" button, THE Consultation Form SHALL add a new prescription row with empty input fields
3. WHEN a doctor clicks a "Remove" button on a prescription row, THE Consultation Form SHALL remove that specific prescription row from the form
4. WHEN prescription rows are added or removed, THE Consultation Form SHALL animate the transitions smoothly without jarring visual changes
5. WHEN at least one prescription row exists, THE Consultation Form SHALL validate that medicine name and dosage fields are not empty before form submission
6. WHEN prescription data is collected, THE Consultation Form SHALL structure the data as an array of prescription objects compatible with the backend schema
7. WHEN the form initializes, THE Consultation Form SHALL display at least one empty prescription row by default

### Requirement 5

**User Story:** As a doctor, I want to request laboratory tests with a selection interface, so that I can order diagnostic tests as part of the patient's care plan.

#### Acceptance Criteria

1. WHEN requesting laboratory tests, THE Consultation Form SHALL provide a selector or dropdown for choosing available lab tests
2. WHEN a doctor selects a lab test, THE Consultation Form SHALL add the test to a list of requested tests
3. WHEN a doctor clicks a "Remove" button on a lab request, THE Consultation Form SHALL remove that specific test from the requested tests list
4. WHEN lab requests are added or removed, THE Consultation Form SHALL animate the transitions smoothly
5. WHEN lab request data is collected, THE Consultation Form SHALL structure the data as an array of lab request objects compatible with the backend schema
6. WHEN multiple lab tests are requested, THE Consultation Form SHALL display all requested tests in a clear, organized list format

### Requirement 6

**User Story:** As a doctor, I want to submit the completed consultation form with proper feedback, so that I can save the clinical encounter data and understand the submission status.

#### Acceptance Criteria

1. WHEN a doctor clicks the submit button, THE Consultation Form SHALL validate all required fields before sending data to the server
2. WHEN the submit button is clicked and validation passes, THE Consultation Form SHALL send a POST request to the /consultations endpoint with the complete consultation payload
3. WHEN the form is submitting, THE Consultation Form SHALL display a loading state on the submit button and disable the button to prevent duplicate submissions
4. WHEN the server responds with a success status, THE Consultation Form SHALL display a success message to the doctor
5. WHEN the server responds with an error status, THE Consultation Form SHALL display an error message with details from the server response
6. WHEN form submission completes successfully, THE Consultation Form SHALL clear the form fields or navigate to an appropriate next screen
7. WHEN required fields are missing, THE Consultation Form SHALL prevent submission and highlight all fields with validation errors

### Requirement 7

**User Story:** As a doctor, I want the consultation form to follow medical-grade design principles, so that I can work in a professional, calming interface that reduces cognitive load during clinical documentation.

#### Acceptance Criteria

1. WHEN the Consultation Form renders, THE Consultation Form SHALL use a calm medical color palette with blue or teal as primary accent colors
2. WHEN the Consultation Form renders on desktop, THE Consultation Form SHALL use a two-column layout with patient information and vitals on the left and consultation details on the right
3. WHEN the Consultation Form renders on mobile devices, THE Consultation Form SHALL use a stacked single-column layout with all sections vertically arranged
4. WHEN any section of the form is displayed, THE Consultation Form SHALL use card-based layouts with rounded corners and subtle visual effects such as glassmorphism or neumorphism
5. WHEN text is displayed, THE Consultation Form SHALL use highly readable typography with appropriate font sizes and line heights for medical documentation
6. WHEN interactive elements receive focus or hover, THE Consultation Form SHALL provide smooth transitions and animations
7. WHEN form sections are rendered, THE Consultation Form SHALL use clear section titles with thin dividers to organize content logically
8. WHEN color contrast is measured, THE Consultation Form SHALL meet WCAG 2.1 AA accessibility standards for all text and interactive elements

### Requirement 8

**User Story:** As a doctor, I want the consultation form to be modular and maintainable, so that the development team can easily update and extend the interface without affecting other system components.

#### Acceptance Criteria

1. WHEN the Consultation Form is implemented, THE Consultation Form SHALL be composed of reusable components including VitalsCard, PrescriptionRow, and LabRequestRow
2. WHEN the Consultation Form communicates with the backend, THE Consultation Form SHALL use Axios for HTTP requests with proper error handling
3. WHEN the Consultation Form structures data for submission, THE Consultation Form SHALL ensure compatibility with the backend schema including visitId or appointmentId, vitals object, diagnosis, prescriptions array, and labRequests array
4. WHEN the Consultation Form is modified, THE Consultation Form SHALL not require changes to backend logic or API endpoints
5. WHEN components are created, THE Consultation Form SHALL follow React best practices including proper prop typing and component composition

### Requirement 9

**User Story:** As a doctor using a mobile device or tablet, I want the consultation form to be fully responsive and touch-friendly, so that I can document clinical encounters on any device.

#### Acceptance Criteria

1. WHEN the Consultation Form is accessed on a mobile device, THE Consultation Form SHALL adapt all input fields to be touch-friendly with appropriate sizing
2. WHEN the Consultation Form is accessed on a tablet, THE Consultation Form SHALL optimize the layout for the available screen space
3. WHEN the viewport width changes, THE Consultation Form SHALL smoothly transition between desktop and mobile layouts without loss of functionality
4. WHEN touch interactions occur on mobile devices, THE Consultation Form SHALL provide appropriate touch feedback for all interactive elements
5. WHEN the form is displayed on small screens, THE Consultation Form SHALL maintain readability and usability without requiring horizontal scrolling
