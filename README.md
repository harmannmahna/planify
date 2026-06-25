# 📋 Planify — Task Manager + Room Builder

A full-stack productivity web app where you complete tasks, earn points, and spend them to decorate your own pixel art room. Built with the MERN stack.

**Live Demo:** https://planify1.onrender.com

---

## ✨ What Makes It Different

Most task managers just let you check off tasks. Planify turns productivity into a game:
- ✅ Complete a task → earn **+10 points**
- 🍅 Finish a Pomodoro session → earn **+15 points**
- 🏠 Spend points in the **Room Shop** to buy furniture and decorate your pixel room

---

## 🖥️ Screenshots

### 1) Login Page
Pixel art themed login with dark UI and Press Start 2P font.

![Login Page](./screenshots/login_page_planify.png)

### 2) Dashboard
Full task management dashboard with Pomodoro timer, points tracker, and room preview.

![Dashboard](./screenshots/dash_board_planify.png)

### 3) Create Task
Add tasks with title, description, status, and priority.

![Create Task](./screenshots/create_task_planify.png)

### 4) Task Management
View, complete, edit, and delete tasks. Completing a task earns points in real time.

![Tasks](./screenshots/dashboard_task.png)

### 5) Points System
Earn points by completing tasks and finishing Pomodoro sessions.

![Points](./screenshots/get_points.png)

### 6) Pomodoro Timer
Built-in 25/5 minute Pomodoro timer with pixel art styling. Earn +15 pts per session.

![Pomodoro](./screenshots/pomodoro_planify.png)

### 7) My Room
Your personal pixel art room — place furniture you've bought from the shop.

![Room](./screenshots/room_planify.png)

### 8) Shop
Buy furniture and decor items using earned points. Items appear in your room instantly.

![Shop](./screenshots/itemsplanify.png)

---

## 🚀 Features

**Task Management**
- Create, edit, delete tasks
- Set status: Pending / In Progress / Completed
- Set priority: Low / Medium / High
- Filter tasks by status

**Points & Rewards System**
- Earn 10 points per completed task
- Earn 15 points per completed Pomodoro session
- Points persist across sessions via MongoDB

**Pomodoro Timer**
- 25 minute focus sessions
- 5 minute break sessions
- Session counter
- Bonus points on completion

**Pixel Room Builder**
- Personal room with pixel art aesthetic
- Buy furniture from the shop using earned points
- Items placed in room persist across sessions
- 20+ items available: desk, bed, cat, bookshelf, curtains, and more

**Authentication**
- JWT-based login and registration
- bcrypt password hashing
- Protected routes
- Persistent sessions

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

**Deployment**
- Frontend + Backend: Render
- Database: MongoDB Atlas (AWS Mumbai)

---

## ⚙️ Local Setup

**Prerequisites:** Node.js v20+, MongoDB Atlas account

**1. Clone the repo**
```bash
git clone https://github.com/harmannmahna/planify.git
cd planify
```

**2. Backend setup**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Run the backend:
```bash
node server.js
```

**3. Frontend setup**
```bash
cd frontend
npm install
npm run dev
```

**4. Open in browser**
```
http://localhost:5173
```

---

## 📂 Project Structure

```
planify/
│
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with points + room
│   │   └── Task.js          # Task schema
│   ├── routes/
│   │   ├── auth.js          # Register, login, points, room
│   │   ├── tasks.js         # CRUD task routes
│   │   └── room.js          # Room/shop routes
│   ├── middleware/
│   │   └── authMiddleware.js # JWT protect + role check
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   └── Room.jsx
│       ├── components/
│       │   ├── Pomodoro.jsx
│       │   ├── TaskFormModal.jsx
│       │   └── ProtectedRoute.jsx
│       └── features/
│           ├── auth/authSlice.js
│           └── tasks/tasksSlice.js
```

---

## 🔮 Future Improvements

- Mobile responsive layout
- Due dates and task reminders
- Leaderboard — compare points with friends
- More room items and themes
- Dark / light mode toggle
- Social sharing of room screenshots

---

## 👩‍💻 Author

**Harmann Kaur**
- GitHub: [@harmannmahna](https://github.com/harmannmahna)
- LinkedIn: [harmannkaurmahna](https://linkedin.com/in/harmannkaurmahna)

---

## 💡 Inspiration

Built to explore how gamification can make productivity apps more engaging. Combines MERN stack development with a pixel art aesthetic to create something that's actually fun to use every day.
