# TeamFlow - Team Task Manager

A full-stack MERN application for managing team tasks with role-based access control.

## 🔗 Live Demo
Frontend: https://harmonious-quietude-production-7c53.up.railway.app
Backend API: https://team-task-manager-production-f38c.up.railway.app

## 🔐 Demo Credentials

Admin Account:
- Email: admin@test.com
- Password: Admin1234

Member Account:
- Email: john@test.com
- Password: Admin1234

## 🚀 Features

- Authentication (Signup/Login/Logout)
- Role-Based Access Control (Admin/Member)
- Task Creation, Assignment & Status Tracking
- Dashboard with Stats & Overdue Highlights
- Board View & List View for Tasks
- Team Management (Add/Edit/Delete Members)
- Priority Levels (High/Medium/Normal/Low)
- Task Stage Tracking (Todo/In Progress/Completed)
- Chart by Priority on Dashboard

## 🛠️ Tech Stack

Frontend:
- React.js (Vite)
- Redux Toolkit
- Tailwind CSS
- React Router DOM
- Recharts

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cookie Parser

## 📁 Project Structure

taskmanager-main/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── redux/
└── server/          # Node.js backend
    ├── controllers/
    ├── middlewares/
    ├── models/
    └── routes/

## 🗄️ Database Schema

User:
- name, email, password (bcrypt)
- role, title, isAdmin, isActive

Task:
- title, date, priority, stage
- team (ref: User)
- activities, subTasks, assets

## 🔌 API Endpoints

AUTH:
POST   /api/user/register     - Register new user
POST   /api/user/login        - Login user
POST   /api/user/logout       - Logout user

USERS:
GET    /api/user/get-team     - Get all team members (Admin)
PUT    /api/user/:id          - Update user profile
DELETE /api/user/:id          - Delete user (Admin)

TASKS:
GET    /api/task              - Get all tasks
POST   /api/task/create       - Create new task (Admin)
PUT    /api/task/update/:id   - Update task (Admin)
DELETE /api/task/delete-restore/:id - Delete task (Admin)
GET    /api/task/dashboard    - Get dashboard stats

## 🔒 Role-Based Access Control

Admin:
- Create, edit, delete tasks
- Manage team members
- View all dashboard stats
- Access all routes

Member:
- View assigned tasks
- Update task status
- View dashboard

## ⚙️ Local Setup

1. Clone the repo:
git clone https://github.com/aadityasaini09/team-task-manager.git

2. Install server dependencies:
cd server && npm install

3. Create server/.env:
MONGODB_URI=your_mongodb_uri
JWT_SECRET=mysecretkey123
PORT=8800
NODE_ENV=development

4. Install client dependencies:
cd client && npm install

5. Create client/.env:
VITE_APP_BASE_URL=http://localhost:8800

6. Run the app:
Terminal 1: cd server && npm start
Terminal 2: cd client && npm run dev

## 🚧 Coming Soon
- Real-time notifications (Socket.io)
- Advanced search functionality
- Task export to CSV
- Audit log for admin actions
- File attachments for tasks

## 👨‍💻 Developer
Aaditya Saini
GitHub: https://github.com/aadityasaini09
