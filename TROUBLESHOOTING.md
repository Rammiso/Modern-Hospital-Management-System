# Troubleshooting Guide

## Issue 1: "Failed to load doctors. Please refresh the page."

### Root Cause
The doctor routes were using a different authentication middleware (`authMiddleware.protect`) that was incompatible with the rest of the application.

### Solution Applied
Changed `backend/routes/doctorRoutes.js` to use `verifyToken` middleware instead of `authMiddleware.protect`.

### How to Verify Fix
```bash
# Test without auth (should work)
curl http://localhost:4000/api/doctors-test

# Test with auth (requires valid token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/doctors
```

### Expected Response
```json
{
  "status": "success",
  "results": 1,
  "doctors": [
    {
      "doctor_id": "94dac0f2-d5f9-11f0-8615-b05cda54240d",
      "name": "Dr. Sarah Smith",
      "specialization": "Cardiology",
      "phone": "4445556666",
      "email": "doctor@hospital.com"
    }
  ]
}
```

---

## Issue 2: "Failed to load available slots."

### Root Cause
The `available-slots` endpoint was not properly registered in the appointment routes, or was being matched by the `/:id` route first.

### Solution Applied
1. Added `getAvailableSlots` endpoint to `backend/routes/appointment.js`
2. Reordered routes to put specific routes BEFORE parameterized routes
3. Ensured controller method exists in `appointmentController.js`

### Route Order (Important!)
```javascript
// ✅ CORRECT ORDER
router.get("/available-slots", verifyToken, controller.getAvailableSlots);  // Specific route first
router.get("/:id", verifyToken, controller.getAppointment);                 // Parameterized route last

// ❌ WRONG ORDER
router.get("/:id", verifyToken, controller.getAppointment);                 // This would match everything!
router.get("/available-slots", verifyToken, controller.getAvailableSlots);  // Never reached
```

### How to Verify Fix
```bash
# Test available slots endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:4000/api/appointments/available-slots?doctor_id=94dac0f2-d5f9-11f0-8615-b05cda54240d&date=2025-12-15"
```

### Expected Response
```json
{
  "status": "success",
  "results": 16,
  "slots": [
    { "time": "09:00:00" },
    { "time": "09:30:00" },
    { "time": "10:00:00" },
    ...
  ]
}
```

---

## Issue 3: Syntax Error in Consultation Controller

### Error Message
```
SyntaxError: Unexpected identifier 'getOngoingConsultations'
```

### Root Cause
Missing closing brace in the consultation controller class structure.

### Solution Applied
Fixed the class structure in `backend/controllers/consultation.js` to properly close all methods and the class.

### How to Verify Fix
```bash
# Server should start without errors
cd backend
npm start

# Should see:
# 🚀 Server is running on port 4000
# 🌍 Environment: development
# 📡 API available at: http://localhost:4000/api
```

---

## Common Issues & Solutions

### Issue: "No token provided" or "Invalid token"

**Cause:** Frontend not sending authentication token or token expired.

**Solution:**
1. Check if token exists in localStorage: `localStorage.getItem('token')`
2. Login again to get fresh token
3. Verify token is being sent in Authorization header

### Issue: "Database connection failed"

**Cause:** MySQL not running or incorrect credentials in `.env`

**Solution:**
1. Start MySQL service
2. Verify `.env` file has correct credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=clinic_management_system
   ```
3. Test connection: `curl http://localhost:4000/api/health`

### Issue: "Port 4000 already in use"

**Cause:** Another process is using port 4000

**Solution:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=4001
```

### Issue: Frontend can't connect to backend

**Cause:** CORS or incorrect API URL

**Solution:**
1. Verify `frontend/.env` has correct API URL:
   ```
   VITE_API_URL=http://localhost:4000/api
   ```
2. Check backend CORS settings in `server.js`:
   ```javascript
   cors({
     origin: process.env.FRONTEND_URL || "http://localhost:3000",
     credentials: true,
   })
   ```
3. Update FRONTEND_URL in `backend/.env` if needed:
   ```
   FRONTEND_URL=http://localhost:5173
   ```

---

## Testing Checklist

### Backend Health Check
- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] Health endpoint responds: `curl http://localhost:4000/api/health`
- [ ] Doctors test endpoint works: `curl http://localhost:4000/api/doctors-test`

### Authentication
- [ ] Can login: `POST /api/auth/login`
- [ ] Token received in response
- [ ] Token works with protected endpoints

### Appointment Booking
- [ ] Can search patients
- [ ] Can load doctors list
- [ ] Can load available slots
- [ ] Can create appointment

### Consultation Workflow
- [ ] Can access consultation page
- [ ] Can view patient medical history
- [ ] Can add lab tests
- [ ] Can send lab request
- [ ] Can save draft
- [ ] Can complete consultation

---

## Debug Mode

### Enable Detailed Logging

**Backend:**
Add to `backend/server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend:**
Add to `frontend/src/services/api.js`:
```javascript
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    // ... rest of code
  }
);
```

### Check Database Data

```sql
-- Check doctors
SELECT * FROM users u
JOIN roles r ON u.role_id = r.role_id
WHERE r.role_name = 'doctor';

-- Check appointments
SELECT * FROM appointments ORDER BY created_at DESC LIMIT 10;

-- Check consultations
SELECT * FROM consultations ORDER BY created_at DESC LIMIT 10;

-- Check lab tests
SELECT COUNT(*) FROM ethiopian_moh_lab_tests;
```

---

## Getting Help

If issues persist:
1. Check backend terminal for error logs
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure database schema is up to date
5. Try restarting both backend and frontend servers

## Quick Reset

If everything is broken:
```bash
# Stop all processes
# Ctrl+C in backend terminal
# Ctrl+C in frontend terminal

# Reset database (if needed)
cd backend
node setup_database.js

# Restart backend
npm start

# In new terminal, restart frontend
cd frontend
npm run dev
```
