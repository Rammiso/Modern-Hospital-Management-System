# Design Document: Doctor Consultation UI

## Overview

The Doctor Consultation UI is a comprehensive, medical-grade interface that enables doctors to document complete clinical encounters within the Hospital Management System. This design leverages React 18, Tailwind CSS, and modern UI patterns to create a professional, calming, and highly functional interface that reduces cognitive load during clinical documentation.

The interface follows a card-based, two-column layout on desktop (patient info + vitals on left, clinical details on right) and a stacked mobile layout. The design incorporates glassmorphism effects, smooth animations, floating labels, and a medical color palette (blue/teal) to create a futuristic yet professional aesthetic.

## Architecture

### Component Hierarchy

```
Consultation (Page)
├── Layout (Common)
│   ├── Header
│   ├── Sidebar
│   └── Footer
└── ConsultationForm (New)
    ├── PatientHeaderCard (New)
    ├── VitalsCard (New)
    │   └── VitalInput (New)
    ├── ClinicalDetailsCard (New)
    │   ├── SymptomInput
    │   ├── DiagnosisInput
    │   └── NotesInput
    ├── PrescriptionSection (New)
    │   └── PrescriptionRow[] (New)
    └── LabRequestSection (New)
        └── LabRequestRow[] (New)
```

### Data Flow

1. **Component Mount**: Fetch appointment and patient data via appointmentId from URL params
2. **User Input**: Capture form data in local component state
3. **Validation**: Real-time validation on blur and comprehensive validation on submit
4. **Submission**: POST to `/api/consultations` with structured payload
5. **Response Handling**: Display success/error messages, navigate on success



## Components and Interfaces

### 1. ConsultationForm Component

**Purpose**: Main container component managing form state and submission logic

**Props**:
```typescript
interface ConsultationFormProps {
  appointmentId?: string; // From URL params
}
```

**State**:
```typescript
interface ConsultationState {
  appointment: Appointment | null;
  patient: Patient | null;
  vitals: VitalsData;
  symptoms: string;
  diagnosis: string;
  icdCode: string;
  notes: string;
  prescriptions: Prescription[];
  labRequests: LabRequest[];
  loading: boolean;
  submitting: boolean;
  errors: Record<string, string>;
}
```

**Key Methods**:
- `fetchAppointmentData()`: Load appointment and patient info
- `handleVitalsChange()`: Update vitals state with validation
- `addPrescription()`: Add new prescription row
- `removePrescription(index)`: Remove prescription by index
- `addLabRequest()`: Add new lab request
- `removeLabRequest(index)`: Remove lab request by index
- `validateForm()`: Comprehensive validation before submission
- `handleSubmit()`: Submit consultation data to API



### 2. PatientHeaderCard Component

**Purpose**: Display patient demographic and appointment information

**Props**:
```typescript
interface PatientHeaderCardProps {
  patient: {
    full_name: string;
    patient_id: string;
    date_of_birth: string;
    gender: string;
    allergies?: string;
  };
  appointment: {
    appointment_date: string;
    appointment_time: string;
    type: string;
  };
}
```

**Design Features**:
- Glassmorphism card with backdrop blur
- Prominent patient name and ID
- Age calculated from date_of_birth
- Allergy badge with warning color if present
- Appointment details with icon indicators
- Responsive grid layout



### 3. VitalsCard Component

**Purpose**: Capture and validate patient vital signs

**Props**:
```typescript
interface VitalsCardProps {
  vitals: VitalsData;
  onChange: (field: string, value: number) => void;
  errors: Record<string, string>;
}

interface VitalsData {
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  temperature: number;
  height: number;
  weight: number;
  spo2: number;
  bmi?: number; // Calculated
}
```

**Validation Rules**:
- Systolic BP: 50-250 mmHg
- Diastolic BP: 30-150 mmHg
- Heart Rate: 30-220 bpm
- Temperature: 35.0-42.0°C
- SpO2: 70-100%
- Height: 50-250 cm
- Weight: 2-300 kg

**Design Features**:
- Grid layout for vital inputs (2-3 columns on desktop)
- Floating label inputs with units
- Real-time BMI calculation display
- Error highlighting with red border and message
- Smooth focus transitions with glow effect



### 4. PrescriptionRow Component

**Purpose**: Single prescription entry with dynamic add/remove

**Props**:
```typescript
interface PrescriptionRowProps {
  prescription: Prescription;
  index: number;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  errors: Record<string, string>;
  showRemove: boolean; // Hide remove button if only one row
}

interface Prescription {
  drug_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}
```

**Design Features**:
- Horizontal layout with 4-5 input fields
- Remove button with trash icon (only if multiple rows)
- Smooth slide-in animation on add
- Smooth slide-out animation on remove
- Floating labels for all fields
- Required field indicators



### 5. LabRequestRow Component

**Purpose**: Laboratory test selection and management

**Props**:
```typescript
interface LabRequestRowProps {
  labRequest: LabRequest;
  index: number;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  availableTests: LabTest[];
}

interface LabRequest {
  test_name: string;
  test_type: 'blood' | 'urine' | 'imaging' | 'other';
  instructions?: string;
}

interface LabTest {
  id: string;
  name: string;
  type: string;
  category: string;
}
```

**Design Features**:
- Dropdown/select for test selection
- Test type auto-populated based on selection
- Optional instructions field
- Remove button with smooth animation
- Badge showing test category



## Data Models

### Consultation Payload Structure

```typescript
interface ConsultationPayload {
  appointment_id: string;
  patient_id: string;
  doctor_id: string; // From auth context
  
  // Vitals
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  temperature: number;
  pulse_rate: number; // heart_rate
  respiratory_rate?: number;
  weight: number;
  height: number;
  bmi: number;
  spo2: number;
  
  // Clinical Notes
  symptoms: string;
  diagnosis: string;
  notes?: string;
  follow_up_date?: string;
  follow_up_notes?: string;
  
  // Related Data
  prescriptions: PrescriptionPayload[];
  lab_requests: LabRequestPayload[];
}

interface PrescriptionPayload {
  drug_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface LabRequestPayload {
  test_name: string;
  test_type: string;
  instructions?: string;
}
```

### API Response Structure

```typescript
interface ConsultationResponse {
  success: boolean;
  data: {
    consultation: Consultation;
    prescriptions: Prescription[];
    lab_requests: LabRequest[];
    bill?: Bill;
  };
  message: string;
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Allergy Display Consistency

*For any* patient object with a non-empty allergies field, the patient header component should display the allergy information with visual prominence.

**Validates: Requirements 1.4**

### Property 2: Vital Signs Validation - Blood Pressure

*For any* blood pressure input, the validation function should accept systolic values between 50-250 mmHg and diastolic values between 30-150 mmHg, and reject all values outside these ranges.

**Validates: Requirements 2.2**

### Property 3: Vital Signs Validation - Heart Rate

*For any* heart rate input, the validation function should accept values between 30-220 bpm and reject all values outside this range.

**Validates: Requirements 2.3**

### Property 4: Vital Signs Validation - Temperature

*For any* temperature input, the validation function should accept values between 35.0-42.0°C and reject all values outside this range.

**Validates: Requirements 2.4**

### Property 5: Vital Signs Validation - SpO2

*For any* SpO2 input, the validation function should accept values between 70-100% and reject all values outside this range.

**Validates: Requirements 2.5**



### Property 6: BMI Calculation Accuracy

*For any* valid height (in cm) and weight (in kg) input, the calculated BMI should equal weight / (height/100)² with a precision of 2 decimal places.

**Validates: Requirements 2.6**

### Property 7: Validation Error Display

*For any* vital sign field with an invalid value, the component should display error styling (red border) and a descriptive error message.

**Validates: Requirements 2.7**

### Property 8: Vitals Data Structure Compatibility

*For any* set of valid vital sign inputs, the structured vitals object should contain all required fields matching the backend schema (blood_pressure_systolic, blood_pressure_diastolic, temperature, pulse_rate, weight, height, bmi, spo2).

**Validates: Requirements 2.8**

### Property 9: Focus Visual Feedback

*For any* text area element, when it receives focus, the component should apply visual feedback through CSS class changes or style updates.

**Validates: Requirements 3.5**

### Property 10: Prescription Row Addition

*For any* form state with N prescription rows, clicking the "Add Medicine" button should result in N+1 prescription rows.

**Validates: Requirements 4.2**

### Property 11: Prescription Row Removal

*For any* form state with N prescription rows (where N > 1), removing a prescription row should result in N-1 prescription rows.

**Validates: Requirements 4.3**

### Property 12: Prescription Validation

*For any* prescription row with empty medicine_name or dosage fields, form validation should fail and prevent submission.

**Validates: Requirements 4.5**



### Property 13: Prescription Data Structure Compatibility

*For any* set of prescription inputs, the structured prescriptions array should contain objects matching the backend schema with fields: drug_name, dosage, frequency, duration, and optional instructions.

**Validates: Requirements 4.6**

### Property 14: Lab Request Addition

*For any* form state with N lab requests, adding a new lab test should result in N+1 lab requests in the list.

**Validates: Requirements 5.2**

### Property 15: Lab Request Removal

*For any* form state with N lab requests (where N > 0), removing a lab request should result in N-1 lab requests.

**Validates: Requirements 5.3**

### Property 16: Lab Request Data Structure Compatibility

*For any* set of lab request inputs, the structured lab_requests array should contain objects matching the backend schema with fields: test_name, test_type, and optional instructions.

**Validates: Requirements 5.5**

### Property 17: Lab Request Display Completeness

*For any* set of requested lab tests, all tests should be rendered in the UI component.

**Validates: Requirements 5.6**

### Property 18: Required Field Validation

*For any* form state with missing required fields (symptoms, diagnosis, or at least one valid prescription), form validation should fail and prevent submission.

**Validates: Requirements 6.1**

### Property 19: Successful Submission API Call

*For any* valid form state, clicking submit should trigger a POST request to /api/consultations with a payload containing all required fields.

**Validates: Requirements 6.2**



### Property 20: Submit Button Loading State

*For any* form submission in progress, the submit button should be disabled and display a loading indicator.

**Validates: Requirements 6.3**

### Property 21: Success Message Display

*For any* successful API response (status 200-299), the component should display a success message to the user.

**Validates: Requirements 6.4**

### Property 22: Error Message Display

*For any* error API response (status 400-599), the component should display an error message containing details from the server response.

**Validates: Requirements 6.5**

### Property 23: Post-Submission State Management

*For any* successful form submission, the component should either clear all form fields or navigate to a different route.

**Validates: Requirements 6.6**

### Property 24: Validation Error Highlighting

*For any* form submission attempt with missing required fields, all fields with validation errors should be highlighted with error styling.

**Validates: Requirements 6.7**

### Property 25: Color Contrast Accessibility

*For any* text or interactive element in the consultation form, the color contrast ratio should meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 7.8**

### Property 26: HTTP Error Handling

*For any* HTTP request made by the consultation form, network errors and HTTP errors should be caught and handled with appropriate user feedback.

**Validates: Requirements 8.2**



### Property 27: Backend Schema Compatibility

*For any* complete form data, the consultation payload should include all required backend schema fields: appointment_id, patient_id, doctor_id, vitals object, symptoms, diagnosis, prescriptions array, and lab_requests array.

**Validates: Requirements 8.3**

### Property 28: Responsive Layout Functionality

*For any* viewport width change from desktop to mobile or vice versa, all form functionality should remain operational without data loss.

**Validates: Requirements 9.3**

### Property 29: Touch Interaction Feedback

*For any* interactive element on touch devices, appropriate touch event handlers should be present and provide visual feedback.

**Validates: Requirements 9.4**



## Error Handling

### Validation Errors

**Client-Side Validation**:
- Real-time validation on blur for vital signs
- Form-level validation on submit
- Display inline error messages below invalid fields
- Highlight invalid fields with red border and error icon
- Prevent form submission until all errors are resolved

**Validation Error Messages**:
```javascript
const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  BP_SYSTOLIC_RANGE: 'Systolic pressure must be between 50-250 mmHg',
  BP_DIASTOLIC_RANGE: 'Diastolic pressure must be between 30-150 mmHg',
  HEART_RATE_RANGE: 'Heart rate must be between 30-220 bpm',
  TEMPERATURE_RANGE: 'Temperature must be between 35.0-42.0°C',
  SPO2_RANGE: 'SpO2 must be between 70-100%',
  HEIGHT_RANGE: 'Height must be between 50-250 cm',
  WEIGHT_RANGE: 'Weight must be between 2-300 kg',
  PRESCRIPTION_INCOMPLETE: 'Please fill in all required prescription fields',
};
```

### API Errors

**Network Errors**:
- Display toast notification: "Network error. Please check your connection."
- Keep form data intact for retry
- Provide retry button

**Server Errors (5xx)**:
- Display toast notification: "Server error. Please try again later."
- Log error details to console for debugging
- Keep form data intact

**Client Errors (4xx)**:
- 400 Bad Request: Display specific validation errors from server
- 401 Unauthorized: Redirect to login page
- 403 Forbidden: Display "You don't have permission to perform this action"
- 404 Not Found: Display "Appointment not found"
- 409 Conflict: Display "This consultation has already been recorded"

### Loading States

**Data Fetching**:
- Display skeleton loaders for patient header and form sections
- Show loading spinner in center of form area
- Disable all form inputs during initial load

**Form Submission**:
- Disable submit button with loading spinner
- Display "Saving consultation..." message
- Prevent navigation away from page
- Show progress indicator for long operations



## Testing Strategy

### Unit Testing

**Framework**: Vitest + React Testing Library

**Unit Test Coverage**:

1. **Component Rendering Tests**:
   - PatientHeaderCard renders with correct patient data
   - VitalsCard renders all vital sign input fields
   - PrescriptionRow renders with all required fields
   - LabRequestRow renders with test selector
   - Form sections render in correct layout

2. **Validation Logic Tests**:
   - Vital signs validation functions accept valid ranges
   - Vital signs validation functions reject invalid ranges
   - BMI calculation produces correct results
   - Required field validation catches empty fields
   - Prescription validation catches incomplete rows

3. **User Interaction Tests**:
   - Adding prescription row increases count
   - Removing prescription row decreases count
   - Adding lab request increases count
   - Removing lab request decreases count
   - Form submission calls API with correct payload

4. **Error Handling Tests**:
   - Network errors display appropriate messages
   - Server errors display appropriate messages
   - Validation errors highlight fields correctly
   - Loading states display during async operations

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations to ensure comprehensive coverage across the input space.

**Property Test Coverage**:

1. **Vital Signs Validation Properties**:
   - Generate random blood pressure values, verify validation correctness
   - Generate random heart rate values, verify validation correctness
   - Generate random temperature values, verify validation correctness
   - Generate random SpO2 values, verify validation correctness
   - Generate random height/weight pairs, verify BMI calculation

2. **Dynamic List Management Properties**:
   - Generate random prescription lists, verify add/remove operations maintain count
   - Generate random lab request lists, verify add/remove operations maintain count
   - Verify list operations don't corrupt data

3. **Data Structure Properties**:
   - Generate random form data, verify payload structure matches backend schema
   - Generate random vitals data, verify object structure is correct
   - Generate random prescriptions, verify array structure is correct

4. **Validation Properties**:
   - Generate random incomplete forms, verify validation prevents submission
   - Generate random complete forms, verify validation allows submission
   - Generate random invalid vitals, verify error messages appear

**Property Test Tagging**: Each property-based test must include a comment explicitly referencing the correctness property from this design document using the format: `// Feature: doctor-consultation-ui, Property {number}: {property_text}`



## Design System Specifications

### Color Palette

```javascript
const MEDICAL_COLORS = {
  // Primary Medical Blue/Teal
  primary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4', // Main accent
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  
  // Calm Background
  background: {
    main: '#f8fafc',
    card: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Text
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    muted: '#94a3b8',
  },
};
```

### Typography

```javascript
const TYPOGRAPHY = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing System

```javascript
const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};
```

### Card Styles

```css
/* Glassmorphism Card */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

/* Neumorphism Card */
.neuro-card {
  background: #f8fafc;
  border-radius: 1rem;
  box-shadow: 
    8px 8px 16px rgba(163, 177, 198, 0.6),
    -8px -8px 16px rgba(255, 255, 255, 0.5);
}

/* Standard Medical Card */
.medical-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
}

.medical-card:hover {
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
  border-color: #06b6d4;
}
```

### Input Styles

```css
/* Floating Label Input */
.floating-input-group {
  position: relative;
  margin-top: 1.5rem;
}

.floating-input {
  width: 100%;
  padding: 1rem 0.75rem 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.floating-input:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.floating-label {
  position: absolute;
  left: 0.75rem;
  top: 1rem;
  font-size: 1rem;
  color: #64748b;
  transition: all 0.3s ease;
  pointer-events: none;
}

.floating-input:focus + .floating-label,
.floating-input:not(:placeholder-shown) + .floating-label {
  top: 0.25rem;
  font-size: 0.75rem;
  color: #06b6d4;
}

/* Error State */
.floating-input.error {
  border-color: #ef4444;
}

.floating-input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

### Animation Utilities

```css
/* Smooth Transitions */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slide In Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

/* Glow Effect */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
  }
}

.glow-pulse {
  animation: glow 2s ease-in-out infinite;
}
```



## Responsive Design Breakpoints

```javascript
const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

// Tailwind CSS Breakpoints
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

### Layout Specifications

**Desktop (≥1024px)**:
- Two-column grid layout
- Left column (40%): Patient header + Vitals card
- Right column (60%): Clinical details + Prescriptions + Lab requests
- Fixed sidebar navigation
- Maximum content width: 1400px

**Tablet (768px - 1023px)**:
- Two-column grid with adjusted proportions (45% / 55%)
- Slightly reduced padding and margins
- Collapsible sidebar

**Mobile (<768px)**:
- Single column stacked layout
- Full-width cards
- Hamburger menu for navigation
- Larger touch targets (minimum 44x44px)
- Reduced padding for space efficiency

## Accessibility Requirements

### WCAG 2.1 AA Compliance

1. **Color Contrast**:
   - Normal text: Minimum 4.5:1 contrast ratio
   - Large text (18pt+): Minimum 3:1 contrast ratio
   - Interactive elements: Minimum 3:1 contrast ratio

2. **Keyboard Navigation**:
   - All interactive elements accessible via Tab key
   - Logical tab order following visual flow
   - Visible focus indicators on all focusable elements
   - Escape key closes modals and dropdowns

3. **Screen Reader Support**:
   - Semantic HTML elements (header, main, section, form)
   - ARIA labels for icon buttons
   - ARIA live regions for dynamic content updates
   - Form labels properly associated with inputs

4. **Form Accessibility**:
   - Required fields marked with aria-required="true"
   - Error messages associated with fields via aria-describedby
   - Field validation announced to screen readers
   - Clear error messages with actionable guidance

5. **Touch Targets**:
   - Minimum size: 44x44px for all interactive elements
   - Adequate spacing between touch targets (8px minimum)
   - No overlapping interactive elements



## API Integration

### Endpoints

**1. Fetch Appointment Data**
```
GET /api/appointments/:appointmentId
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "patient_id": "uuid",
    "doctor_id": "uuid",
    "appointment_date": "2024-01-15",
    "appointment_time": "10:00:00",
    "type": "new",
    "status": "checked_in",
    "patient": {
      "id": "uuid",
      "patient_id": "HOSP-2024-0115-001",
      "full_name": "John Doe",
      "date_of_birth": "1985-05-20",
      "gender": "male",
      "phone": "+251911234567",
      "allergies": "Penicillin, Peanuts"
    }
  }
}
```

**2. Submit Consultation**
```
POST /api/consultations
```

**Request Payload**:
```json
{
  "appointment_id": "uuid",
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "blood_pressure_systolic": 120,
  "blood_pressure_diastolic": 80,
  "temperature": 37.2,
  "pulse_rate": 75,
  "respiratory_rate": 16,
  "weight": 70.5,
  "height": 175,
  "bmi": 23.02,
  "spo2": 98,
  "symptoms": "Fever, headache, body aches for 3 days",
  "diagnosis": "Viral fever, likely influenza",
  "notes": "Patient advised rest and hydration",
  "follow_up_date": "2024-01-22",
  "follow_up_notes": "Return if symptoms worsen",
  "prescriptions": [
    {
      "drug_name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Three times daily",
      "duration": "5 days",
      "instructions": "Take after meals"
    }
  ],
  "lab_requests": [
    {
      "test_name": "Complete Blood Count",
      "test_type": "blood",
      "instructions": "Fasting required"
    }
  ]
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "consultation": {
      "id": "uuid",
      "appointment_id": "uuid",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "prescriptions": [...],
    "lab_requests": [...],
    "bill": {
      "id": "uuid",
      "bill_number": "BILL-20240115-001",
      "total_amount": 1500.00
    }
  },
  "message": "Consultation saved successfully"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Validation Error",
  "details": {
    "symptoms": "Symptoms field is required",
    "prescriptions": "At least one prescription is required"
  }
}
```

**3. Fetch Available Lab Tests**
```
GET /api/lab/tests
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Complete Blood Count",
      "type": "blood",
      "category": "Hematology"
    },
    {
      "id": "uuid",
      "name": "Urinalysis",
      "type": "urine",
      "category": "Clinical Chemistry"
    }
  ]
}
```

### Error Handling Strategy

```javascript
// API Service with Error Handling
const submitConsultation = async (consultationData) => {
  try {
    const response = await api.post('/consultations', consultationData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data.error || 'Server error',
        details: error.response.data.details || {},
        status: error.response.status,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }
};
```



## Performance Considerations

### Optimization Strategies

1. **Component Memoization**:
   - Use `React.memo()` for PrescriptionRow and LabRequestRow components
   - Memoize expensive calculations (BMI) with `useMemo()`
   - Memoize callback functions with `useCallback()`

2. **Lazy Loading**:
   - Code-split consultation form components
   - Lazy load lab test options only when needed
   - Defer non-critical animations

3. **Form State Management**:
   - Use controlled components for critical fields
   - Debounce validation for text inputs (300ms)
   - Batch state updates where possible

4. **API Optimization**:
   - Cache lab test options in session storage
   - Implement request cancellation for abandoned submissions
   - Use optimistic UI updates for better perceived performance

5. **Bundle Size**:
   - Tree-shake unused Tailwind classes
   - Minimize third-party dependencies
   - Use dynamic imports for large components

### Performance Targets

- Initial page load: < 2 seconds
- Time to interactive: < 3 seconds
- Form submission response: < 1 second (excluding network)
- Smooth animations: 60fps
- Bundle size: < 200KB (gzipped)

## Security Considerations

### Data Protection

1. **Authentication**:
   - JWT token required for all API calls
   - Token stored in httpOnly cookie or secure localStorage
   - Automatic token refresh before expiration

2. **Authorization**:
   - Verify doctor role before allowing access
   - Check doctor_id matches authenticated user
   - Validate appointment belongs to authenticated doctor

3. **Input Sanitization**:
   - Sanitize all text inputs to prevent XSS
   - Validate numeric inputs on client and server
   - Escape special characters in diagnosis and notes

4. **Data Transmission**:
   - All API calls over HTTPS
   - Sensitive data encrypted in transit
   - No sensitive data in URL parameters

5. **HIPAA Compliance Considerations**:
   - No patient data in browser console logs
   - Clear sensitive data from memory after submission
   - Implement session timeout (15 minutes idle)
   - Audit log all consultation submissions



## Implementation Notes

### State Management Approach

**Local Component State**: Use React's `useState` for form data management. No Redux or external state management needed for this feature as:
- Form state is isolated to consultation page
- No need to share state across multiple routes
- Simpler debugging and testing
- Better performance for form interactions

### Form Validation Strategy

**Two-Tier Validation**:

1. **Real-time Validation** (on blur):
   - Validate individual fields as user moves away
   - Provide immediate feedback for vital signs
   - Non-blocking - allows user to continue filling form

2. **Comprehensive Validation** (on submit):
   - Validate all required fields
   - Check data structure completeness
   - Validate prescription and lab request arrays
   - Blocking - prevents submission until resolved

### Component Reusability

**Shared Components**:
- Leverage existing `Input`, `Select`, `Textarea` from common components
- Extend `FormField` component for floating label support
- Create new `VitalInput` component for vital signs with units
- Build `DynamicList` component for prescriptions and lab requests

### Development Workflow

1. **Phase 1**: Build static layout and styling
   - Create component structure
   - Implement responsive grid layout
   - Apply medical design system styles

2. **Phase 2**: Implement form functionality
   - Add state management
   - Implement dynamic lists (add/remove)
   - Add validation logic

3. **Phase 3**: API integration
   - Connect to backend endpoints
   - Implement error handling
   - Add loading states

4. **Phase 4**: Polish and optimization
   - Add animations and transitions
   - Optimize performance
   - Accessibility audit
   - Cross-browser testing

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Dependencies

**Required**:
- React 18+
- React Router v6
- Axios
- Tailwind CSS 3+

**Optional** (for enhanced features):
- react-hook-form (if complex validation needed)
- date-fns (for date formatting)
- react-hot-toast (for notifications)

