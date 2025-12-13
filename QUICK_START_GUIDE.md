# 🚀 Quick Start Guide - Consultation Workflow

## ⚡ 5-Minute Setup

### Step 1: Database Setup (2 minutes)
```bash
# Navigate to backend
cd backend

# Run the workflow schema
mysql -u root -p Clinic_Management_System < config/consultation_workflow_schema.sql

# Verify (should show 60+ tests)
mysql -u root -p Clinic_Management_System -e "SELECT COUNT(*) FROM ethiopian_moh_lab_tests;"
```

### Step 2: Start Backend (1 minute)
```bash
# In backend directory
npm install  # If not already done
npm start

# Should see:
# 🚀 Server is running on port 4000
# 📡 API available at: http://localhost:4000/api
```

### Step 3: Start Frontend (1 minute)
```bash
# In frontend directory
cd ../frontend
npm install  # If not already done
npm run dev

# Should see:
# ➜  Local:   http://localhost:3000/
```

### Step 4: Test (1 minute)
1. Login as doctor
2. Go to: `http://localhost:3000/consultation/:appointmentId`
3. You should see the three-panel layout!

---

## 📋 What You Get

### UI (Frontend)
✅ Three-panel futuristic layout
✅ Medical history (left panel)
✅ Consultation form (center)
✅ Ongoing consultations (right panel)
✅ Ethiopian MOH lab tests dropdown
✅ Workflow status management
✅ Real-time polling for lab results

### API (Backend)
✅ 10+ new endpoints
✅ Workflow state machine
✅ 60+ Ethiopian MOH lab tests
✅ Medical history aggregation
✅ Draft saving
✅ Lab request management

---

## 🎯 Key Endpoints

```javascript
// Workflow
GET  /api/consultations/ongoing?doctorId=xxx
POST /api/consultations/save-draft
POST /api/consultations/send-lab-request
POST /api/consultations/finish

// Data
GET  /api/appointments/:id/consultation-or-create
GET  /api/patients/:id/medical-history
GET  /api/lab/tests
GET  /api/lab-requests/:id/status
```

---

## 🔄 Workflow in 4 Steps

```
1. DRAFT
   ↓ (Send to Lab)
2. WAITING_FOR_LAB_RESULTS
   ↓ (Lab completes)
3. READY_FOR_REVIEW
   ↓ (Finish Consultation)
4. COMPLETED
```

---

## 🎨 UI Layout

```
┌─────────────┬──────────────────────────┬─────────────────┐
│  Medical    │   Consultation Form      │   Ongoing       │
│  History    │                          │   Consults      │
│  (25%)      │   (50%)                  │   (25%)         │
└─────────────┴──────────────────────────┴─────────────────┘
```

---

## 🐛 Quick Troubleshooting

**Problem**: Lab tests not showing
**Fix**: Run the SQL schema file

**Problem**: Three panels not showing
**Fix**: Check you're using `ConsultationFormNew.jsx`

**Problem**: API errors
**Fix**: Verify backend is running on port 4000

**Problem**: Medical history empty
**Fix**: Create some test consultations first

---

## 📚 Full Documentation

- **Complete Guide**: `CONSULTATION_WORKFLOW_COMPLETE.md`
- **UI Details**: `frontend/CONSULTATION_UI_IMPLEMENTATION.md`
- **Database Schema**: `backend/config/consultation_workflow_schema.sql`

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] Database has `ethiopian_moh_lab_tests` table
- [ ] Can see three-panel layout
- [ ] Lab tests dropdown populated
- [ ] Medical history loads
- [ ] Ongoing consultations panel shows

---

**That's it! You're ready to go! 🎉**

For detailed information, see `CONSULTATION_WORKFLOW_COMPLETE.md`
