🏥 Modern Hospital Management System

A backend system for managing hospital operations such as patient registration, appointments, staff records, and more. Built with Node.js, Express, and MySQL, with validation powered by Joi.

📦 Features

Patient registration and management

Appointment scheduling

Staff and doctor records

Validation with Joi

Unique identifiers with UUID

Logging with Winston

Secure environment configuration with dotenv

🚀 Getting Started

Prerequisites

Node.js v22+

MySQL installed and running

Git

Installation

# Clone the repository
git clone https://github.com/Rammiso/Modern-Hospital-Management-System.git

# Navigate into the project
cd Modern-Hospital-Management-System

# Install dependencies
npm install

Environment Setup

Create a .env file in the root directory:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hospital_db

🖥️ Usage

Development

npm run dev

Production

npm start

The server will start on http://localhost:5000.

📂 Project Structure

Modern-Hospital-Management-System/
│── server.js          # Entry point
│── routes/            # Express routes
│── models/            # Joi validation + DB models
│── middlewares/       # Validation middleware
│── config/            # Database and environment configs
│── package.json
│── README.md

🧪 Example API

Patient Registration

POST /patients/register

Request body:

{
  "full_name": "John Doe",
  "phone": "0912345678",
  "email": "johndoe@example.com",
  "date_of_birth": "1990-05-15",
  "gender": "male",
  "blood_group": "O+"
}

Response:

{
  "message": "Patient registered successfully",
  "data": {
    "patient_id": "uuid-generated-id",
    "full_name": "John Doe",
    "phone": "0912345678"
  }
}

🛠 Dependencies

express – Web framework

mysql2 – MySQL driver

joi – Validation

uuid – Unique IDs

dotenv – Environment variables

winston – Logging

cors – Cross-origin resource sharing

validator – String validation

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

📜 License

This project is licensed under the ISC License.