# Modern Hospital Management System - Backend

Backend API for the Modern Hospital Management System built with Node.js, Express, and MySQL.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

   - Copy `.env.example` to `.env` (or create `.env`)
   - Update the following variables:
     - `DB_HOST` - MySQL host (default: localhost)
     - `DB_USER` - MySQL username (default: root)
     - `DB_PASS` - MySQL password
     - `DB_NAME` - Database name (default: clinic_management_system)
     - `JWT_SECRET` - Secret key for JWT tokens

3. Start the server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:4000` by default.

## 📁 Project Structure

```
backend/
├── config/          # Configuration files
│   ├── db.js       # Database connection
│   └── schema.sql  # Database schema
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/         # Data models
├── routes/         # API routes
├── utils/          # Utility functions
├── server.js       # Entry point
├── .env            # Environment variables
└── package.json    # Dependencies
```

## 🔧 Environment Variables

| Variable         | Description           | Default                  |
| ---------------- | --------------------- | ------------------------ |
| `PORT`           | Server port           | 4000                     |
| `NODE_ENV`       | Environment mode      | development              |
| `DB_HOST`        | MySQL host            | localhost                |
| `DB_USER`        | MySQL username        | root                     |
| `DB_PASS`        | MySQL password        | -                        |
| `DB_NAME`        | Database name         | clinic_management_system |
| `DB_PORT`        | MySQL port            | 3306                     |
| `JWT_SECRET`     | JWT secret key        | -                        |
| `JWT_EXPIRES_IN` | JWT expiration time   | 7d                       |
| `FRONTEND_URL`   | Frontend URL for CORS | http://localhost:3000    |

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Patients

- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search?q=term` - Search patients

### Appointments

- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment

## 🛡️ Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## 📝 Database

The database is automatically initialized on first run using `config/schema.sql`. The schema includes tables for:

- Users (staff, doctors, admins)
- Patients
- Appointments
- Medical records
- Prescriptions
- Billing
- And more...

## 🔍 Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL client
- **cors** - CORS middleware
- **dotenv** - Environment variable management
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **nodemon** (dev) - Auto-reload during development

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC
