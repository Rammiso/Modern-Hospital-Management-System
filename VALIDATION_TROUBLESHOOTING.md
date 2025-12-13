# Validation Troubleshooting Guide

## "Validation Failed" Error

When you click "Finish Consultation" and see "Validation failed", it means one or more required fields are missing or invalid.

---

## Required Fields Checklist

### ✅ Vitals (All Required)
- [ ] **Blood Pressure Systolic** (50-250 mmHg)
- [ ] **Blood Pressure Diastolic** (30-150 mmHg)
  - Systolic must be greater than diastolic
- [ ] **Heart Rate** (30-220 bpm)
- [ ] **Temperature** (35-42°C)
- [ ] **Height** (30-300 cm)
- [ ] **Weight** (0.5-500 kg)
- [ ] **SpO2** (70-100%)

### ✅ Clinical Details (Required)
- [ ] **Symptoms** (cannot be empty)
- [ ] **Diagnosis** (cannot be empty)

### ✅ Prescriptions (Required)
- [ ] At least ONE prescription with:
  - **Drug Name** (required)
  - **Dosage** (required)
- [ ] Prescription must be submitted to pharmacy first

---

## How to Find the Problem

### Step 1: Check the Error Message
The new error message will tell you exactly which fields are missing:
```
Validation failed. Please check: Blood Pressure Systolic, Heart Rate, Temperature
```

### Step 2: Check Browser Console
1. Press F12 to open Developer Tools
2. Click "Console" tab
3. Look for:
   ```
   Validation errors: { heart_rate: "Heart rate is required", ... }
   Form data: { vitals: {...}, symptoms: "...", ... }
   ```

### Step 3: Scroll to Error Fields
The form will automatically scroll to the first error field (highlighted in red).

---

## Common Issues

### Issue 1: "Blood Pressure is required"
**Problem:** One or both blood pressure fields are empty  
**Solution:** Fill both systolic AND diastolic values

### Issue 2: "Systolic must be greater than diastolic"
**Problem:** Diastolic value is higher than or equal to systolic  
**Solution:** Ensure systolic > diastolic (e.g., 120/80, not 80/120)

### Issue 3: "Heart rate must be between 30-220 bpm"
**Problem:** Heart rate is outside valid range  
**Solution:** Enter a realistic heart rate value

### Issue 4: "Temperature must be between 35-42°C"
**Problem:** Temperature is outside valid range  
**Solution:** Enter temperature in Celsius (e.g., 37.5)

### Issue 5: "Height must be between 30-300 cm"
**Problem:** Height is outside valid range  
**Solution:** Enter height in centimeters (e.g., 170)

### Issue 6: "Weight must be between 0.5-500 kg"
**Problem:** Weight is outside valid range  
**Solution:** Enter weight in kilograms (e.g., 70)

### Issue 7: "SpO2 must be between 70-100%"
**Problem:** SpO2 is outside valid range  
**Solution:** Enter oxygen saturation percentage (e.g., 98)

### Issue 8: "Symptoms is required"
**Problem:** Symptoms field is empty  
**Solution:** Enter patient symptoms

### Issue 9: "Diagnosis is required"
**Problem:** Diagnosis field is empty  
**Solution:** Enter diagnosis

### Issue 10: "At least one prescription with drug name and dosage is required"
**Problem:** No valid prescriptions OR prescription not submitted  
**Solution:** 
1. Add at least one prescription with drug_name AND dosage
2. Click "Submit Prescription to Pharmacy" button
3. Wait for success message
4. Then click "Finish Consultation"

---

## Validation Rules Reference

### Blood Pressure
- **Systolic:** 50-250 mmHg
- **Diastolic:** 30-150 mmHg
- **Rule:** Systolic > Diastolic

### Heart Rate (Pulse)
- **Range:** 30-220 bpm
- **Normal:** 60-100 bpm

### Temperature
- **Range:** 35-42°C
- **Normal:** 36.5-37.5°C

### Height
- **Range:** 30-300 cm
- **Example:** 170 cm (5'7")

### Weight
- **Range:** 0.5-500 kg
- **Example:** 70 kg (154 lbs)

### SpO2 (Oxygen Saturation)
- **Range:** 70-100%
- **Normal:** 95-100%

---

## Step-by-Step Fix Process

### 1. Read the Error Message
```
Validation failed. Please check: Heart Rate, Temperature, Symptoms
```

### 2. Fill Missing Fields
- Go to Vitals section
- Fill Heart Rate: `75`
- Fill Temperature: `37.5`
- Go to Clinical Details
- Fill Symptoms: `Fever, headache, body aches`

### 3. Check Field Highlighting
- Red border = Error
- Green border = Valid

### 4. Try Again
- Click "Finish Consultation"
- Should now work if all fields are valid

---

## Quick Fix Checklist

Before clicking "Finish Consultation":

1. ✅ All vitals filled with valid values
2. ✅ Symptoms entered
3. ✅ Diagnosis entered
4. ✅ At least one prescription added
5. ✅ Prescription submitted to pharmacy (green checkmark)
6. ✅ No red borders on any fields

---

## Still Having Issues?

### Check Console for Details
```javascript
// In browser console, you'll see:
Validation errors: {
  heart_rate: "Heart rate is required",
  temperature: "Temperature is required",
  symptoms: "Symptoms is required"
}
```

### Verify Data
```javascript
// Check what data is being validated:
Form data: {
  vitals: {
    blood_pressure_systolic: "120",
    blood_pressure_diastolic: "80",
    heart_rate: "",  // ❌ Empty!
    temperature: "", // ❌ Empty!
    ...
  },
  symptoms: "",      // ❌ Empty!
  diagnosis: "Flu",
  prescriptions: [...]
}
```

---

## Example: Complete Valid Form

```javascript
Vitals:
  Blood Pressure: 120/80
  Heart Rate: 75 bpm
  Temperature: 37.5°C
  Height: 170 cm
  Weight: 70 kg
  SpO2: 98%

Clinical Details:
  Symptoms: "Fever, headache, body aches"
  Diagnosis: "Influenza"
  ICD Code: "J11.1" (optional)
  Notes: "Rest and hydration" (optional)

Prescriptions:
  1. Drug: Paracetamol
     Dosage: 500mg
     Frequency: 3 times daily
     Duration: 5 days
     
  [✓ Submitted to Pharmacy]

Result: ✅ Validation passes, consultation can be finished
```

---

## Summary

**Most Common Causes:**
1. Empty vitals fields (especially heart rate, temperature)
2. Empty symptoms or diagnosis
3. Prescription not submitted to pharmacy
4. Invalid values (out of range)

**Quick Fix:**
1. Check error message for field names
2. Fill all required fields
3. Ensure values are in valid ranges
4. Submit prescription to pharmacy
5. Try again

**Need Help?**
- Check browser console (F12)
- Look for red-bordered fields
- Verify all required fields are filled
- Ensure prescription is submitted

---

**Remember:** All vitals, symptoms, diagnosis, and prescriptions are required before finishing a consultation!
