# MediBook — Mini Appointment Booking Application

A full-stack healthcare appointment booking application built with **React (Vite + Tailwind CSS)**, **Node.js (Express)**, and **MongoDB (Mongoose)** with role-based access for **Patients** and **Doctors / Administrators**.

---

## 🌟 Features Overview

### 1. Appointment Form (Patient Portal)
- **Patient Name**: Full validation (minimum 2 characters).
- **Mobile Number**: 10-digit telephone formatting & validation.
- **Doctor Name**: Dynamic doctor selection populated directly from the medical database.
- **Appointment Date**: Native date selection with validation ensuring dates cannot be in the past.
- **Appointment Time**: Convenient time-slot selector (`09:00 AM`, `10:30 AM`, `02:00 PM`, etc.).
- **Submit Button**: Instant feedback with loading indicators, field validation errors, and confirmation toast notifications.
- **Optional Bonus ⭐ AI Visit Summary**: Automatically generates a concise clinical brief and triage recommendation from the patient's symptoms using integrated AI.

### 2. Appointment List & Table
- Displays all appointment records showing:
  - **Patient Name**
  - **Mobile Number**
  - **Doctor Name**
  - **Date**
  - **Time**
  - **Status** (`Pending`, `Completed`, `Cancelled`)
- **Interactive Search**: Search appointments in real-time by patient name, phone number, or doctor.
- **Status Filter**: Instant filtering by `All`, `Pending`, `Completed`, or `Cancelled`.

### 3. Appointment Actions
- **Mark as Completed**: Doctors / Admins can mark finished consultations with a single click.
- **Cancel Appointment**: Both patients and doctors can cancel appointments.
- **Action Guards**: Safe state updates with instantaneous UI feedback and toast alerts.

### 4. Interactive Schedule Calendar
- Monthly calendar grid highlighting days with scheduled appointments.
- Status badges and appointment previews on each date cell.
- Click any day to inspect all bookings scheduled for that specific date.

### 5. Role-Based Authentication & Navigation
- **Role Selection on Login/Signup**: Choose between **Patient** and **Doctor / Admin**.
- **Patient Dashboard**: Focused on booking appointments, viewing personal schedules, and checking statuses.
- **Doctor / Admin Dashboard**: Focused on reviewing all patient bookings, tracking clinic metrics, and updating consultation statuses.
- **Persistent Data Storage**: All users, doctors, and appointment records are saved to the database and **never disappear** when logging out or refreshing the page.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | **React 18** + **Vite** | Lightning fast SPA with hot module reloading |
| **Styling** | **Tailwind CSS** + **Lucide Icons** | Clean, responsive healthcare design system with mobile adaptability |
| **Backend** | **Node.js** + **Express** | RESTful API with structured controllers, routes, and middleware |
| **Database** | **MongoDB** + **Mongoose** | Schema-driven document storage with fallback persistent store |
| **Auth & Security** | **JWT** + **Bcrypt.js** | Token-based authentication, password hashing, and role guards |
| **AI Feature** | **Generative AI / Clinical Engine** | Intake symptoms summarizer and recommended triage prep |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+ recommended)
- [MongoDB](https://www.mongodb.com/) (Optional: if MongoDB is not running locally, the server automatically uses a built-in persistent disk store so you can evaluate the app immediately with zero setup!)

### Installation

1. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Backend Server**:
   ```bash
   cd server
   npm start
   ```
   > The API server will run on `http://localhost:5001`.

2. **Start the Frontend Client**:
   ```bash
   cd client
   npm run dev
   ```
   > The React app will run on `http://localhost:3000`.

---

## 🔑 Quick Demo Credentials (1-Click Login)

The login screen includes **1-Click Quick Demo Login** buttons for instant reviewer evaluation:

| Role | Email | Password | Pre-seeded Features |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@demo.com` | `password123` | Booking form, calendar view, personal appointment list |
| **Doctor / Admin** | `doctor.sarah@clinic.com` | `password123` | Cardiologist portal, full patient appointment table, complete/cancel actions |
| **Doctor / Admin** | `doctor.marcus@clinic.com` | `password123` | General Physician portal, department schedule |

*(You can also register a new Patient or Doctor account directly through the Sign Up tab).*

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create patient or doctor account.
- `POST /api/auth/login` — Sign in with email and password.
- `GET /api/auth/me` — Retrieve current authenticated session.
- `GET /api/auth/doctors` — List available clinic doctors for appointment booking.

### Appointments (`/api/appointments`)
- `POST /api/appointments` — Book a new appointment (validates name, phone, doctor, date, time).
- `GET /api/appointments` — Fetch appointments (scoped by role with search & status filters).
- `PATCH /api/appointments/:id/status` — Mark appointment as `Completed` or `Cancelled`.
- `DELETE /api/appointments/:id` — Remove an appointment.

### AI Intake Assistant (`/api/ai`)
- `POST /api/ai/summarize` — Generate concise clinical brief from patient's visit reason.

---

## 📁 Project Structure

```
CLP/
├── server/
│   ├── src/
│   │   ├── config/          # Database connection and demo seeder
│   │   ├── controllers/     # Auth, Appointment, and AI controllers
│   │   ├── middleware/      # JWT auth and role verification
│   │   ├── models/          # User and Appointment schemas
│   │   ├── routes/          # Express route definitions
│   │   └── server.js        # Server entry point
│   ├── .env.example         # Environment template
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/             # Frontend HTTP client
│   │   ├── components/      # Form, Table, Calendar, Stats, Navbar, Toast
│   │   ├── context/         # AuthContext (JWT session management)
│   │   ├── pages/           # AuthPage, PatientDashboard, DoctorDashboard
│   │   ├── App.jsx          # App root & role router
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```
