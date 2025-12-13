# Prescription Submission Workflow

## Overview

The consultation form now requires doctors to **explicitly submit prescriptions to the pharmacy** before they can finish the consultation. This ensures prescriptions are properly recorded and sent to the pharmacy system before the consultation is completed.

---

## New Workflow

### Step-by-Step Process

1. **Fill Patient Vitals**
   - Blood pressure, heart rate, temperature, etc.

2. **Add Lab Tests (Optional)**
   - Select tests from Ethiopian MOH list
   - Click "Send to Lab" if needed
   - Consultation pauses until results are ready

3. **Enter Clinical Details**
   - Symptoms
   - Diagnosis
   - ICD code (optional)
   - Notes

4. **Add Prescriptions** ⭐ NEW REQUIREMENT
   - Add at least one prescription with:
     - Drug name (required)
     - Dosage (required)
     - Frequency
     - Duration
     - Instructions

5. **Submit Prescription to Pharmacy** ⭐ NEW STEP
   - Click the green "Submit Prescription to Pharmacy" button
   - System validates prescriptions
   - Prescriptions are saved and marked as submitted
   - Success message appears
   - Button changes to "✓ Submitted to Pharmacy"

6. **Finish Consultation**
   - Now enabled after prescription submission
   - Click "Finish Consultation"
   - Final validation runs
   - Consultation marked as COMPLETED
   - Billing generated
   - Redirect to appointments page

---

## UI Changes

### Before Prescription Submission

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Important: You must submit the prescription to       │
│    pharmacy before finishing the consultation.          │
└─────────────────────────────────────────────────────────┘

[Save Draft]  [Submit Prescription to Pharmacy]  [Finish Consultation (disabled)]
```

### After Prescription Submission

```
┌─────────────────────────────────────────────────────────┐
│ ✓ Prescription Submitted! You can now finish the       │
│   consultation.                                         │
└─────────────────────────────────────────────────────────┘

[Save Draft]  [✓ Submitted to Pharmacy (disabled)]  [Finish Consultation]
```

---

## Button States

### "Submit Prescription to Pharmacy" Button

**Enabled when:**
- At least one prescription has drug_name AND dosage filled
- Not waiting for lab results
- Prescription not already submitted

**Disabled when:**
- No valid prescriptions (missing drug_name or dosage)
- Waiting for lab results
- Already submitted (shows checkmark)
- Currently submitting

**Visual States:**
- Default: Green button "Submit Prescription to Pharmacy"
- Submitting: Shows spinner "Submitting..."
- Submitted: Shows checkmark "✓ Submitted to Pharmacy" (grayed out)

### "Finish Consultation" Button

**Enabled when:**
- Prescription has been submitted to pharmacy
- Not waiting for lab results
- Not currently submitting

**Disabled when:**
- Prescription NOT submitted yet (shows tooltip: "Please submit prescription to pharmacy first")
- Waiting for lab results
- Currently finishing consultation

---

## Validation Rules

### Prescription Validation

Before submission, the system checks:
1. At least one prescription exists
2. Each prescription has:
   - `drug_name` (not empty)
   - `dosage` (not empty)

**Error Messages:**
- "Please add at least one prescription with drug name and dosage"

### Final Consultation Validation

Before finishing, the system checks:
1. ✅ Prescription submitted to pharmacy
2. ✅ Symptoms filled
3. ✅ Diagnosis filled
4. ✅ All vitals valid
5. ✅ At least one valid prescription

---

## Technical Implementation

### New State Variables

```javascript
const [submittingPrescription, setSubmittingPrescription] = useState(false);
const [prescriptionSubmitted, setPrescriptionSubmitted] = useState(false);
```

### New Handler Function

```javascript
const handleSubmitPrescription = async () => {
  // 1. Validate prescriptions
  // 2. Save consultation with prescriptions
  // 3. Mark as submitted
  // 4. Show success message
  // 5. Enable "Finish Consultation" button
};
```

### Button Logic

```javascript
// Submit Prescription button
disabled={
  submittingPrescription || 
  prescriptionSubmitted || 
  isWaitingForLab || 
  prescriptions.filter(p => p.drug_name && p.dosage).length === 0
}

// Finish Consultation button
disabled={
  submitting || 
  isWaitingForLab || 
  !prescriptionSubmitted  // ⭐ NEW: Must submit prescription first
}
```

---

## User Experience

### Visual Feedback

1. **Warning Notice (Before Submission)**
   - Amber background
   - Info icon
   - Clear message about requirement

2. **Success Notice (After Submission)**
   - Green background
   - Checkmark icon
   - Confirmation message

3. **Button States**
   - Color changes (green for submit, blue for finish)
   - Icon changes (spinner → checkmark)
   - Text changes
   - Disabled state styling

### Tooltips

- Hovering over disabled "Finish Consultation" shows:
  - "Please submit prescription to pharmacy first"

---

## Edge Cases Handled

### 1. Loading Existing Consultation
- If consultation already has prescriptions saved
- Automatically marks `prescriptionSubmitted = true`
- "Finish Consultation" button is enabled
- Shows "✓ Submitted to Pharmacy"

### 2. Waiting for Lab Results
- All buttons disabled during lab wait
- Blue info banner shows status
- Cannot submit prescription or finish consultation

### 3. No Prescriptions Added
- "Submit Prescription" button disabled
- Clear error message if attempted
- Must add at least one valid prescription

### 4. Partial Prescriptions
- Only counts prescriptions with BOTH drug_name AND dosage
- Empty rows are ignored
- Validation message guides user

---

## API Integration

### Prescription Submission

**Endpoint:** `POST /api/consultations/save-draft`

**Payload:**
```json
{
  "consultation_id": "uuid",
  "appointment_id": "uuid",
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "vitals": { ... },
  "symptoms": "...",
  "diagnosis": "...",
  "prescriptions": [
    {
      "drug_name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "duration": "7 days",
      "instructions": "Take with food"
    }
  ],
  "status": "DRAFT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "consultation-uuid",
    "status": "DRAFT",
    "prescriptions": [ ... ]
  }
}
```

---

## Benefits

### 1. **Explicit Workflow**
- Clear separation between prescription submission and consultation completion
- Reduces errors and missed prescriptions

### 2. **Pharmacy Integration**
- Prescriptions sent to pharmacy immediately
- Pharmacy can start preparing medications
- Reduces patient wait time

### 3. **Audit Trail**
- Clear timestamp when prescription was submitted
- Separate from consultation completion
- Better tracking and accountability

### 4. **User Guidance**
- Visual indicators guide doctor through process
- Cannot accidentally skip prescription submission
- Clear feedback at each step

---

## Testing Checklist

### ✅ Basic Flow
- [ ] Add prescription with drug_name and dosage
- [ ] Click "Submit Prescription to Pharmacy"
- [ ] Verify success message appears
- [ ] Verify button changes to "✓ Submitted to Pharmacy"
- [ ] Verify "Finish Consultation" becomes enabled
- [ ] Click "Finish Consultation"
- [ ] Verify consultation completes successfully

### ✅ Validation
- [ ] Try to submit without prescriptions → Error message
- [ ] Try to submit with only drug_name → Error message
- [ ] Try to submit with only dosage → Error message
- [ ] Try to finish before submitting prescription → Button disabled

### ✅ Edge Cases
- [ ] Load existing consultation with prescriptions → Auto-marked as submitted
- [ ] Add prescription during lab wait → Button disabled
- [ ] Multiple prescriptions → All validated correctly
- [ ] Empty prescription rows → Ignored correctly

### ✅ Visual Feedback
- [ ] Warning notice shows before submission
- [ ] Success notice shows after submission
- [ ] Button states change correctly
- [ ] Tooltips show on disabled buttons
- [ ] Loading spinners work

---

## Files Modified

### Frontend
- `frontend/src/components/consultation/ConsultationFormNew.jsx`
  - Added `submittingPrescription` state
  - Added `prescriptionSubmitted` state
  - Added `handleSubmitPrescription` function
  - Updated button section with new workflow
  - Added visual feedback notices

### No Backend Changes Required
- Uses existing `saveDraft` endpoint
- No new API endpoints needed
- Prescription data already handled correctly

---

## Future Enhancements

### Potential Improvements
1. **Pharmacy Notification**
   - Real-time notification to pharmacy system
   - SMS/email to pharmacist

2. **Prescription Templates**
   - Save common prescriptions
   - Quick-add frequently prescribed medications

3. **Drug Interaction Checking**
   - Validate against patient allergies
   - Check for drug-drug interactions

4. **Prescription History**
   - Show patient's previous prescriptions
   - Refill functionality

5. **E-Prescription**
   - Digital signature
   - QR code for pharmacy scanning
   - Integration with national e-health system

---

## Summary

The new prescription workflow ensures that:
1. ✅ Doctors explicitly submit prescriptions to pharmacy
2. ✅ Prescriptions are validated before submission
3. ✅ Clear visual feedback guides the process
4. ✅ Consultation cannot be finished without prescription submission
5. ✅ Better integration with pharmacy workflow
6. ✅ Improved patient care and safety

**The workflow is now more structured, safer, and provides better user experience!** 🎉
