# Model Usage Examples

Practical examples for using the completed models in your application.

---

## Table of Contents

1. [Appointment Model Examples](#appointment-model-examples)
2. [Lab Request Model Examples](#lab-request-model-examples)
3. [Integration Examples](#integration-examples)
4. [Error Handling](#error-handling)

---

## Appointment Model Examples

### Example 1: Create an Appointment with Conflict Check

```javascript
// In appointmentController.js
const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, type, reason } = req.body;

    // Validate input
    const { error, value } = Appointment.validationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details[0].message 
      });
    }

    // Check for conflicts
    const hasConflict = await Appointment.checkConflict(
      doctor_id,
      appointment_date,
      appointment_time
    );

    if (hasConflict) {
      return res.status(400).json({ 
        message: 'Doctor not available at this time',
        suggestion: 'Please choose another time slot'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      ...value,
      created_by: req.user.id
    });

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Create Appointment Error:', error);
    res.status(500).json({ 
      message: 'Failed to create appointment',
      error: error.message 
    });
  }
};
```

---

### Example 2: Get Available Slots for Booking

```javascript
// In appointmentController.js
const getAvailableSlots = async (req, res) => {
  try {
    const { doctor_id, appointment_date } = req.query;

    if (!doctor_id || !appointment_date) {
      return res.status(400).json({ 
        message: 'doctor_id and appointment_date are required' 
      });
    }

    // Get available slots
    const slots = await Appointment.getAvailableSlots(
      doctor_id,
      appointment_date,
      30 // 30-minute slots
    );

    res.json({
      status: 'success',
      doctor_id,
      appointment_date,
      available_slots: slots,
      total_slots: slots.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch available slots',
      error: error.message 
    });
  }
};
```

---

### Example 3: List Appointments with Filters

```javascript
// In appointmentController.js
const listAppointments = async (req, res) => {
  try {
    const { doctor_id, patient_id, appointment_date, status, page = 1, limit = 20 } = req.query;

    const filters = {};
    if (doctor_id) filters.doctor_id = doctor_id;
    if (patient_id) filters.patient_id = patient_id;
    if (appointment_date) filters.appointment_date = appointment_date;
    if (status) filters.status = status;

    const offset = (page - 1) * limit;

    const result = await Appointment.list(filters, parseInt(limit), parseInt(offset));

    res.json({
      status: 'success',
      data: result.appointments,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: result.pages
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch appointments',
      error: error.message 
    });
  }
};
```

---

### Example 4: Update Appointment Status

```javascript
// In appointmentController.js
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['scheduled', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const updated = await Appointment.updateStatus(id, status);

    if (!updated) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      status: 'success',
      message: `Appointment status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update appointment',
      error: error.message 
    });
  }
};
```

---

### Example 5: Get Doctor's Schedule for a Date Range

```javascript
// In appointmentController.js
const getDoctorSchedule = async (req, res) => {
  try {
    const { doctor_id, start_date, end_date } = req.query;

    if (!doctor_id || !start_date || !end_date) {
      return res.status(400).json({ 
        message: 'doctor_id, start_date, and end_date are required' 
      });
    }

    const appointments = await Appointment.getByDateRange(
      doctor_id,
      start_date,
      end_date
    );

    res.json({
      status: 'success',
      doctor_id,
      date_range: { start_date, end_date },
      appointments,
      total: appointments.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch schedule',
      error: error.message 
    });
  }
};
```

---

### Example 6: Get Doctor Performance Statistics

```javascript
// In appointmentController.js
const getDoctorStats = async (req, res) => {
  try {
    const { doctor_id, start_date, end_date } = req.query;

    if (!doctor_id || !start_date || !end_date) {
      return res.status(400).json({ 
        message: 'doctor_id, start_date, and end_date are required' 
      });
    }

    const stats = await Appointment.getStats(doctor_id, start_date, end_date);

    const completionRate = stats.total > 0 
      ? ((stats.completed / stats.total) * 100).toFixed(2) 
      : 0;

    res.json({
      status: 'success',
      doctor_id,
      period: { start_date, end_date },
      statistics: {
        total_appointments: stats.total,
        completed: stats.completed,
        cancelled: stats.cancelled,
        no_show: stats.no_show,
        scheduled: stats.scheduled,
        completion_rate: `${completionRate}%`
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
};
```

---

### Example 7: Cancel Appointment

```javascript
// In appointmentController.js
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const cancelled = await Appointment.cancel(id, reason);

    if (!cancelled) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      status: 'success',
      message: 'Appointment cancelled successfully',
      data: cancelled
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to cancel appointment',
      error: error.message 
    });
  }
};
```

---

## Lab Request Model Examples

### Example 1: Create Lab Request During Consultation

```javascript
// In consultationController.js
const createConsultationWithLabTests = async (req, res) => {
  try {
    const { appointment_id, patient_id, doctor_id, symptoms, diagnosis, lab_tests } = req.body;

    // Create consultation
    const consultation = await ConsultationModel.create({
      appointment_id,
      patient_id,
      doctor_id,
      symptoms,
      diagnosis
    });

    // Create associated lab requests
    const labRequests = [];
    if (lab_tests && Array.isArray(lab_tests)) {
      for (const test of lab_tests) {
        const labRequest = await LabRequest.create({
          consultation_id: consultation.id,
          test_name: test.test_name,
          test_type: test.test_type,
          instructions: test.instructions
        });
        labRequests.push(labRequest);
      }
    }

    res.status(201).json({
      status: 'success',
      message: 'Consultation created with lab requests',
      data: {
        consultation,
        lab_requests: labRequests
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to create consultation',
      error: error.message 
    });
  }
};
```

---

### Example 2: Get Pending Lab Requests for Lab Technician

```javascript
// In labRequestController.js
const getPendingLabRequests = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const pending = await LabRequest.getPending(parseInt(limit));

    res.json({
      status: 'success',
      message: 'Pending lab requests',
      data: pending,
      total: pending.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch pending requests',
      error: error.message 
    });
  }
};
```

---

### Example 3: Complete Lab Request with Results

```javascript
// In labRequestController.js
const completeLabRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { result, result_unit, normal_range } = req.body;

    // Validate input
    if (!result || !result_unit) {
      return res.status(400).json({ 
        message: 'result and result_unit are required' 
      });
    }

    const completed = await LabRequest.completeWithResults(id, {
      result,
      result_unit,
      normal_range,
      completed_by: req.user.id
    });

    if (!completed) {
      return res.status(404).json({ message: 'Lab request not found' });
    }

    res.json({
      status: 'success',
      message: 'Lab request completed with results',
      data: completed
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to complete lab request',
      error: error.message 
    });
  }
};
```

---

### Example 4: Lab Request Workflow

```javascript
// In labRequestController.js
const updateLabRequestWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'collect', 'process', 'complete'

    let updated;

    switch (action) {
      case 'collect':
        updated = await LabRequest.markSampleCollected(id);
        break;
      case 'process':
        updated = await LabRequest.markProcessing(id);
        break;
      case 'complete':
        const { result, result_unit, normal_range } = req.body;
        updated = await LabRequest.completeWithResults(id, {
          result,
          result_unit,
          normal_range,
          completed_by: req.user.id
        });
        break;
      default:
        return res.status(400).json({ 
          message: 'Invalid action. Must be: collect, process, or complete' 
        });
    }

    if (!updated) {
      return res.status(404).json({ message: 'Lab request not found' });
    }

    res.json({
      status: 'success',
      message: `Lab request ${action}ed successfully`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update lab request',
      error: error.message 
    });
  }
};
```

---

### Example 5: Search Lab Requests

```javascript
// In labRequestController.js
const searchLabRequests = async (req, res) => {
  try {
    const { 
      consultation_id, 
      patient_id, 
      test_type, 
      status, 
      test_name,
      start_date,
      end_date,
      page = 1, 
      limit = 20 
    } = req.query;

    const filters = {};
    if (consultation_id) filters.consultation_id = consultation_id;
    if (patient_id) filters.patient_id = patient_id;
    if (test_type) filters.test_type = test_type;
    if (status) filters.status = status;
    if (test_name) filters.test_name = test_name;
    if (start_date && end_date) {
      filters.start_date = start_date;
      filters.end_date = end_date;
    }

    const offset = (page - 1) * limit;

    const result = await LabRequest.search(filters, parseInt(limit), parseInt(offset));

    res.json({
      status: 'success',
      data: result.labRequests,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: result.pages
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to search lab requests',
      error: error.message 
    });
  }
};
```

---

### Example 6: Get Lab Statistics

```javascript
// In labRequestController.js
const getLabStatistics = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ 
        message: 'start_date and end_date are required' 
      });
    }

    const stats = await LabRequest.getStats(start_date, end_date);

    const completionRate = stats.total > 0 
      ? ((stats.completed / stats.total) * 100).toFixed(2) 
      : 0;

    res.json({
      status: 'success',
      period: { start_date, end_date },
      statistics: {
        total_requests: stats.total,
        completed: stats.completed,
        cancelled: stats.cancelled,
        processing: stats.processing,
        requested: stats.requested,
        completion_rate: `${completionRate}%`
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
};
```

---

### Example 7: Get Patient's Lab History

```javascript
// In labRequestController.js
const getPatientLabHistory = async (req, res) => {
  try {
    const { patient_id } = req.params;

    const labRequests = await LabRequest.getByPatient(patient_id);

    res.json({
      status: 'success',
      patient_id,
      lab_requests: labRequests,
      total: labRequests.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch lab history',
      error: error.message 
    });
  }
};
```

---

## Integration Examples

### Example 1: Complete Consultation Workflow

```javascript
// In consultationController.js
const completeConsultation = async (req, res) => {
  try {
    const { appointment_id, patient_id, doctor_id, vitals, diagnosis, lab_tests, prescriptions } = req.body;

    // 1. Create consultation
    const consultation = await ConsultationModel.create({
      appointment_id,
      patient_id,
      doctor_id,
      ...vitals,
      diagnosis
    });

    // 2. Create lab requests
    const labRequests = [];
    if (lab_tests) {
      for (const test of lab_tests) {
        const labRequest = await LabRequest.create({
          consultation_id: consultation.id,
          ...test
        });
        labRequests.push(labRequest);
      }
    }

    // 3. Create prescriptions
    const prescriptionRecords = [];
    if (prescriptions) {
      for (const prescription of prescriptions) {
        const prescriptionRecord = await PrescriptionModel.create({
          consultation_id: consultation.id,
          ...prescription
        });
        prescriptionRecords.push(prescriptionRecord);
      }
    }

    // 4. Update appointment status
    await Appointment.updateStatus(appointment_id, 'completed');

    res.status(201).json({
      status: 'success',
      message: 'Consultation completed successfully',
      data: {
        consultation,
        lab_requests: labRequests,
        prescriptions: prescriptionRecords
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to complete consultation',
      error: error.message 
    });
  }
};
```

---

### Example 2: Patient Dashboard Data

```javascript
// In patientController.js
const getPatientDashboard = async (req, res) => {
  try {
    const { patient_id } = req.params;

    // Get upcoming appointments
    const appointmentsResult = await Appointment.list(
      { patient_id, status: 'scheduled' },
      10,
      0
    );

    // Get recent consultations
    const consultationsResult = await ConsultationModel.search(
      { patient_id },
      5,
      0
    );

    // Get pending lab requests
    const labRequests = await LabRequest.getByPatient(patient_id);
    const pendingLabs = labRequests.filter(lr => lr.status !== 'completed');

    res.json({
      status: 'success',
      patient_id,
      dashboard: {
        upcoming_appointments: appointmentsResult.appointments,
        recent_consultations: consultationsResult.consultations,
        pending_lab_requests: pendingLabs,
        summary: {
          total_appointments: appointmentsResult.total,
          total_consultations: consultationsResult.total,
          pending_labs: pendingLabs.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch dashboard',
      error: error.message 
    });
  }
};
```

---

## Error Handling

### Example 1: Comprehensive Error Handling

```javascript
const createAppointmentWithErrorHandling = async (req, res) => {
  try {
    // Validate input
    const { error, value } = Appointment.validationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    // Check for conflicts
    const hasConflict = await Appointment.checkConflict(
      value.doctor_id,
      value.appointment_date,
      value.appointment_time
    );

    if (hasConflict) {
      return res.status(409).json({ 
        status: 'error',
        message: 'Conflict detected',
        details: 'Doctor is not available at this time'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      ...value,
      created_by: req.user.id
    });

    res.status(201).json({
      status: 'success',
      message: 'Appointment created',
      data: appointment
    });

  } catch (error) {
    console.error('Appointment Creation Error:', error);

    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        status: 'error',
        message: 'Duplicate entry',
        details: 'This appointment already exists'
      });
    }

    if (error.code === 'ER_NO_REFERENCED_ROW') {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid reference',
        details: 'Patient or doctor not found'
      });
    }

    // Generic error
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

---

### Example 2: Async Error Wrapper

```javascript
// Create a wrapper for consistent error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Use in routes
router.post('/appointments', asyncHandler(async (req, res) => {
  const appointment = await Appointment.create(req.body);
  res.status(201).json({ status: 'success', data: appointment });
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
```

---

## Summary

These examples demonstrate:
- ✅ How to use each model method
- ✅ Proper error handling
- ✅ Input validation
- ✅ Response formatting
- ✅ Integration between models
- ✅ Real-world workflows

Adapt these examples to your specific needs and integrate them into your controllers.
