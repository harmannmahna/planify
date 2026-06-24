# Planify

A React frontend wired to your existing Express/MongoDB backend (auth + tasks).


## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

This runs on `http://localhost:5173` by default. Make sure your backend (port 5000) is running alongside it.

If your backend's CORS isn't already configured, add this in your `server.js`:

```js
const cors = require('cors');
app.use(cors());
```

## Folder structure

```
src/
  api/axios.js          # Axios instance, attaches JWT from localStorage to every request
  app/store.js           # Redux Toolkit store
  features/
    auth/authSlice.js     # login, register, logout thunks
    tasks/tasksSlice.js    # fetch, create, update, delete thunks
  components/
    Navbar.jsx
    ProtectedRoute.jsx     # redirects to /login if no token
    TaskCard.jsx
    TaskFormModal.jsx      # create/edit form, admin only
  pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx          # task list, filters, admin create/edit/delete
```

## Expected backend response shapes

These pages assume your `auth.js` routes return JSON shaped like:

```json
// POST /api/auth/login or /api/auth/register
{
  "token": "jwt-here",
  "user": { "_id": "...", "name": "...", "email": "...", "role": "user" }
}
```

If your `auth.js` actually returns the user fields flattened at the top level (no nested `user` object, e.g. `{ token, _id, name, email, role }`), the slices already handle that too — but double check your actual auth.js response and adjust `authSlice.js` if the shape differs. Since I haven't seen your `auth.js` content, this is the one spot worth verifying against your real code.

## Role-based behavior

- **Admin**: sees all tasks, can create/edit/delete, can change status
- **User**: sees only tasks assigned to them, can change status only

This matches the `protect` / `adminOnly` middleware split already in your `tasks.js` route.
