# 🧠 Task Management – MERN Task Management App

A full-stack task management application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with a clean, responsive, peach-themed UI. This app supports collaborative task rooms, user productivity metrics, and modern authentication (email/password & Google OAuth).

---

## 🚀 Features

### 🔐 User Authentication
- Email/Password Signup & Login (JWT-based)
- Password reset with secure tokens

### ✅ Task Management
- Create, edit, delete tasks
- Filter by priority, status, and overdue
- Prioritize tasks & update status  dynamically

### 🧑‍🤝‍🧑 Collaborative Task Rooms
- Create & join task rooms with unique IDs
- Shared tasks within rooms

### 📊 User Profiles & Metrics
- View personal productivity streaks and weekly task stats
- Update name and password
- Toggle dark mode

### 📆 Additional Features
- Calendar view of due tasks
- Responsive UI with smooth animations
- Loading skeletons during API calls

---

## 🧱 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React.js (Vite), TailwindCSS        |
| Backend      | Node.js, Express.js                 |
| Database     | MongoDB (Mongoose ODM)              |
| Authentication | JWT, bcrypt        |
| Styling      | #FFDAB9 Peach-themed, Responsive    |


## 📁 Folder Structure

```
task-manager/
├── client/ # React Frontend
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ │ ├── auth/
│ │ │ ├── tasks/
│ │ │ ├── rooms/
│ │ │ └── Profile.jsx
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Landing.jsx
│ │ │ └── TaskRoom.jsx
│ │ ├── contexts/
│ │ ├── hooks/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── tailwind.config.js
│
├── server/ # Express Backend
│ ├── config/
│ ├── controllers/
│ ├── models/
│ │ ├── User.js
│ │ ├── Task.js
│ │ └── Room.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── tasks.js
│ │ └── rooms.js
│ ├── middleware/
│ ├── utils/
│ └── server.js
│
├── .gitignore
└── README.md

```


---

## 📌 API Endpoints

### 🔐 Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/google`
- `POST /api/auth/forgot-password`

### 📋 Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`

### 🧑‍🤝‍🧑 Rooms
- `POST /api/rooms`
- `POST /api/rooms/join`
- `GET /api/rooms`

### 👤 User Profile
- `GET /api/users/me`
- `PATCH /api/users/me`

---

## 🗂 Assumptions

- Users must be authenticated to access task and room features.
- Each room is identified using a unique alphanumeric Room ID.
- Admin (room creator) can delete tasks for the entire room.
- Tasks can be shared across members but only modified by the owner.
- Calendar integration uses `react-calendar`.

---

## 🌐 Live Links

- **Frontend (Render)**:https://taskmanager-3ybk.onrender.com/
- **Backend (Render)**: https://taskmanagement-otgw.onrender.com/

---

## 📸 Architecture Diagram
![architecture](https://github.com/user-attachments/assets/14d612bc-7410-4d49-a70f-c56ffb5fc415)


## 🎥 Demo Video

Watch the full walkthrough here:  

https://github.com/user-attachments/assets/b71c57cd-fca9-4272-9e4b-d053aebcc150



---

## 🏁 Getting Started Locally

1. **Clone the repo**  
```bash
git clone https://github.com/Elango-Mahendran/Task_Management.git
````

2. **Setup server**

```bash
cd server
npm install
npm run dev
```

3. **Setup client**

```bash
cd client
npm install
npm run dev
```

4. **Environment Variables**

* `client/.env`

  ```
  VITE_API_URL=https://your-api-url.com
  GOOGLE_CLIENT_ID=your_google_client_id
  ```

* `server/.env`

  ```
  PORT=5000
  MONGO_URI=your_mongo_connection_string
  JWT_SECRET=your_jwt_secret
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  ```

---

## 🏆 Hackathon Info

**This project is a part of a hackathon run by [https://www.katomaran.com](https://www.katomaran.com)**


