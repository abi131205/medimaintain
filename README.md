# 🏥 MediMaintain

MediMaintain is a smart biomedical equipment maintenance and management platform designed to simplify the tracking, servicing, monitoring, and maintenance workflow of medical devices inside hospitals, laboratories, and healthcare institutions.

The project focuses on creating a centralized digital solution where biomedical engineers, technicians, and administrators can efficiently manage equipment records, maintenance schedules, service history, and operational status.

---

# 🌐 Live Deployment

## Frontend (Vercel)

https://medimaintain.vercel.app

## Backend API (Render)

https://medimaintain.onrender.com

---

# 📌 Project Overview

Medical equipment management in many healthcare environments is still handled manually or through scattered systems. This creates issues such as:

* Missed maintenance schedules
* Poor equipment tracking
* Lack of centralized service records
* Increased downtime of devices
* Difficulty in monitoring equipment condition
* Delays in biomedical servicing

MediMaintain solves these problems by providing a modern web-based management system.

---

# 🎯 Objectives

* Develop a centralized biomedical equipment management platform
* Track and maintain medical equipment records digitally
* Monitor maintenance schedules and servicing status
* Reduce manual documentation work
* Improve equipment reliability and availability
* Simplify maintenance workflow for biomedical engineers

---

# ⚙️ Features

## 🔐 Authentication System

* Secure login and registration
* JWT-based authentication
* Protected routes using middleware
* User-based role access control

## 👨‍💼 Admin Features

* Add equipment
* Edit equipment
* Delete equipment
* Monitor equipment dashboard
* Manage biomedical records

## 👨‍🔧 Technician Features

* View equipment details
* Monitor maintenance status
* Track biomedical equipment condition

## 🏥 Equipment Management

* Add new medical equipment
* View all equipment records
* Update equipment details
* Delete equipment information
* Search and organize equipment data

## 🛠 Maintenance Tracking

* Store maintenance history
* Track servicing details
* Monitor equipment condition
* Maintain maintenance logs

## 📊 Dashboard & Monitoring

* Equipment overview dashboard
* Equipment statistics cards
* Status tracking
* Service monitoring
* Maintenance insights

## ☁️ Database Integration

* MongoDB database connectivity
* Real-time data storage and retrieval
* Structured backend management

---

# 🎨 UI Highlights

* Modern glassmorphism login UI
* Gradient-based responsive design
* Interactive dashboard cards
* Color-coded equipment status badges
* Smooth hover animations
* Responsive modern layout

---

# 🧠 Technologies Used

## Frontend

* React.js
* Tailwind CSS
* HTML5
* CSS3
* JavaScript
* Axios

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication & Security

* JWT Authentication
* bcryptjs

## Tools & Platforms

* VS Code
* Git & GitHub
* Thunder Client
* MongoDB Atlas
* Vercel
* Render

---

# 🏗️ System Architecture

```text
Frontend (React + Tailwind CSS)
              ↓
Backend API (Node.js + Express.js)
              ↓
MongoDB Database (MongoDB Atlas)
```

---

# 📂 Project Structure

```text
MediMaintain/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── README.md
└── package.json
```

---

# 🚀 Current Development Progress

## ✅ Completed Features

* Full-stack MERN setup
* Authentication system
* JWT token protection
* MongoDB integration
* Equipment CRUD operations
* Admin & Technician roles
* Dashboard UI
* Search & filtering
* Equipment status management
* Cloud deployment
* Responsive frontend design

## 🔮 Future Improvements

* AI-based predictive maintenance
* Notification system
* Equipment analytics dashboard
* QR code integration
* Report generation system
* Maintenance reminders
* Mobile application support

---

# 💻 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/abi131205/medimaintain.git
```

## 2️⃣ Navigate to the Project Folder

```bash
cd medimaintain
```

---

# 🔧 Backend Setup

## Install Backend Dependencies

```bash
cd backend
npm install
```

## Create `.env` File

Create a `.env` file inside backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# 💻 Frontend Setup

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

# ▶️ Running the Project

## Start Backend

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

## Start Frontend

```bash
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

# 👨‍🏫 How Staff or Faculty Can View the Project

## 🌐 Option 1 — Live Project

Open:

```text
https://medimaintain.vercel.app
```

Login using the provided demo credentials.

---

## 💻 Option 2 — Run Locally

### Requirements

Install:

* Node.js
* MongoDB
* VS Code

### Steps

1. Clone repository
2. Install dependencies
3. Configure `.env`
4. Run backend
5. Run frontend

---

# 🔑 Demo Login Credentials

## 👑 Admin Login

```text
Email: admin@test.com
Password: admin123
```

## 👨‍🔧 Technician Login

```text
Email: abi@test.com
Password: 123456
```

---

# 📸 Screenshots

## Login Page

* Glassmorphism UI
* Gradient background
* Responsive login card

## Dashboard

* Equipment statistics
* Equipment cards
* Search & filtering
* Interactive status badges

## Equipment Management

* Add equipment
* Edit equipment
* Delete equipment
* Equipment status monitoring

---

# 🧪 API Testing

API endpoints tested using:

* Thunder Client
* Browser testing

## Example Routes

```http
GET /api/equipment
POST /api/equipment
PUT /api/equipment/:id
DELETE /api/equipment/:id
POST /api/auth/login
POST /api/auth/register
```

---

# 🔒 Security Features

* JWT Authentication
* Protected API Routes
* Middleware-based authorization
* Secure password hashing using bcryptjs
* Token-based session handling

---

# 📈 Future Scope

* AI-integrated maintenance prediction
* IoT-enabled device monitoring
* Hospital-wide deployment
* Multi-user management system
* Cloud-based equipment analytics
* Mobile application support
* Maintenance scheduling alerts
* PDF report generation

---

# 📚 Academic Purpose

This project was developed as part of biomedical engineering and healthcare technology learning, focusing on:

* Biomedical Equipment Management
* Full Stack Web Development
* Healthcare Digital Systems
* MERN Stack Development

---

# 👨‍💻 Developer

**Abijith U K**  
B.Tech Computer Science & Medical Engineering  
Sri Ramachandra Institute

---

# ⭐ GitHub Repository

https://github.com/abi131205/medimaintain
