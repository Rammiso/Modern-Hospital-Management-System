# Test Login Instructions

## ✅ Demo Users Created Successfully!

The following demo users have been created in your database:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **Admin** | admin@hospital.com | password123 | AdminDashboard |
| **Doctor** | doctor@hospital.com | password123 | DoctorDashboard |
| **Receptionist** | receptionist@hospital.com | password123 | ReceptionistDashboard |
| **Lab Technician** | lab@hospital.com | password123 | LabDashboard |
| **Pharmacist** | pharmacy@hospital.com | password123 | PharmacyDashboard |
| **Cashier** | cashier@hospital.com | password123 | CashierDashboard |

---

## 🧪 Testing Steps

### 1. Test Lab Technician Login

1. Go to http://localhost:3000
2. Click on the "Lab Tech" quick demo button (or enter manually):
   - **Email:** `lab@hospital.com`
   - **Password:** `password123`
3. Click "Sign In"
4. **Expected Result:** You should see the Lab Dashboard with:
   - Purple/Pink theme
   - Stats: Pending Tests, In Progress, Completed Today, Critical Results
   - Pending lab tests queue
   - Quick actions for lab operations

### 2. Test Pharmacist Login

1. Logout (if logged in)
2. Click on the "Pharmacist" quick demo button (or enter manually):
   - **Email:** `pharmacy@hospital.com`
   - **Password:** `password123`
3. Click "Sign In"
4. **Expected Result:** You should see the Pharmacy Dashboard with:
   - Cyan/Teal theme
   - Stats: Pending Prescriptions, Dispensed Today, Low Stock, Revenue
   - Pending prescriptions queue
   - Quick actions for pharmacy operations

### 3. Test Cashier Login

1. Logout (if logged in)
2. Click on the "Cashier" quick demo button (or enter manually):
   - **Email:** `cashier@hospital.com`
   - **Password:** `password123`
3. Click "Sign In"
4. **Expected Result:** You should see the Cashier Dashboard with:
   - Cyan/Blue theme
   - Stats: Pending Payments, Collected Today, Transactions, Outstanding
   - Pending payments queue
   - Quick actions for billing operations

---

## 🔍 Troubleshooting

### Issue: Still can't login

**Check 1: Backend is running**
```bash
cd backend
npm start
```
The backend should be running on http://localhost:4000

**Check 2: Frontend is running**
```bash
cd frontend
npm start
```
The frontend should be running on http://localhost:3000

**Check 3: Database connection**
- Verify your `.env` file in the backend folder has correct database credentials
- Make sure MySQL is running

**Check 4: Clear browser cache**
- Clear cookies and local storage
- Try in incognito/private mode

### Issue: Login works but shows wrong dashboard

**Solution:** The role mapping has been updated. Make sure you:
1. Refresh the browser (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for errors

### Issue: "Invalid credentials" error

**Solution:** Run the user creation script again:
```bash
node backend/scripts/create_demo_users_fixed.js
```

---

## 📊 What Each Dashboard Shows

### Lab Dashboard (lab@hospital.com)
- **Theme:** Purple/Pink gradient
- **Stats:**
  - Pending Tests: 18
  - In Progress: 12
  - Completed Today: 34
  - Critical Results: 3
- **Main View:** Pending lab tests with patient info, test names, priority levels
- **Quick Actions:** Process Sample, Upload Results, View Requests, Quality Control

### Pharmacy Dashboard (pharmacy@hospital.com)
- **Theme:** Cyan/Teal gradient
- **Stats:**
  - Pending Prescriptions: 15
  - Dispensed Today: 42
  - Low Stock Items: 8
  - Revenue Today: ETB 12,450
- **Main View:** Pending prescriptions with medication lists
- **Quick Actions:** Dispense Medication, View Prescriptions, Manage Inventory, Stock Report

### Cashier Dashboard (cashier@hospital.com)
- **Theme:** Cyan/Blue gradient
- **Stats:**
  - Pending Payments: 12
  - Collected Today: ETB 28,450
  - Transactions: 45
  - Outstanding: ETB 15,200
- **Main View:** Pending payments with invoice details
- **Quick Actions:** Process Payment, View Invoices, Payment Report, Patient Search

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Login redirects to the correct dashboard
- ✅ Dashboard shows role-specific information
- ✅ Theme colors match the role (Purple for Lab, Cyan for Pharmacy/Cashier)
- ✅ Quick action buttons are visible
- ✅ Stats cards display correctly
- ✅ No console errors in browser

---

## 🎯 Quick Demo Access

The login page has quick demo buttons for all roles. Just click on:
- 🔬 **Lab Tech** button → Auto-fills lab@hospital.com
- 💊 **Pharmacist** button → Auto-fills pharmacy@hospital.com
- 💰 **Cashier** button → Auto-fills cashier@hospital.com

Then just click "Sign In" (password is already filled as password123)

---

## 📝 Database Role Mapping

The system maps database roles to dashboards:

| Database Role | Dashboard Component |
|---------------|-------------------|
| Admin | AdminDashboard |
| Doctor | DoctorDashboard |
| Receptionist | ReceptionistDashboard |
| Laboratorist | LabDashboard |
| Pharmacist | PharmacyDashboard |
| Cashier | CashierDashboard |

---

## 🚀 Next Steps After Testing

Once all logins work:
1. ✅ Test navigation between pages
2. ✅ Test quick action buttons
3. ✅ Verify responsive design on mobile
4. ✅ Connect dashboards to real backend APIs
5. ✅ Add real-time data updates

---

**Last Updated:** December 13, 2025
**Status:** ✅ All demo users created and ready for testing
