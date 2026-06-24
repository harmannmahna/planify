const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. JSON parser FIRST
app.use(express.json());

// 2. CORS ONCE (GLOBAL)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://planify1.onrender.com'
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


// 4. ROUTES AFTER CORS (VERY IMPORTANT)
app.use('/api/room', require('./routes/room'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// 5. Test route
app.get('/', (req, res) => {
  res.send('Planify API running');
});

// 6. DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('DB Error:', err));

// 7. Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));