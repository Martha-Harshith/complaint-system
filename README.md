# 🗂️ MERN Complaint Registration & Tracking System

A full-stack complaint management system with **SMS & Email notifications** on every complaint event.

---

## ✨ Features

- User Registration & Login (JWT Authentication)
- Submit Complaints with Category & Priority
- Track Complaint Status in real-time
- **SMS notification via Twilio** on complaint registered & status update
- **Email notification via Nodemailer (Gmail)** on complaint registered & status update
- Admin Dashboard with stats, search & filter
- Admin can update status and add comments
- User gets notified automatically on every admin action

---

## 🛠️ Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React.js, React Router, Axios |
| Backend   | Node.js, Express.js |
| Database  | MongoDB + Mongoose  |
| Auth      | JWT (JSON Web Token) + bcryptjs |
| Email     | Nodemailer (Gmail)  |
| SMS       | Twilio              |

---

## 📁 Project Structure

```
complaint-system/
├── backend/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── controllers/complaintController.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Complaint.js
│   ├── routes/authRoutes.js
│   ├── routes/complaintRoutes.js
│   ├── services/notificationService.js
│   ├── .env                   ← fill in your credentials
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/index.html
    └── src/
        ├── api.js
        ├── App.js
        ├── index.js
        ├── index.css
        ├── context/AuthContext.js
        └── pages/
            ├── RegisterPage.js
            ├── LoginPage.js
            ├── DashboardPage.js
            ├── SubmitComplaintPage.js
            ├── MyComplaintsPage.js
            ├── ComplaintDetailPage.js
            └── AdminDashboard.js
```

---

## 🚀 Setup Instructions

### Step 1 — Install Prerequisites
- [Node.js v20 LTS](https://nodejs.org)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (optional GUI)

### Step 2 — Configure Environment Variables

Edit `backend/.env` and fill in your credentials:

```env
MONGO_URI=mongodb://localhost:27017/complaint_db
JWT_SECRET=your_super_secret_key
PORT=5000
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
CLIENT_URL=http://localhost:3000
```

**Gmail App Password:**
Google Account → Security → 2-Step Verification → App Passwords → Generate for "Mail"

**Twilio Credentials:**
Sign up at [twilio.com](https://twilio.com) → Dashboard shows Account SID & Auth Token → Get a free trial number

### Step 3 — Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 4 — Start MongoDB

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 5 — Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

Open your browser at: **http://localhost:3000**

### Step 6 — Create Admin User

1. Register a new account at `/register`
2. Open MongoDB Compass → `complaint_db` → `users`
3. Find your user → Edit `role` field from `"user"` to `"admin"` → Save
4. Log out and log back in

---

## 📡 API Endpoints

| Method | Endpoint                     | Auth         | Description                          |
|--------|------------------------------|--------------|--------------------------------------|
| POST   | /api/auth/register           | Public       | Register new user                    |
| POST   | /api/auth/login              | Public       | Login and receive JWT token          |
| GET    | /api/auth/profile            | User         | Get logged-in user profile           |
| POST   | /api/complaints              | User         | Submit complaint → SMS + Email sent  |
| GET    | /api/complaints/my           | User         | Get my complaints                    |
| GET    | /api/complaints/all          | Admin        | Get all complaints                   |
| GET    | /api/complaints/stats        | Admin        | Get dashboard statistics             |
| GET    | /api/complaints/:id          | User/Admin   | Get complaint by ID                  |
| PUT    | /api/complaints/:id/status   | Admin        | Update status → SMS + Email to user  |
| DELETE | /api/complaints/:id          | Admin        | Delete a complaint                   |

---

## 🔔 Notification Flow

```
User Submits Complaint
       ↓
Backend saves to MongoDB
       ↓
notifyComplaintRegistered() called
       ↓
Email (Nodemailer) + SMS (Twilio) sent to user instantly

Admin Updates Status
       ↓
Backend updates MongoDB
       ↓
notifyStatusUpdate() called
       ↓
Email + SMS sent to complaint owner with new status & admin comment
```

---

## 🐛 Common Issues

| Error | Fix |
|-------|-----|
| MongoDB connection refused | Start MongoDB service |
| Twilio: Invalid phone number | Use E.164 format: `+91XXXXXXXXXX` |
| Gmail auth failed | Use App Password, not your regular password |
| CORS error | Check `CLIENT_URL` in `.env` matches your React URL |
| JWT token invalid | Clear browser localStorage and login again |
