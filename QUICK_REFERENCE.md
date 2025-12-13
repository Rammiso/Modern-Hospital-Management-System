# Quick Reference Card

## 🚀 What's New

### Prescription Submission Workflow
Doctors must now **explicitly submit prescriptions to pharmacy** before finishing consultations.

---

## 📋 Quick Steps

### For Doctors

1. **Fill Consultation Form**
   - Vitals, symptoms, diagnosis

2. **Add Prescriptions**
   - Drug name (required)
   - Dosage (required)
   - Frequency, duration, instructions (optional)

3. **Submit to Pharmacy** 🆕
   - Click green "Submit Prescription to Pharmacy" button
   - Wait for success message

4. **Finish Consultation**
   - Click blue "Finish Consultation" button
   - Now enabled after prescription submission

---

## 🎨 Button Guide

| Button | Color | When Enabled | Purpose |
|--------|-------|--------------|---------|
| Save Draft | Gray | Anytime | Save progress |
| Submit Prescription | Green | Valid prescriptions exist | Send to pharmacy |
| Finish Consultation | Blue | After prescription submitted | Complete consultation |

---

## ⚠️ Important Rules

1. **Must have at least ONE prescription** with:
   - Drug name ✓
   - Dosage ✓

2. **Must submit prescription BEFORE finishing**
   - Green button first
   - Blue button second

3. **Cannot skip prescription submission**
   - "Finish Consultation" disabled until submitted

---

## ✅ Visual Indicators

### Before Submission
```
⚠️ Important: You must submit the prescription to 
   pharmacy before finishing the consultation.
```

### After Submission
```
✅ Prescription Submitted! You can now finish the 
   consultation.
```

---

## 🐛 Common Issues

### "Finish Consultation" is Disabled
**Solution:** Click "Submit Prescription to Pharmacy" first

### "Please add at least one prescription"
**Solution:** Add drug name AND dosage to at least one prescription

### Button shows "✓ Submitted to Pharmacy"
**Status:** Already submitted, proceed to finish consultation

---

## 📞 Quick Help

**Frontend not loading?**
- Check browser console (F12)
- Refresh page

**Backend error?**
- Check terminal logs
- Restart backend: `npm start`

**Validation error?**
- Ensure all required fields filled
- Check prescription has drug_name AND dosage

---

## 🎯 Success Flow

```
Add Prescription → Submit to Pharmacy → Finish Consultation
     (Fill)            (Green Button)      (Blue Button)
```

---

**That's it! Simple and safe.** ✨
