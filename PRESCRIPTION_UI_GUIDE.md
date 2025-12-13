# Prescription Submission UI Guide

## Visual Layout

### Before Prescription Submission

```
┌────────────────────────────────────────────────────────────────────┐
│                     CONSULTATION FORM                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Patient Vitals Section]                                         │
│  [Lab Request Section]                                            │
│  [Clinical Details Section]                                       │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 💊 Prescriptions                                         │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │                                                          │    │
│  │  Drug Name: [Amoxicillin____________]                   │    │
│  │  Dosage:    [500mg__________________]                   │    │
│  │  Frequency: [3 times daily__________]                   │    │
│  │  Duration:  [7 days_________________]                   │    │
│  │  Instructions: [Take with food______]                   │    │
│  │                                                          │    │
│  │  [+ Add Medicine]                                        │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ ⚠️  Important: You must submit the prescription to       │    │
│  │     pharmacy before finishing the consultation.          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │  [Save Draft]  [Submit Prescription to Pharmacy]        │    │
│  │                                                          │    │
│  │                [Finish Consultation] (grayed out)        │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### After Clicking "Submit Prescription to Pharmacy"

```
┌────────────────────────────────────────────────────────────────────┐
│                     CONSULTATION FORM                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [Patient Vitals Section]                                         │
│  [Lab Request Section]                                            │
│  [Clinical Details Section]                                       │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 💊 Prescriptions                                         │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │                                                          │    │
│  │  Drug Name: [Amoxicillin____________]                   │    │
│  │  Dosage:    [500mg__________________]                   │    │
│  │  Frequency: [3 times daily__________]                   │    │
│  │  Duration:  [7 days_________________]                   │    │
│  │  Instructions: [Take with food______]                   │    │
│  │                                                          │    │
│  │  [+ Add Medicine]                                        │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ ✅ Prescription Submitted! You can now finish the        │    │
│  │    consultation.                                         │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │  [Save Draft]  [✓ Submitted to Pharmacy] (grayed out)   │    │
│  │                                                          │    │
│  │                [Finish Consultation] (now enabled!)      │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Button Color Scheme

### Save Draft Button
- **Color:** Gray/White (Secondary)
- **State:** Enabled when prescriptions OR lab requests exist
- **Purpose:** Save progress without completing

### Submit Prescription to Pharmacy Button
- **Color:** Green (Success)
- **State:** Enabled when valid prescriptions exist
- **Purpose:** Send prescriptions to pharmacy system
- **After Click:** Shows checkmark, becomes grayed out

### Finish Consultation Button
- **Color:** Blue (Primary)
- **State:** Disabled until prescription submitted
- **Purpose:** Complete consultation and generate billing
- **Tooltip:** "Please submit prescription to pharmacy first" (when disabled)

---

## Notice Banners

### Warning Banner (Amber)
```
┌────────────────────────────────────────────────────────┐
│ ⚠️  Important: You must submit the prescription to     │
│     pharmacy before finishing the consultation.        │
└────────────────────────────────────────────────────────┘
```
- **When:** Before prescription submission
- **Color:** Amber/Yellow background
- **Icon:** Warning/Info icon
- **Purpose:** Inform user of requirement

### Success Banner (Green)
```
┌────────────────────────────────────────────────────────┐
│ ✅ Prescription Submitted! You can now finish the      │
│    consultation.                                       │
└────────────────────────────────────────────────────────┘
```
- **When:** After successful prescription submission
- **Color:** Green background
- **Icon:** Checkmark icon
- **Purpose:** Confirm submission and guide next step

---

## Button States Visual Guide

### "Submit Prescription to Pharmacy" Button States

#### 1. Default (Enabled)
```
┌─────────────────────────────────────────┐
│  Submit Prescription to Pharmacy        │
└─────────────────────────────────────────┘
```
- Green background
- White text
- Clickable
- Hover effect: Darker green

#### 2. Disabled (No Valid Prescriptions)
```
┌─────────────────────────────────────────┐
│  Submit Prescription to Pharmacy        │  (grayed out)
└─────────────────────────────────────────┘
```
- Faded green background
- Cursor: not-allowed
- Not clickable

#### 3. Submitting
```
┌─────────────────────────────────────────┐
│  ⟳ Submitting...                        │
└─────────────────────────────────────────┘
```
- Green background
- Spinner animation
- Not clickable

#### 4. Submitted
```
┌─────────────────────────────────────────┐
│  ✓ Submitted to Pharmacy                │  (grayed out)
└─────────────────────────────────────────┘
```
- Faded green background
- Checkmark icon
- Not clickable
- Indicates completion

---

### "Finish Consultation" Button States

#### 1. Disabled (Prescription Not Submitted)
```
┌─────────────────────────────────────────┐
│  Finish Consultation                    │  (grayed out)
└─────────────────────────────────────────┘
```
- Faded blue background
- Cursor: not-allowed
- Tooltip: "Please submit prescription to pharmacy first"

#### 2. Enabled (Ready to Finish)
```
┌─────────────────────────────────────────┐
│  Finish Consultation                    │
└─────────────────────────────────────────┘
```
- Blue background
- White text
- Clickable
- Hover effect: Darker blue

#### 3. Finishing
```
┌─────────────────────────────────────────┐
│  Finishing...                           │
└─────────────────────────────────────────┘
```
- Blue background
- Spinner animation
- Not clickable

---

## User Flow Diagram

```
START
  │
  ├─> Fill Vitals
  │
  ├─> Add Lab Tests (optional)
  │     └─> Send to Lab → Wait for Results
  │
  ├─> Enter Symptoms & Diagnosis
  │
  ├─> Add Prescriptions
  │     │
  │     ├─> Drug Name: Required ✓
  │     ├─> Dosage: Required ✓
  │     ├─> Frequency: Optional
  │     ├─> Duration: Optional
  │     └─> Instructions: Optional
  │
  ├─> Click "Submit Prescription to Pharmacy"
  │     │
  │     ├─> Validation Check
  │     │     ├─> No prescriptions? → Error ✗
  │     │     ├─> Missing drug_name? → Error ✗
  │     │     ├─> Missing dosage? → Error ✗
  │     │     └─> Valid? → Continue ✓
  │     │
  │     ├─> Save to Database
  │     │
  │     ├─> Show Success Message ✓
  │     │
  │     └─> Enable "Finish Consultation" Button
  │
  ├─> Click "Finish Consultation"
  │     │
  │     ├─> Final Validation
  │     │     ├─> All required fields? ✓
  │     │     ├─> Prescription submitted? ✓
  │     │     └─> Valid vitals? ✓
  │     │
  │     ├─> Mark as COMPLETED
  │     │
  │     ├─> Generate Billing
  │     │
  │     └─> Redirect to Appointments
  │
END
```

---

## Responsive Design

### Desktop (Large Screen)
- Three-column layout
- Buttons in single row
- Full-width notices

### Tablet (Medium Screen)
- Two-column layout
- Buttons may wrap to two rows
- Notices remain full-width

### Mobile (Small Screen)
- Single-column layout
- Buttons stack vertically
- Notices stack vertically
- Full-width components

---

## Accessibility Features

### Keyboard Navigation
- Tab through all buttons
- Enter/Space to activate
- Focus indicators visible

### Screen Readers
- Button labels are descriptive
- ARIA labels for icons
- Status messages announced
- Disabled state communicated

### Visual Indicators
- Color + icon (not color alone)
- Clear text labels
- Tooltips for disabled states
- Loading spinners with text

---

## Error States

### No Prescriptions
```
┌────────────────────────────────────────────────────────┐
│ ❌ Please add at least one prescription with drug      │
│    name and dosage                                     │
└────────────────────────────────────────────────────────┘
```

### Incomplete Prescription
```
┌────────────────────────────────────────────────────────┐
│ ❌ Please add at least one prescription with drug      │
│    name and dosage                                     │
└────────────────────────────────────────────────────────┘
```

### Submission Failed
```
┌────────────────────────────────────────────────────────┐
│ ❌ Failed to submit prescription to pharmacy           │
│    Please try again or contact support                │
└────────────────────────────────────────────────────────┘
```

---

## Animation & Transitions

### Button State Changes
- Smooth color transitions (300ms)
- Fade in/out for disabled state
- Spinner rotation animation

### Notice Banners
- Slide down animation on appear
- Fade transition between warning/success
- Smooth height changes

### Icon Changes
- Crossfade between icons
- Checkmark animation on success
- Spinner continuous rotation

---

## Summary

The new UI provides:
- ✅ Clear visual hierarchy
- ✅ Obvious workflow progression
- ✅ Immediate feedback
- ✅ Error prevention
- ✅ Accessibility compliance
- ✅ Professional appearance
- ✅ Intuitive user experience

**Users will never miss the prescription submission step!** 🎯
