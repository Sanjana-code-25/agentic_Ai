# 🎓 College Complaint Management System (CampusResolve)

A centralized, full-stack web application designed to replace manual grievance handling in educational institutions. Students can lodge complaints regarding campus infrastructure, hostels, Wi-Fi, cleanliness, labs, and transportation, while administrators can triage, assign responsible departments/technicians, track progress through an interactive 6-stage lifecycle, and inspect real-time resolution metrics.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Axios, Tailwind CSS (with Light & Dark theme mode), Lucide React Icons
- **Backend**: Node.js, Express.js (Modular MVC Architecture)
- **Database**: MongoDB with Mongoose ORM (Supports Local MongoDB, Atlas, or Dev In-Memory)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing & Role-Based Access Control (RBAC)
- **File Uploads**: Multer with dual storage (Cloudinary integration + Automatic local disk storage fallback)
- **Theme Support**: Instant 1-click Light & Dark mode toggle with persistent preference

---

## ✨ Core Features

### 👨‍🎓 For Students
- **Account Registration & Login**: Fast JWT-secured authentication.
- **📷 Live Camera Snapshot & File Upload**: Snap an issue picture directly from your phone/laptop webcam or upload an image file.
- **🧠 AI Smart Image Issue Classification**: Automatically analyzes uploaded/snapped photos to detect the problem, predict category, suggest urgency priority, and pre-fill details with 1 click.
- **⏱️ Resolution Time Tracking**: View exact duration taken to resolve complaints (e.g. `Resolved in 2.8 hours`) and SLA verification.
- **⭐ Post-Resolution Feedback & Rating**: Submit 1 to 5 star ratings and review comments after issues are marked `Resolved` or `Closed`.
- **Live Status Tracker**: Visual step-by-step lifecycle timeline from submission to resolution.
- **Personal Dashboard**: Track submitted tickets, filter by status or category, and search tickets instantly.

### 🛡️ For Administrators
- **Executive Metrics Panel**: Real-time KPI cards for Total Complaints, Action Needed, Under Resolution, Resolved & Closed, and Resolution Rate (%).
- **Multi-Filter & Instant Search**: Filter across all campus complaints by status, category, priority, student name, staff, or keyword.
- **Triage & Department Assignment**: Assign tickets to specialized campus divisions (`IT Support Team`, `Network Division`, `Sanitation & Plumbing`, `Electrical Division`, `Estate Maintenance`, `Hostel Warden`, etc.).
- **Resolution & Remarks**: Post progress updates visible to students and record official resolution summaries upon closing tickets.

### 🔄 Complaint Status Lifecycle
$$\text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \text{Assigned} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \longrightarrow \text{Closed}$$

---

## 📁 Project Structure

```plaintext
college-complaint-system/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # StatusBadge, PriorityBadge, Timeline, StatsCard, Navbar, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT state & persistence)
│   │   ├── pages/              # Login, Register
│   │   │   ├── student/        # StudentDashboard, NewComplaint, ComplaintDetail
│   │   │   └── admin/          # AdminDashboard, AdminComplaintDetail
│   │   ├── services/           # Axios API services & interceptors
│   │   ├── App.jsx             # React Router route definitions & RBAC guards
│   │   ├── index.css           # Tailwind & modern glassmorphism styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection handler with auto-fallback
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, GetMe
│   │   ├── complaintController.js  # Student complaint submission & queries
│   │   └── adminController.js      # Admin management & resolution metrics
│   ├── middleware/
│   │   ├── auth.js             # verifyToken, verifyAdmin, verifyStudent
│   │   └── upload.js           # Multer file upload (Cloudinary + local disk)
│   ├── models/
│   │   ├── User.js             # User Schema (bcrypt hashing, roles)
│   │   └── Complaint.js        # Complaint Schema (status, priority, timestamps)
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── complaintRoutes.js  # /api/complaints/*
│   │   └── adminRoutes.js      # /api/admin/*
│   ├── uploads/                # Local file storage folder
│   ├── .env                    # Environment variables
│   ├── .env.example
│   ├── package.json
│   ├── seed.js                 # Demo data seeder
│   └── server.js               # Main Express entry point
├── package.json                # Root orchestration scripts
├── spec.md                     # Project specification
└── README.md                   # Project documentation
```

---

## 🛠️ Step-by-Step Local Setup Guide

Follow these instructions to run the project on your local machine:

### 1. Prerequisites
- **Node.js**: Version 18.x or higher installed ([Download Node.js](https://nodejs.org/))
- **MongoDB**: Local MongoDB community server running on port `27017` **OR** a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

---

### 2. Configure Backend Environment Variables
Navigate to the `server/` directory and ensure your `.env` file is configured:

```bash
cd server
```

The file `server/.env` comes pre-configured for local development:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college-complaint-db
JWT_SECRET=supersecretjwtkey_college_complaint_2026_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary Configuration (Local disk upload fallback is used if left blank)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

### 3. Install Dependencies

You can install dependencies for both the frontend and backend using the root command or individually:

#### Option A: Single Command from Root
```bash
npm run install-all
```

#### Option B: Individually
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 4. Seed Database with Demo Accounts & Complaints

Populate the database with pre-configured Admin and Student accounts as well as realistic sample complaints across all categories:

```bash
cd server
npm run seed
```

---

### 5. Start the Application

Open two terminal windows (one for the backend and one for the frontend):

#### Terminal 1 — Start the Backend Server:
```bash
cd server
npm run dev
```
> Server runs on: `http://localhost:5000`  
> Health check: `http://localhost:5000/api/health`

#### Terminal 2 — Start the Frontend Client:
```bash
cd client
npm run dev
```
> Client runs on: `http://localhost:5173`

---

## 🔑 Demo Credentials

You can use the **1-Click Auto-Fill Demo Buttons** on the `/login` page or log in with these credentials:

| Role | Email | Password | Access / Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@college.edu` | `Admin@123` | Full access to Admin Console, Triage, Statistics, and Assignments |
| **Student** | `student@college.edu` | `Student@123` | Student Dashboard, Complaint Submission, Lifecycle Tracking |
| **Student 2** | `priya@college.edu` | `Student@123` | Student Account (ECE Department) |
| **Student 3** | `rohit@college.edu` | `Student@123` | Student Account (Mechanical Department) |

---

## 📡 API Endpoints Reference Catalog

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new Student or Administrator |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT |
| `POST` | `/api/auth/forgot-password` | Public | Request 6-digit password reset verification code / OTP |
| `POST` | `/api/auth/reset-password` | Public | Verify reset code and update user password |
| `GET` | `/api/auth/me` | Authenticated | Fetch current logged-in user profile |

### 📝 Student Complaints (`/api/complaints`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/complaints/my-complaints` | Student | Fetch all complaints filed by the logged-in student |
| `POST` | `/api/complaints` | Student | File a new complaint (with optional image upload) |
| `POST` | `/api/complaints/classify-image` | Student | AI Image-based issue classification engine |
| `POST` | `/api/complaints/:id/feedback` | Student | Submit 1-5 star rating and review comments on resolved tickets |
| `GET` | `/api/complaints/:id` | Authenticated | View detailed view of a specific complaint |

### 🛠️ Administration & Metrics (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/complaints` | Admin | Fetch all complaints across the institution with query filters (`status`, `category`, `priority`, `search`) |
| `PUT` | `/api/admin/complaints/:id` | Admin | Update status, priority, department assignment, admin comments, and resolution summary |
| `GET` | `/api/admin/stats` | Admin | Aggregate resolution rate, category counts, priority breakdown, and status counts |

---

## 🛡️ Security Best Practices

- **Password Protection**: Passwords are securely hashed with bcrypt salt before saving.
- **Route Authorization**: Express middleware (`verifyToken`, `verifyAdmin`, `verifyStudent`) validates JWT tokens on all protected endpoints.
- **Frontend Route Guards**: React `ProtectedRoute` prevents unauthorized viewing of administrative or student routes.
- **Data Validation & Sanitization**: Strict schema validation ensures only allowed enum values (`status`, `category`, `priority`) are accepted.

---

## 📄 License
This project is licensed under the ISC License.
