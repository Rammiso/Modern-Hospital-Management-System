# Setup Demo Users Guide

## Problem
When trying to log in as Lab Technician, Pharmacist, or Cashier, the system doesn't route to their dashboards because these users don't exist in the database yet.

## Solution
Run the demo user creation script to add all required user accounts to the database.

---

## Quick Setup

### Step 1: Run the Demo User Creation Script

```bash
cd backend
node scripts/create_demo_users.js
```

This script will:
- Create or update 6 demo user accounts
- Hash passwords securely using bcrypt
- Display all users in a table format

### Step 2: Verify Users Were Created

The script will show output like this:

```
✅ Connected to MySQL
✅ Password hashed

📝 Creating/Updating demo users...

✅ Created: System Administrator (admin@hospital.com) - Role: admin
✅ Created: Dr. Sarah Johnson (doctor@hospital.com) - Role: doctor
✅ Created: Front Desk Receptionist (receptionist@hospital.com) - Role: receptionist
✅ Created: Lab Technician (lab@hospital.com) - Role: lab_technician
✅ Created: Hospital Pharmacist (pharmacy@hospital.com) - Role: pharmacist
✅ Created: Billing Cashier (cashier@hospital.com) - Role: cashier

📋 All Users in Database:

┌─────────┬───────────────┬──────────────────────────────┬──────────────────────────┬────────────────┬───────────┐
│ (index) │   username    │          full_name           │          email           │      role      │ is_active │
├─────────┼───────────────┼──────────────────────────────┼──────────────────────────┼────────────────┼───────────┤
│    0    │    'admin'    │  'System Administrator'      │  'admin@hospital.com'    │    'admin'     │     1     │
│    1    │   'doctor'    │   'Dr. Sarah Johnson'        │  'doctor@hospital.com'   │   'doctor'     │     1     │
│    2    │'receptionist' │'Front Desk Receptionist'     │'receptionist@hospital.com'│'receptionist' │     1     │
│    3    │     'lab'     │    'Lab Technician'          │   'lab@hospital.com'     │'lab_technician'│     1     │
│    4    │ 'pharmacist'  │  'Hospital Pharmacist'       │ 'pharmacy@hospital.com'  │ 'pharmacist'   │     1     │
│    5    │   'cashier'   │    'Billing Cashier'         │  'cashier@hospital.com'  │   'cashier'    │     1     │
└─────────┴───────────────┴──────────────────────────────┴──────────────────────────┴────────────────┴───────────┘

✅ Demo users created/updated successfully!
```

---

## Demo User Credentials

All demo accounts use the same password: **password123**

| Role | Email | Username | Dashboard |
|------|-------|----------|-----------|
| **Admin** | admin@hospital.com | admin | AdminDashboard (System-wide stats) |
| **Doctor** | doctor@hospital.com | doctor | DoctorDashboard (Patient queue, consultations) |
| **Receptionist** | receptionist@hospital.com | receptionist | ReceptionistDashboard (Appointments, check-ins) |
| **Lab Technician** | lab@hospital.com | lab | LabDashboard (Lab tests, samples) |
| **Pharmacist** | pharmacy@hospital.com | pharmacist | PharmacyDashboard (Prescriptions, inventory) |
| **Cashier** | cashier@hospital.com | cashier | CashierDashboard (Payments, invoices) |

---

## Testing the Login

### 1. Test Lab Technician Login
```
Email: lab@hospital.com
Password: password123
```
**Expected Result:** Routes to Lab Dashboard with purple/pink theme

### 2. Test Pharmacist Login
```
Email: pharmacy@hospital.com
Password: password123
```
**Expected Result:** Routes to Pharmacy Dashboard with cyan/teal theme

### 3. Test Cashier Login
```
Email: cashier@hospital.com
Password: password123
```
**Expected Result:** Routes to Cashier Dashboard with cyan/blue theme

---

## Dashboard Features by Role

### 🔬 Lab Technician Dashboard
- **Stats:** Pending Tests, In Progress, Completed Today, Critical Results
- **Main View:** Pending lab tests queue with patient info
- **Quick Actions:** Process Sample, Upload Results, View Requests, Quality Control
- **Theme:** Purple/Pink gradient

### 💊 Pharmacist Dashboard
- **Stats:** Pending Prescriptions, Dispensed Today, Low Stock Items, Revenue
- **Main View:** Pending prescriptions with medication lists
- **Quick Actions:** Dispense Medication, View Prescriptions, Manage Inventory, Stock Report
- **Theme:** Cyan/Teal gradient

### 💰 Cashier Dashboard
- **Stats:** Pending Payments, Collected Today, Transactions, Outstanding
- **Main View:** Pending payments with invoice details
- **Quick Actions:** Process Payment, View Invoices, Payment Report, Patient Search
- **Theme:** Cyan/Blue gradient

---

## Troubleshooting

### Issue: Script fails with "Cannot find module 'bcrypt'"
**Solution:**
```bash
cd backend
npm install bcrypt
```

### Issue: Script fails with "Access denied for user"
**Solution:** Check your `.env` file has correct database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=hospital_management
DB_PORT=3306
```

### Issue: Users created but login still doesn't work
**Solution:** 
1. Clear browser cache and cookies
2. Check that the backend server is running
3. Verify the JWT token is being generated correctly
4. Check browser console for errors

### Issue: Dashboard shows but is blank
**Solution:**
1. Check that the user's role matches one of the supported roles
2. Verify the Dashboard.jsx file includes the role mapping
3. Check browser console for component errors

---

## Manual Database Setup (Alternative Method)

If the Node.js script doesn't work, you can manually run the SQL:

```sql
USE hospital_management;

-- Make sure the users table exists
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('admin', 'doctor', 'receptionist', 'lab_technician', 'pharmacist', 'cashier') NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Then run the create_demo_users.js script to insert users with proper password hashing
```

---

## Role Mapping in Code

The Dashboard component maps user roles to specific dashboards:

```javascript
switch (role) {
  case "admin":
    return <AdminDashboard />;
  case "receptionist":
    return <ReceptionistDashboard />;
  case "doctor":
    return <DoctorDashboard />;
  case "lab_technician":
  case "lab":
    return <LabDashboard />;
  case "pharmacist":
  case "pharmacy":
    return <PharmacyDashboard />;
  case "cashier":
  case "billing":
    return <CashierDashboard />;
  default:
    return <AdminDashboard />;
}
```

**Note:** The role names in the database must match these exact strings (case-insensitive).

---

## Files Created/Modified

### New Files:
- `backend/scripts/create_demo_users.js` - Node.js script to create users
- `backend/scripts/create_demo_users.sql` - SQL script (alternative method)
- `frontend/src/pages/CashierDashboard.jsx` - Cashier dashboard component
- `SETUP_DEMO_USERS.md` - This guide

### Modified Files:
- `frontend/src/pages/Dashboard.jsx` - Added cashier role mapping

---

## Next Steps

After setting up demo users:

1. ✅ Test login with each role
2. ✅ Verify correct dashboard is displayed
3. ✅ Check that navigation works
4. ✅ Test quick action buttons
5. ✅ Verify responsive design on mobile

---

## Security Notes

⚠️ **Important:** These are demo accounts for development/testing only!

For production:
- Use strong, unique passwords
- Implement password reset functionality
- Add two-factor authentication
- Use environment-specific credentials
- Implement proper session management
- Add rate limiting for login attempts

---

## Summary

✅ **6 demo user accounts** with different roles
✅ **Secure password hashing** using bcrypt
✅ **Role-based dashboard routing** implemented
✅ **Easy setup** with one command
✅ **All roles now functional:** Admin, Doctor, Receptionist, Lab, Pharmacy, Cashier

Run `node backend/scripts/create_demo_users.js` and you're ready to test all user roles!
