# MediBook — Hospital Appointment Booking & Clinical Management Portal

A full-stack medical appointment booking and clinical coordination portal built with **React (Vite + Tailwind CSS)**, **Node.js (Express)**, and **MongoDB (Mongoose)** with authentic role-based access for **Patients** and **Doctors / Administrators**, real-time data synchronization, and a public Hospital Landing Page.

---

## 🌟 Key Features

### 1. Hospital Public Landing Page
- **Hero & Emergency Hub**: 24/7 emergency care hotline, direct booking call-to-actions, and live status badges.
- **About Our Hospital**: Hospital heritage, clinical philosophy, accredited medical experts, and zero-waiting scheduling.
- **Medical Departments**: Cardiology, Pediatrics, General Medicine (OPD), and Orthopedics.
- **Verified Doctors Directory**: Live cards displaying active doctors, their department, specialty, and a direct "Book Consultation" trigger.
- **Contact & Visiting Hours**: Hospital location, outpatient timings, emergency room desk, and direct telephone lines.

### 2. Authentic Role-Based Access Control
- **Public Patient Registration**: Patients register with their legal name, email, password, and phone number.
- **Strict Doctor Onboarding**: Normal users cannot self-register as doctors. Doctors and clinical staff are onboarded exclusively by authenticated hospital administration through the **Doctor & Staff Portal**.
- **No Dummy Data**: Clean real-time database with zero fake appointments or mock users.
- **No Role Switcher**: Unrealistic role-switching buttons in the navigation bar have been removed; patients remain securely in the patient portal, and medical staff in the doctor portal.
- **Clear Credential Feedback**:
  - Unregistered email: *"No account exists with this email address. Please create a new account or verify your email."*
  - Incorrect password: *"Incorrect password. Please verify your credentials and try again."*

### 3. Real-Time Patient Portal
- **Appointment Booking Form**:
  - Patient Name, 10-digit Mobile Number, Doctor Selection, Date (validated against past dates), and Time Slots.
  - **AI Visit Summary ⭐**: Analyzes entered symptoms to generate an intake clinical brief and triage recommendation.
- **My Bookings Table**: Real-time list of all booked consultations with statuses (`Pending`, `Completed`, `Cancelled`) and cancellation action.
- **Schedule Calendar**: Interactive monthly view showing booked consultation days and times.
- **Live Sync**: Automatically checks and reflects status updates made by doctors without requiring page reloads.

### 4. Real-Time Doctor & Clinical Administrator Portal
- **Live Patient Queue**: Real-time list of incoming appointments booked by patients across hospital departments.
- **Instant Actions**:
  - **Mark as Completed**: Mark finished patient visits.
  - **Cancel Appointment**: Cancel consultations with immediate status propagation.
- **Staff Onboarding**: Add verified doctors to the hospital directory with their name, specialty, department, and credentials.
- **Clinic Metrics**: Real-time counters for Total Bookings, Pending Consultations, Completed Visits, and Cancelled appointments.

---

## 🛠️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | **React 18 (Vite)** + **Tailwind CSS** | Responsive healthcare interface with mobile adaptability and glassmorphic styling |
| **Icons & UI** | **Lucide Icons** | Clean clinical iconography |
| **Backend** | **Node.js (Express)** | REST API with JWT security and role verification middleware |
| **Database** | **MongoDB (Mongoose)** | Permanent document storage with auto-resilient persistent disk fallback |
| **Authentication** | **JWT** + **Bcrypt.js** | Salted password hashing and token-based sessions |
| **Real-Time** | **Auto-Polling Engine** | Live synchronization between patient submissions and doctor queues |

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

1. **Start the Backend Server (Port 5050)**:
   ```bash
   cd server
   npm start
   ```

2. **Start the Frontend Client (Port 3000)**:
   ```bash
   cd client
   npm run dev
   ```

Open your browser at **`http://localhost:3000`**.

---

## 🔑 Initial Hospital Administrator Credentials

To onboard new doctors and manage clinic appointments, log in via the **Doctor / Staff Portal**:

- **Email**: `admin@hospital.com`
- **Password**: `Admin@123`
- **Role**: Chief Medical Officer & Hospital Administrator

*(Patients can register their own accounts directly through the **Patient Sign In / Register** portal).*

---

## 📡 API Endpoints Reference

### Authentication & Staff (`/api/auth`)
- `POST /api/auth/register` — Register a new patient account.
- `POST /api/auth/login` — Authenticate patient or doctor with verified feedback.
- `POST /api/auth/add-doctor` — Admin-only: Onboard a verified doctor into hospital staff.
- `GET /api/auth/me` — Retrieve active user session.
- `GET /api/auth/doctors` — Public directory of doctors on duty.

### Appointments (`/api/appointments`)
- `POST /api/appointments` — Book a consultation (patient name, mobile, doctor, date, time).
- `GET /api/appointments` — Fetch appointments (scoped by role with search & status filters).
- `PATCH /api/appointments/:id/status` — Update consultation status to `Completed` or `Cancelled`.
- `DELETE /api/appointments/:id` — Delete an appointment record.

### AI Intake Assistant (`/api/ai`)
- `POST /api/ai/summarize` — Generate concise clinical brief from patient symptoms.
