# 🏥 Modern Hospital Management System

A comprehensive, full-stack Hospital Management System built with the MERN stack (MySQL, Express.js, React, Node.js). Features a modern, futuristic UI with role-based dashboards, real-time updates, and complete healthcare workflow management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![MySQL](https://img.shields.io/badge/mysql-8.0-orange.svg)

## ✨ Features

### 🎯 Core Functionality
- **Patient Management** - Complete patient registration, records, and history
- **Appointment Scheduling** - Book, manage, and track appointments
- **Doctor Consultations** - Digital consultation workflow with vitals, diagnoses, and prescriptions
- **Laboratory Management** - Lab test requests, sample tracking, and result management
- **Pharmacy Management** - Prescription dispensing and inventory control
- **Billing & Payments** - Invoice generation, payment processing, and financial tracking
- **User Authentication** - Secure JWT-based authentication with role-based access control

### 👥 Role-Based Dashboards
Each user role has a customized dashboard with relevant information and actions:

- **Admin Dashboard** - System-wide statistics and comprehensive oversight
- **Doctor Dashboard** - Patient queue, consultations, and clinical workflow
- **Receptionist Dashboard** - Patient registration and appointment management
- **Lab Technician Dashboard** - Test processing and result management
- **Pharmacist Dashboard** - Prescription fulfillment and inventory
- **Cashier Dashboard** - Payment collection and invoice management

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Modern frosted glass effects with backdrop blur
- **Neon Accents** - Vibrant indigo, purple, and cyan color schemes
- **Smooth Animations** - Framer Motion powered transitions and interactions
- **Responsive Layout** - Fully responsive design for desktop, tablet, and mobile
- **Real-time Updates** - Live clock and dynamic data updates
- **Status Indicators** - Color-coded badges for quick status recognition

## 🚀 Tech Stack

### Frontend
- **React 18.2** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt.js** - Password hashing
- **Joi** - Data validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/hospital-management-system.git
cd hospital-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=your_password
# DB_NAME=clinic_management_system
# DB_PORT=3306
# JWT_SECRET=your_jwt_secret
# PORT=4000

# Setup database
node setup_database.js

# Create demo users
node scripts/create_demo_users_fixed.js

# Start backend server
npm start
```

The backend will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

## 🔑 Demo Accounts

After running the demo user creation script, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | password123 |
| Doctor | doctor@hospital.com | password123 |
| Receptionist | receptionist@hospital.com | password123 |
| Lab Technician | lab@hospital.com | password123 |
| Pharmacist | pharmacy@hospital.com | password123 |
| Cashier | cashier@hospital.com | password123 |

## 📁 Project Structure

```
hospital-management-system/
├── backend/
│   ├── config/              # Database and configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── scripts/             # Utility scripts
│   ├── .env                 # Environment variables
│   ├── server.js            # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── common/      # Shared components
│   │   │   ├── appointments/
│   │   │   ├── billing/
│   │   │   ├── consultation/
│   │   │   ├── lab/
│   │   │   ├── patient/
│   │   │   ├── patients/
│   │   │   └── pharmacy/
│   │   ├── context/         # React Context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main App component
│   │   └── index.js         # Entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search` - Search patients

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Consultations
- `GET /api/consultations` - Get consultations
- `POST /api/consultations` - Create consultation
- `PUT /api/consultations/:id` - Update consultation
- `POST /api/consultations/:id/finish` - Finish consultation

### Lab Tests
- `GET /api/lab-tests` - Get lab tests
- `POST /api/lab-tests` - Request lab test
- `PUT /api/lab-tests/:id` - Update test results

### Prescriptions
- `GET /api/prescriptions` - Get prescriptions
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id/dispense` - Dispense medication

### Billing
- `GET /api/billing/invoices` - Get invoices
- `POST /api/billing/invoices` - Create invoice
- `POST /api/billing/payments` - Process payment

## 🎨 UI Screenshots

### Login Page
Modern glassmorphism login with quick demo access buttons

### Admin Dashboard
System-wide statistics, recent activity, and quick actions

### Doctor Dashboard
Patient queue with consultation management

### Lab Dashboard
Pending tests with priority indicators

### Pharmacy Dashboard
Prescription queue with medication lists

### Cashier Dashboard
Payment processing with invoice management

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **Role-Based Access Control** - Granular permissions per role
- **Input Validation** - Joi schema validation
- **SQL Injection Prevention** - Parameterized queries
- **CORS Protection** - Configured CORS policies

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment (Example: Heroku)
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- The open-source community

## 📞 Support

For support, email mushas1248@gmail.com or open an issue in the GitHub repository.

## 🗺️ Roadmap

- [ ] Add real-time notifications with WebSockets
- [ ] Implement appointment reminders via SMS/Email
- [ ] Add medical report generation (PDF)
- [ ] Integrate with external lab systems
- [ ] Add telemedicine video consultation
- [ ] Implement advanced analytics dashboard
- [ ] Add mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export data to Excel/CSV

---

**⭐ If you find this project useful, please consider giving it a star!**
