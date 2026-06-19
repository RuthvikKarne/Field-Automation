# 🌱 Field Automation

A full-stack workforce management platform built with the MERN stack to streamline field operations, task assignment, and real-time progress tracking.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 📖 Overview

Field Automation is a workforce management application designed to help organizations efficiently manage field employees and operational tasks. The platform provides managers with centralized control over task assignments while enabling field workers to receive updates, track progress, and report task completion in real time.

The application features secure authentication, role-based access control, task monitoring, and performance dashboards, making it suitable for organizations managing distributed teams and field operations.

---

## ✨ Features

### 🔐 Authentication & Security
- Secure Login & Registration
- JWT-based Authentication
- Password Encryption using bcrypt
- Protected Routes & APIs
- Role-Based Access Control (RBAC)

### 📋 Task Management
- Create, Assign, and Manage Tasks
- Task Priority Management
- Status Tracking (Pending, In Progress, Completed)
- Due Date Management
- Real-Time Task Updates

### 📊 Dashboard & Analytics
- Task Statistics Overview
- Completed vs Pending Tasks
- Employee Performance Tracking
- Task Filtering & Search
- Operational Insights Dashboard

### 👥 User Management
- Manager Dashboard
- Worker Dashboard
- User Profile Management
- Access Control by Roles

---

## 🏗️ System Architecture

```text
Manager Dashboard
        │
        ▼
React Frontend (Vite)
        │
 REST API (Axios)
        │
        ▼
Node.js + Express Backend
        │
        ▼
MongoDB Database
```

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- dotenv

### Database
- MongoDB
- Mongoose

---

## 📂 Project Structure

```text
Field-Automation/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Field-Automation.git
cd Field-Automation
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm start
```

### Start Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## 🎯 Use Cases

- Field Workforce Management
- Service Operations Tracking
- Maintenance Teams
- Logistics & Delivery Operations
- Construction Site Monitoring
- Sales Team Activity Tracking

---

## 🔑 Key Benefits

- Centralized Task Management
- Improved Team Coordination
- Real-Time Progress Visibility
- Enhanced Accountability
- Secure User Authentication
- Scalable MERN Architecture
- Responsive User Experience

---

## 📈 Future Enhancements

- Real-Time Notifications
- GPS Location Tracking
- Attendance Management
- Mobile Application
- File & Image Uploads
- Reports & Analytics Export
- WebSocket-Based Live Updates
- AI-Based Task Prioritization

---

## 👨‍💻 Author

**Karne Ruthvik**

Full Stack Developer | MERN Stack Developer

GitHub: https://github.com/RuthvikKarne

---

## 📄 License

This project is developed for educational and portfolio purposes.
