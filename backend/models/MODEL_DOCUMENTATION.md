# Model Documentation

Complete reference for all data access models in the Hospital Management System.

---

## 📋 Table of Contents

1. [Appointment Model](#appointment-model)
2. [Lab Request Model](#lab-request-model)
3. [Consultation Model](#consultation-model)
4. [Prescription Model](#prescription-model)
5. [Patient Model](#patient-model)
6. [User Model](#user-model)

---

## Appointment Model

**File:** `Appointment.js`

Manages doctor-patient appointment scheduling with conflict detection and availability management.

### Methods

#### `create(data)`
Creates a new appointment.

**Parameters:**
```javascript
{
  patient_id: string (UUID),
  doctor_id: string (UUID),
  appointment_date: string (YYYY-MM-DD),
  appointment_time: string (HH:MM),
  status: string ('scheduled', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show'),
  type: string ('new', 'follow_up', 'emergency'),
  reason: string (optional),
  created_by: string (UUID, optional)
}
```

**Returns:** Appointment object with patient and doctor details

**Example:**
```javascript
const appointment = await Appointment.create({
  patient_id: 'uuid-123',
  doctor_id: 'uuid-456',
  appointment_date: '2024-12-20',
  appointment_time: '10:30',
  type: 'new',
  reason: 'General checkup'
});
```

---

#### `checkConflict(doctorId, appointmentDate, appointmentTime, excludeId)`
Checks if a doctor has a conflicting appointment at the specified time.

**Parameters:**
- `doctorId` (string): Doctor's UUID
- `appointmentDate` (string): Date in YYYY-MM-DD format
- `appointmentTime` (string): Time in HH:MM format
- `excludeId` (string, optional): Appointment ID to exclude from check

**Returns:** Boolean (true if conflict exists)

**Example:**
```javascript
const hasConflict = await Appointment.checkConflict(
  'doctor-uuid',
  '2024-12-20',
  '10:30'
);
```

---

#### `getById(id)`
Retrieves a single appointment with patient and doctor details.

**Parameters:**
- `id` (string): Appointment UUID

**Returns:** Appointment object or null

**Example:**
```javascript
const appointment = await Appointment.getById('appointment-uuid');
// Returns: { id, patient_id, doctor_id, patient_name, doctor_name, ... }
```

---

#### `list(filters, limit, offset)`
Lists appointments with optional filtering and pagination.

**Parameters:**
```javascript
{
  filters: {
    doctor_id: string (optional),
    patient_id: string (optional),
    appointment_date: string (optional),
    status: string (optional),
    type: string (optional)
  },
  limit: number (default: 20),
  offset: number (default: 0)
}
```

**Returns:** Object with appointments array and pagination info

**Example:**
```javascript
const result = await Appointment.list(
  { doctor_id: 'uuid-123', status: 'scheduled' },
  20,
  0
);
// Returns: { appointments: [...], total: 50, limit: 20, offset: 0, pages: 3 }
```

---

#### `getByDateRange(doctorId, startDate, endDate)`
Gets all appointments for a doctor within a date range.

**Parameters:**
- `doctorId` (string): Doctor's UUID
- `startDate` (string): Start date in YYYY-MM-DD format
- `endDate` (string): End date in YYYY-MM-DD format

**Returns:** Array of appointments

**Example:**
```javascript
const appointments = await Appointment.getByDateRange(
  'doctor-uuid',
  '2024-12-01',
  '2024-12-31'
);
```

---

#### `update(id, data)`
Updates an appointment.

**Parameters:**
```javascript
{
  id: string,
  data: {
    patient_id: string (optional),
    doctor_id: string (optional),
    appointment_date: string (optional),
    appointment_time: string (optional),
    status: string (optional),
    type: string (optional),
    reason: string (optional)
  }
}
```

**Returns:** Updated appointment object

**Example:**
```javascript
const updated = await Appointment.update('appointment-uuid', {
  status: 'completed',
  reason: 'Checkup completed successfully'
});
```

---

#### `updateStatus(id, status)`
Updates only the appointment status.

**Parameters:**
- `id` (string): Appointment UUID
- `status` (string): New status

**Returns:** Updated appointment object

**Example:**
```javascript
const updated = await Appointment.updateStatus('appointment-uuid', 'checked_in');
```

---

#### `cancel(id, reason)`
Cancels an appointment.

**Parameters:**
- `id` (string): Appointment UUID
- `reason` (string, optional): Cancellation reason

**Returns:** Updated appointment object

**Example:**
```javascript
const cancelled = await Appointment.cancel('appointment-uuid', 'Patient requested cancellation');
```

---

#### `getAvailableSlots(doctorId, appointmentDate, slotDuration)`
Gets available appointment slots for a doctor on a specific date.

**Parameters:**
- `doctorId` (string): Doctor's UUID
- `appointmentDate` (string): Date in YYYY-MM-DD format
- `slotDuration` (number, default: 30): Slot duration in minutes

**Returns:** Array of available time slots (HH:MM format)

**Example:**
```javascript
const slots = await Appointment.getAvailableSlots('doctor-uuid', '2024-12-20', 30);
// Returns: ['09:00', '09:30', '10:00', '10:30', ...]
```

---

#### `getStats(doctorId, startDate, endDate)`
Gets appointment statistics for a doctor within a date range.

**Parameters:**
- `doctorId` (string): Doctor's UUID
- `startDate` (string): Start date in YYYY-MM-DD format
- `endDate` (string): End date in YYYY-MM-DD format

**Returns:** Statistics object

**Example:**
```javascript
const stats = await Appointment.getStats('doctor-uuid', '2024-12-01', '2024-12-31');
// Returns: { total: 50, completed: 45, cancelled: 3, no_show: 2, scheduled: 0 }
```

---

## Lab Request Model

**File:** `labRequestModel.js`

Manages laboratory test requests and results tracking.

### Methods

#### `create(data)`
Creates a new lab request.

**Parameters:**
```javascript
{
  consultation_id: string (UUID),
  test_name: string,
  test_type: string ('blood', 'urine', 'imaging', 'other'),
  instructions: string (optional)
}
```

**Returns:** Lab request object

**Example:**
```javascript
const labRequest = await LabRequest.create({
  consultation_id: 'consultation-uuid',
  test_name: 'Complete Blood Count',
  test_type: 'blood',
  instructions: 'Fasting required'
});
```

---

#### `getById(id)`
Retrieves a single lab request with related data.

**Parameters:**
- `id` (string): Lab request UUID

**Returns:** Lab request object or null

**Example:**
```javascript
const labRequest = await LabRequest.getById('lab-request-uuid');
// Returns: { id, test_name, status, result, patient_name, completed_by_name, ... }
```

---

#### `getByConsultation(consultationId)`
Gets all lab requests for a specific consultation.

**Parameters:**
- `consultationId` (string): Consultation UUID

**Returns:** Array of lab requests

**Example:**
```javascript
const labRequests = await LabRequest.getByConsultation('consultation-uuid');
```

---

#### `getByPatient(patientId)`
Gets all lab requests for a specific patient.

**Parameters:**
- `patientId` (string): Patient UUID

**Returns:** Array of lab requests

**Example:**
```javascript
const labRequests = await LabRequest.getByPatient('patient-uuid');
```

---

#### `update(id, data)`
Updates a lab request.

**Parameters:**
```javascript
{
  id: string,
  data: {
    status: string (optional),
    result: string (optional),
    result_unit: string (optional),
    normal_range: string (optional),
    completed_by: string (optional)
  }
}
```

**Returns:** Updated lab request object

**Example:**
```javascript
const updated = await LabRequest.update('lab-request-uuid', {
  status: 'completed',
  result: '7.5',
  result_unit: 'g/dL',
  normal_range: '7.0-8.0',
  completed_by: 'lab-tech-uuid'
});
```

---

#### `updateStatus(id, status)`
Updates only the lab request status.

**Parameters:**
- `id` (string): Lab request UUID
- `status` (string): New status

**Returns:** Updated lab request object

**Example:**
```javascript
const updated = await LabRequest.updateStatus('lab-request-uuid', 'processing');
```

---

#### `markSampleCollected(id)`
Marks a lab request as sample collected.

**Parameters:**
- `id` (string): Lab request UUID

**Returns:** Updated lab request object

**Example:**
```javascript
const updated = await LabRequest.markSampleCollected('lab-request-uuid');
```

---

#### `markProcessing(id)`
Marks a lab request as processing.

**Parameters:**
- `id` (string): Lab request UUID

**Returns:** Updated lab request object

**Example:**
```javascript
const updated = await LabRequest.markProcessing('lab-request-uuid');
```

---

#### `completeWithResults(id, data)`
Completes a lab request with results.

**Parameters:**
```javascript
{
  id: string,
  data: {
    result: string,
    result_unit: string,
    normal_range: string,
    completed_by: string (UUID)
  }
}
```

**Returns:** Updated lab request object

**Example:**
```javascript
const completed = await LabRequest.completeWithResults('lab-request-uuid', {
  result: '7.5',
  result_unit: 'g/dL',
  normal_range: '7.0-8.0',
  completed_by: 'lab-tech-uuid'
});
```

---

#### `search(filters, limit, offset)`
Searches lab requests with optional filtering and pagination.

**Parameters:**
```javascript
{
  filters: {
    consultation_id: string (optional),
    patient_id: string (optional),
    test_type: string (optional),
    status: string (optional),
    test_name: string (optional),
    start_date: string (optional),
    end_date: string (optional)
  },
  limit: number (default: 20),
  offset: number (default: 0)
}
```

**Returns:** Object with labRequests array and pagination info

**Example:**
```javascript
const result = await LabRequest.search(
  { patient_id: 'patient-uuid', status: 'completed' },
  20,
  0
);
```

---

#### `getPending(limit)`
Gets all pending lab requests.

**Parameters:**
- `limit` (number, default: 50): Maximum number of results

**Returns:** Array of pending lab requests

**Example:**
```javascript
const pending = await LabRequest.getPending(50);
```

---

#### `getStats(startDate, endDate)`
Gets lab request statistics within a date range.

**Parameters:**
- `startDate` (string): Start date in YYYY-MM-DD format
- `endDate` (string): End date in YYYY-MM-DD format

**Returns:** Statistics object

**Example:**
```javascript
const stats = await LabRequest.getStats('2024-12-01', '2024-12-31');
// Returns: { total: 100, completed: 85, cancelled: 5, processing: 10, requested: 0 }
```

---

#### `cancel(id)`
Cancels a lab request.

**Parameters:**
- `id` (string): Lab request UUID

**Returns:** Updated lab request object

**Example:**
```javascript
const cancelled = await LabRequest.cancel('lab-request-uuid');
```

---

#### `delete(id)`
Deletes a lab request.

**Parameters:**
- `id` (string): Lab request UUID

**Returns:** Boolean (true if deleted)

**Example:**
```javascript
const deleted = await LabRequest.delete('lab-request-uuid');
```

---

## Consultation Model

**File:** `consultation.model.js`

Manages medical consultation records with vital signs and diagnosis.

### Key Methods

- `create(data)` - Create consultation with vitals
- `findById(id)` - Get consultation with patient and doctor details
- `update(id, data)` - Update consultation
- `search(filters, limit, offset)` - Search consultations
- `calculateBMI(weight, height)` - Calculate BMI from weight and height
- `validateVitals(data)` - Validate vital signs ranges

### Validation Schema

Validates:
- Blood pressure (systolic: 70-250, diastolic: 40-150)
- Temperature (35-42°C)
- Pulse rate (40-220 bpm)
- Respiratory rate (10-60)
- Weight (1-500 kg)
- Height (50-250 cm)
- SpO2 (70-100%)

---

## Prescription Model

**File:** `prescription.model.js`

Manages drug prescriptions and dispensing workflow.

### Key Methods

- `create(data)` - Create prescription
- `findById(id)` - Get prescription with patient details
- `update(id, data)` - Update prescription
- `dispense(id, userId)` - Mark prescription as dispensed
- `cancel(id)` - Cancel prescription
- `search(filters, limit, offset)` - Search prescriptions

### Validation Schema

Validates:
- Drug name (required, max 200 chars)
- Dosage (required, max 100 chars)
- Frequency (required, max 100 chars)
- Duration (required, max 100 chars)
- Status (pending, dispensed, cancelled)

---

## Patient Model

**File:** `patientModel.js`

Manages patient records and demographics.

### Key Methods

- `findAll()` - Get all patients (limited to 100)
- `findById(id)` - Get patient by ID
- `search(term)` - Search patients by name, phone, email, or ID
- `create(data)` - Create new patient
- `update(id, data)` - Update patient
- `delete(id)` - Delete patient

---

## User Model

**File:** `userModel.js`

Manages user (staff) records and authentication.

### Key Methods

- `findByEmail(email)` - Find user by email with role
- `findById(id)` - Find user by ID with role
- `create(data)` - Create new user with hashed password
- `verifyPassword(user, password)` - Verify password against hash

---

## Common Patterns

### Error Handling

All models use try-catch blocks and throw errors for the controller to handle:

```javascript
try {
  const result = await Model.method(data);
  return result;
} catch (error) {
  throw error; // Controller handles with res.status(500)
}
```

### Pagination

List methods return pagination info:

```javascript
{
  items: [...],
  total: 100,
  limit: 20,
  offset: 0,
  pages: 5
}
```

### Timestamps

All models automatically manage:
- `created_at` - Set on creation
- `updated_at` - Updated on modification

### UUID Generation

All models use `uuid` package for ID generation:

```javascript
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();
```

---

## Usage in Controllers

### Example: Creating an Appointment

```javascript
// In appointmentController.js
const createAppointment = async (req, res) => {
  try {
    // Validate input
    const { error, value } = Appointment.validationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check for conflicts
    const hasConflict = await Appointment.checkConflict(
      value.doctor_id,
      value.appointment_date,
      value.appointment_time
    );

    if (hasConflict) {
      return res.status(400).json({ message: 'Doctor not available at this time' });
    }

    // Create appointment
    const appointment = await Appointment.create(value);

    res.status(201).json({
      status: 'success',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

---

## Testing Models

### Example Test Cases

```javascript
// Test Appointment.create
const appointment = await Appointment.create({
  patient_id: 'patient-uuid',
  doctor_id: 'doctor-uuid',
  appointment_date: '2024-12-20',
  appointment_time: '10:30',
  type: 'new'
});

// Test Appointment.checkConflict
const conflict = await Appointment.checkConflict(
  'doctor-uuid',
  '2024-12-20',
  '10:30'
);

// Test LabRequest.search
const results = await LabRequest.search(
  { status: 'completed', test_type: 'blood' },
  20,
  0
);
```

---

## Summary

All models follow consistent patterns:
- ✅ Comprehensive CRUD operations
- ✅ Advanced search and filtering
- ✅ Pagination support
- ✅ Validation schemas
- ✅ Error handling
- ✅ Related data joins
- ✅ Status workflow methods
- ✅ Statistics and reporting
