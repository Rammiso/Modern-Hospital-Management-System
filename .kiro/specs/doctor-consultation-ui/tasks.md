# Implementation Plan: Doctor Consultation UI

## Current Status

**Codebase Analysis Summary:**
- ✅ Basic project structure exists with React 18, Tailwind CSS, React Router
- ✅ Common components available: Input, Select, Textarea, Button, Card, Badge, Alert, Modal, Loader
- ✅ Existing validators: BP (70-250/40-150), temperature (35-42°C), pulse (40-200 bpm), weight (0.5-500 kg), height (30-300 cm)
- ✅ Existing helpers: calculateAge, formatDate, formatTime
- ✅ API service structure established with axios interceptors
- ✅ Consultation page exists but only has placeholder content
- ❌ No consultation-specific components exist yet
- ❌ No consultation service exists yet
- ❌ No testing framework set up (Vitest/fast-check needed for property tests)
- ❌ Backend consultation endpoints need to be created

**Key Findings:**
- Existing BP validator uses 70-250/40-150 ranges, but design spec requires 50-250/30-150
- Existing pulse validator uses 40-200 range, but design spec requires 30-220
- No SpO2 validator exists yet (need 70-100%)
- No BMI calculation helper exists yet
- No consultation folder in components directory

**Implementation Approach:**
This task list focuses on building the consultation form UI from scratch, leveraging existing common components and utilities where possible. All property-based tests are marked as optional (*) since no testing framework is currently set up. The implementation follows a bottom-up approach: utilities → reusable components → section components → main form → integration.

## Task List

- [x] 1. Set up consultation service and utilities





  - Create `consultationService.js` in `frontend/src/services/` with functions for fetching appointments and submitting consultations
  - Update `validateBloodPressure` in `frontend/src/utils/validators.js` to use design spec ranges (systolic: 50-250, diastolic: 30-150)
  - Update `validatePulseRate` in `frontend/src/utils/validators.js` to use design spec range (30-220 bpm)
  - Add `validateSpO2` function to `frontend/src/utils/validators.js` for SpO2 validation (70-100%)
  - Create `frontend/src/utils/consultationHelpers.js` with BMI calculation (weight / (height/100)²) and consultation payload transformation utilities
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 8.3_
  - _Note: Existing validators need range updates to match design spec_

- [ ] 1.1 Write property test for vital signs validation





  - **Property 2: Vital Signs Validation - Blood Pressure**
  - **Property 3: Vital Signs Validation - Heart Rate**
  - **Property 4: Vital Signs Validation - Temperature**
  - **Property 5: Vital Signs Validation - SpO2**
  - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**
  - _Note: Requires setting up Vitest and fast-check testing framework first_

- [ ]* 1.2 Write property test for BMI calculation
  - **Property 6: BMI Calculation Accuracy**
  - **Validates: Requirements 2.6**

- [x] 2. Create consultation components folder and reusable form components





  - Create `frontend/src/components/consultation/` directory
  - Create `VitalInput.jsx` component with floating label design, unit display (mmHg, bpm, °C, cm, kg, %), and error handling
  - Create `PrescriptionRow.jsx` component with Input fields for drug_name, dosage, frequency, duration, and instructions (optional)
  - Create `LabRequestRow.jsx` component with Select for test selection and Textarea for instructions
  - Add Tailwind transition classes for smooth animations (transition-all duration-300 ease-in-out)
  - _Requirements: 4.1, 4.2, 4.3, 5.1, 8.1_
  - _Note: Leverage existing Input, Select, Textarea components from common folder_

- [x] 2.1 Write unit tests for reusable components





  - Test VitalInput renders correctly with props
  - Test PrescriptionRow renders all fields
  - Test LabRequestRow renders with selector
  - _Requirements: 4.1, 5.1_
  - _Note: Requires setting up Vitest and React Testing Library first_



- [x] 3. Build PatientHeaderCard component





  - Create `PatientHeaderCard.jsx` in `frontend/src/components/consultation/`
  - Display patient demographic information (full_name, patient_id, gender)
  - Use existing `calculateAge()` helper from `utils/helpers.js` to calculate age from date_of_birth
  - Use existing `formatDate()` and `formatTime()` helpers to display appointment_date and appointment_time
  - Display appointment type
  - Add conditional allergy badge with warning styling (bg-red-100 text-red-800) when patient.allergies is not empty
  - Apply glassmorphism card styling: bg-white/70 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg
  - Use Tailwind grid (grid grid-cols-2 md:grid-cols-4 gap-4) for responsive patient information layout
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 7.1, 7.4_
  - _Note: Leverage existing Badge component for allergy display_

- [x] 3.1 Write property test for allergy display





  - **Property 1: Allergy Display Consistency**
  - **Validates: Requirements 1.4**

- [x] 3.2 Write unit tests for PatientHeaderCard





  - Test component renders with patient data
  - Test age calculation from date of birth
  - Test appointment details display
  - _Requirements: 1.1, 1.2_

- [ ] 4. Build VitalsCard component




  - Create `VitalsCard.jsx` in `frontend/src/components/consultation/`
  - Create card with Tailwind grid layout (grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4)
  - Integrate VitalInput components for: blood_pressure_systolic, blood_pressure_diastolic, heart_rate (pulse_rate), temperature, height, weight, spo2
  - Implement real-time BMI calculation using calculateBMI helper from consultationHelpers.js, display with 2 decimal places
  - Add onBlur validation for each vital sign using updated validators (validateBloodPressure, validatePulseRate, validateTemperature, validateSpO2, validateHeight, validateWeight)
  - Pass error prop to VitalInput components to display validation errors
  - Apply card styling: bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow p-6
  - _Requirements: 2.1, 2.6, 2.7, 7.4_

- [ ]* 4.1 Write property test for validation error display
  - **Property 7: Validation Error Display**
  - **Validates: Requirements 2.7**

- [ ]* 4.2 Write property test for vitals data structure
  - **Property 8: Vitals Data Structure Compatibility**
  - **Validates: Requirements 2.8**

- [x] 5. Build ClinicalDetailsCard component





  - Create `ClinicalDetailsCard.jsx` in `frontend/src/components/consultation/`
  - Use existing Textarea component for symptoms field (required, rows={4})
  - Use existing Textarea component for diagnosis field (required, rows={3})
  - Use existing Input component for optional icdCode field
  - Use existing Textarea component for optional notes field (rows={3})
  - Enhance focus styles with Tailwind classes: focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100
  - Apply card styling: bg-white rounded-xl border border-gray-200 shadow-md p-6
  - Add section title "Clinical Details" with text-xl font-semibold text-gray-800 mb-4
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.4_
  - _Note: Existing Textarea and Input components already have focus styles, enhance with cyan colors_

- [ ]* 5.1 Write property test for focus visual feedback
  - **Property 9: Focus Visual Feedback**
  - **Validates: Requirements 3.5**



- [x] 6. Build PrescriptionSection component with dynamic list management







  - Create `PrescriptionSection.jsx` in `frontend/src/components/consultation/`
  - Accept prescriptions array and onChange handler as props
  - Render PrescriptionRow components for each prescription in the array
  - Implement "Add Medicine" button using existing Button component (variant="secondary")
  - Implement remove functionality for each row (show remove button only if prescriptions.length > 1)
  - Add Tailwind transition classes to prescription rows: transition-all duration-300 ease-in-out
  - Initialize parent component with one empty prescription object: {drug_name: '', dosage: '', frequency: '', duration: '', instructions: ''}
  - Apply section styling: bg-white rounded-xl border border-gray-200 shadow-md p-6
  - Add section title "Prescriptions" with divider (border-b border-gray-200 pb-2 mb-4)
  - _Requirements: 4.2, 4.3, 4.4, 4.7, 7.7_

- [x] 6.1 Write property test for prescription row addition





  - **Property 10: Prescription Row Addition**
  - **Validates: Requirements 4.2**

- [ ]* 6.2 Write property test for prescription row removal
  - **Property 11: Prescription Row Removal**
  - **Validates: Requirements 4.3**

- [ ]* 6.3 Write property test for prescription validation
  - **Property 12: Prescription Validation**
  - **Validates: Requirements 4.5**

- [ ]* 6.4 Write property test for prescription data structure
  - **Property 13: Prescription Data Structure Compatibility**
  - **Validates: Requirements 4.6**

- [x] 7. Build LabRequestSection component with dynamic list management





  - Create `LabRequestSection.jsx` in `frontend/src/components/consultation/`
  - Accept labRequests array, availableTests array, and onChange handler as props
  - Render LabRequestRow components for each lab request in the array
  - Implement "Add Lab Test" button using existing Button component (variant="secondary")
  - Implement remove functionality for each row (always show remove button)
  - Add Tailwind transition classes to lab request rows: transition-all duration-300 ease-in-out
  - Display all requested tests with test name and type visible
  - Apply section styling: bg-white rounded-xl border border-gray-200 shadow-md p-6
  - Add section title "Laboratory Tests" with divider (border-b border-gray-200 pb-2 mb-4)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 7.7_
  - _Note: Available tests will be fetched in parent ConsultationForm component_

- [ ]* 7.1 Write property test for lab request addition
  - **Property 14: Lab Request Addition**
  - **Validates: Requirements 5.2**

- [ ]* 7.2 Write property test for lab request removal
  - **Property 15: Lab Request Removal**
  - **Validates: Requirements 5.3**

- [ ]* 7.3 Write property test for lab request data structure
  - **Property 16: Lab Request Data Structure Compatibility**
  - **Validates: Requirements 5.5**

- [ ]* 7.4 Write property test for lab request display completeness
  - **Property 17: Lab Request Display Completeness**
  - **Validates: Requirements 5.6**



- [x] 8. Build main ConsultationForm component with state management





  - Create `ConsultationForm.jsx` in `frontend/src/components/consultation/`
  - Set up useState hooks for: appointment, patient, vitals (object with all vital fields), symptoms, diagnosis, icdCode, notes, prescriptions (array), labRequests (array), availableTests (array), loading, submitting, errors (object)
  - Use useParams from react-router-dom to get appointmentId from URL
  - Fetch appointment and patient data on mount using consultationService.getAppointment(appointmentId)
  - Fetch available lab tests on mount using consultationService.getLabTests()
  - Show existing Loader component while loading is true
  - Implement Tailwind grid layout: grid grid-cols-1 lg:grid-cols-2 gap-6 (two columns on desktop, single column on mobile)
  - Left column: PatientHeaderCard and VitalsCard
  - Right column: ClinicalDetailsCard, PrescriptionSection, LabRequestSection
  - Add state handlers: handleVitalsChange, handlePrescriptionChange, handleLabRequestChange, addPrescription, removePrescription, addLabRequest, removeLabRequest
  - Initialize prescriptions with one empty object: [{drug_name: '', dosage: '', frequency: '', duration: '', instructions: ''}]
  - _Requirements: 1.1, 1.2, 7.2, 7.3, 9.1, 9.3_

- [ ]* 8.1 Write unit tests for ConsultationForm
  - Test component renders with loading state
  - Test component renders with fetched data
  - Test two-column layout on desktop viewport
  - Test single-column layout on mobile viewport
  - _Requirements: 7.2, 7.3_

- [ ]* 8.2 Write property test for responsive layout functionality
  - **Property 28: Responsive Layout Functionality**
  - **Validates: Requirements 9.3**

- [x] 9. Implement form validation logic




  - Create `validateConsultationForm()` function in consultationHelpers.js
  - Validate symptoms is not empty using existing validateRequired from validators.js
  - Validate diagnosis is not empty using existing validateRequired from validators.js
  - Validate all vital signs using: validateBloodPressure(systolic, diastolic), validatePulseRate(heart_rate), validateTemperature(temperature), validateSpO2(spo2), validateHeight(height), validateWeight(weight)
  - Validate at least one prescription exists with non-empty drug_name and dosage
  - Return errors object with field names as keys and error messages as values
  - In ConsultationForm, call validateConsultationForm before submission and set errors state
  - Pass errors to child components (VitalsCard, ClinicalDetailsCard, PrescriptionSection) to highlight invalid fields
  - Prevent form submission if errors object has any keys
  - _Requirements: 2.7, 4.5, 6.1, 6.7_

- [ ]* 9.1 Write property test for required field validation
  - **Property 18: Required Field Validation**
  - **Validates: Requirements 6.1**

- [ ]* 9.2 Write property test for validation error highlighting
  - **Property 24: Validation Error Highlighting**
  - **Validates: Requirements 6.7**

- [x] 10. Implement form submission with API integration






  - Create handleSubmit function in ConsultationForm that calls validateConsultationForm first
  - If validation fails, set errors state and return early
  - Create transformConsultationPayload helper in consultationHelpers.js to transform form state to backend schema
  - Payload should include: appointment_id, patient_id, doctor_id (from auth context/localStorage), all vitals fields, symptoms, diagnosis, notes, prescriptions array, lab_requests array
  - Add submitConsultation function to consultationService.js that POSTs to /api/consultations
  - Set submitting state to true before API call, false after
  - Use existing Button component with disabled={submitting} and show loading spinner when submitting
  - On success (response.success === true), show success message using existing Alert component
  - On success, navigate to /appointments or /dashboard using useNavigate from react-router-dom
  - On error, display error message from response using existing Alert component
  - Wrap API call in try-catch to handle network errors with message "Network error. Please check your connection."
  - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 8.2, 8.3_
  - _Note: Backend consultation endpoint needs to be created separately_

- [ ]* 10.1 Write property test for successful submission API call
  - **Property 19: Successful Submission API Call**
  - **Validates: Requirements 6.2**

- [ ]* 10.2 Write property test for submit button loading state
  - **Property 20: Submit Button Loading State**
  - **Validates: Requirements 6.3**

- [ ]* 10.3 Write property test for success message display
  - **Property 21: Success Message Display**
  - **Validates: Requirements 6.4**

- [ ]* 10.4 Write property test for error message display
  - **Property 22: Error Message Display**
  - **Validates: Requirements 6.5**

- [ ]* 10.5 Write property test for post-submission state management
  - **Property 23: Post-Submission State Management**
  - **Validates: Requirements 6.6**

- [ ]* 10.6 Write property test for HTTP error handling
  - **Property 26: HTTP Error Handling**
  - **Validates: Requirements 8.2**

- [ ]* 10.7 Write property test for backend schema compatibility
  - **Property 27: Backend Schema Compatibility**
  - **Validates: Requirements 8.3**



- [x] 11. Apply medical-grade design system and styling





  - Update `frontend/tailwind.config.js` to extend colors with cyan/teal palette: primary: '#06b6d4', primaryLight: '#67e8f9', primaryDark: '#0891b2'
  - Apply glassmorphism to PatientHeaderCard: bg-white/70 backdrop-blur-lg border border-white/30
  - Add shadow and hover effects to all cards: shadow-md hover:shadow-lg transition-shadow duration-300
  - Ensure all interactive elements have transition-all duration-300 ease-in-out
  - Update focus styles in Input/Textarea components to use cyan: focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100
  - Implement floating label in VitalInput with absolute positioning and transform on focus
  - Use consistent spacing: p-6 for card padding, gap-4 for grids, mb-4 for form fields
  - Add section dividers in PrescriptionSection and LabRequestSection: border-b border-gray-200 pb-2 mb-4
  - _Requirements: 3.6, 7.1, 7.4, 7.5, 7.6, 7.7_

- [ ]* 11.1 Write accessibility test for color contrast
  - **Property 25: Color Contrast Accessibility**
  - **Validates: Requirements 7.8**

- [ ] 12. Implement responsive design and mobile optimization
  - Verify ConsultationForm uses grid grid-cols-1 lg:grid-cols-2 gap-6 for responsive layout
  - Verify all Input/Textarea components have py-2.5 px-4 (existing components already have this)
  - Ensure buttons have minimum height with py-2.5 px-6 (existing Button component already has this)
  - Add gap-4 for mobile grids, gap-6 for desktop grids using Tailwind responsive classes
  - Test layout in browser dev tools at 320px, 768px, 1024px, and 1440px widths
  - Add max-w-7xl mx-auto to ConsultationForm container to prevent excessive width
  - Add overflow-x-hidden to body or main container
  - Verify font sizes are readable: text-sm for labels, text-base for inputs, text-xl for section titles
  - Add active:scale-95 to Button component for touch feedback
  - _Requirements: 7.2, 7.3, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 12.1 Write property test for touch interaction feedback
  - **Property 29: Touch Interaction Feedback**
  - **Validates: Requirements 9.4**

- [ ] 13. Implement accessibility features
  - Add aria-label to "Add Medicine" button: aria-label="Add new prescription"
  - Add aria-label to "Add Lab Test" button: aria-label="Add new laboratory test"
  - Add aria-label to remove buttons: aria-label="Remove prescription" / "Remove lab test"
  - Verify existing Input/Textarea components have proper label associations (they do via htmlFor and id)
  - Add aria-required="true" to symptoms, diagnosis, and all vital sign inputs
  - Add aria-describedby to inputs with errors, linking to error message element id
  - Ensure DOM order matches visual order for logical tab navigation
  - Verify focus indicators are visible with focus:ring-4 focus:ring-cyan-500 classes
  - Test keyboard navigation: Tab through all fields, Enter to submit, Escape to close modals
  - Add aria-live="polite" to Alert component for success/error messages
  - Wrap form in <form> element, use <section> for card groups, use proper heading hierarchy (h1, h2, h3)
  - _Requirements: 7.8_

- [ ]* 13.1 Write accessibility audit tests
  - Test keyboard navigation works for all interactive elements
  - Test screen reader compatibility with ARIA labels
  - Test focus indicators are visible
  - _Requirements: 7.8_

- [x] 14. Add error handling and user feedback





  - Use existing Alert component to display success message after submission: <Alert type="success" message="Consultation saved successfully" />
  - Use existing Alert component to display error messages: <Alert type="error" message={errorMessage} />
  - Verify inline validation errors are displayed by Input/Textarea components (they already handle error prop)
  - In consultationService catch blocks, check if error.response exists (server error) vs error.request (network error)
  - For network errors, display "Network error. Please check your connection and try again."
  - Show existing Loader component while loading appointment data
  - If appointment fetch fails, show error state with message and "Retry" button that calls fetch again
  - Add useEffect with beforeunload event listener to warn user before leaving page with unsaved changes
  - Display specific error messages from server response: error.response.data.message or error.response.data.error
  - _Requirements: 6.4, 6.5, 8.2_

- [ ]* 14.1 Write unit tests for error handling
  - Test network error displays appropriate message
  - Test server error displays appropriate message
  - Test validation errors display correctly
  - _Requirements: 6.5, 8.2_

- [x] 15. Update Consultation page to use ConsultationForm




  - Update `frontend/src/pages/Consultation.jsx` to import ConsultationForm from '../components/consultation/ConsultationForm'
  - Remove placeholder content (h1 and p tags)
  - Render ConsultationForm component inside Layout wrapper
  - ConsultationForm will get appointmentId from URL params internally using useParams
  - Ensure route is configured in App.jsx: <Route path="/consultation/:appointmentId" element={<Consultation />} />
  - _Requirements: All_

- [x] 16. Performance optimization and polish





  - Wrap PrescriptionRow export with React.memo to prevent unnecessary re-renders
  - Wrap LabRequestRow export with React.memo to prevent unnecessary re-renders
  - In VitalsCard, use useMemo for BMI calculation: useMemo(() => calculateBMI(height, weight), [height, weight])
  - In ConsultationForm, wrap handlers with useCallback: useCallback for handleVitalsChange, addPrescription, removePrescription, addLabRequest, removeLabRequest
  - For text inputs (symptoms, diagnosis, notes), add debounced validation using setTimeout with 300ms delay
  - Test form with 10+ prescriptions and 10+ lab requests to ensure smooth scrolling and interactions
  - Verify Tailwind transitions run smoothly at 60fps (check in browser dev tools performance tab)
  - Verify loading state shows during appointment fetch and submitting state shows during form submission
  - _Requirements: All_

- [ ]* 16.1 Write performance tests
  - Test form renders within performance budget
  - Test animations run at 60fps
  - Test large lists don't cause performance degradation
  - _Requirements: All_

- [ ] 17. Integration testing and bug fixes
  - Test complete flow: Navigate to /consultation/:appointmentId → verify data loads → fill all fields → submit → verify success
  - Test with minimal data: only required fields (symptoms, diagnosis, vitals, one prescription with drug_name and dosage)
  - Test with full data: all fields including optional notes, icdCode, prescription instructions, multiple prescriptions and lab tests
  - Test validation: submit with empty required fields, invalid vital ranges, empty prescriptions
  - Test network error: disconnect network and attempt to load/submit, verify error messages
  - Test responsive: resize browser to 320px (mobile), 768px (tablet), 1024px (desktop), verify layout adapts
  - Test keyboard: Tab through all fields, verify focus order, press Enter to submit, Escape to close alerts
  - Test in Chrome, Firefox, Safari, and Edge browsers
  - Fix any bugs discovered: console errors, layout issues, validation problems, API integration issues
  - _Requirements: All_

- [ ] 18. Backend API implementation
  - Create `backend/controllers/consultationController.js` with createConsultation function
  - Create `backend/routes/consultationRoutes.js` with POST /api/consultations route
  - Create `backend/controllers/labController.js` with getLabTests function
  - Create `backend/routes/labRoutes.js` with GET /api/lab/tests route
  - Register routes in `backend/server.js`: app.use('/api/consultations', consultationRoutes) and app.use('/api/lab', labRoutes)
  - Consultation endpoint should accept: appointment_id, patient_id, doctor_id, vitals (all fields), symptoms, diagnosis, notes, prescriptions array, lab_requests array
  - Validate required fields: appointment_id, patient_id, doctor_id, symptoms, diagnosis, at least one prescription
  - Insert consultation record into database, then insert prescriptions and lab_requests with foreign key to consultation_id
  - Return success response with consultation data, prescriptions, lab_requests
  - Lab tests endpoint should return array of available tests with id, name, type, category
  - Test endpoints with Postman: POST /api/consultations with sample payload, GET /api/lab/tests
  - _Requirements: 6.2, 5.1, 8.3_
  - _Note: Backend implementation is required for frontend to function_

- [ ] 19. Final checkpoint - Ensure all functionality works
  - Verify PatientHeaderCard displays patient info, age, appointment details, and allergy badge
  - Verify VitalsCard displays all vital inputs, calculates BMI, and shows validation errors
  - Verify ClinicalDetailsCard displays symptoms, diagnosis, icdCode, and notes fields
  - Verify PrescriptionSection allows adding/removing prescriptions with smooth animations
  - Verify LabRequestSection allows adding/removing lab tests with smooth animations
  - Verify form validation prevents submission with missing required fields or invalid vitals
  - Verify form submission succeeds with valid data and shows success message
  - Verify error handling displays appropriate messages for network errors and server errors
  - Verify responsive layout works on mobile, tablet, and desktop
  - Verify accessibility features work: keyboard navigation, ARIA labels, focus indicators
  - Ask the user if questions arise.
