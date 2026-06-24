/*
  NEW FILE: backend/routes/room.js

  This keeps room/points logic separate from auth.js, which is cleaner
  and avoids touching a file you've already marked as "done".

  Wire it up in server.js with:
    const roomRoutes = require('./routes/room');
    app.use('/api/room', roomRoutes);
*/

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// GET /api/room  — returns current user's points + owned room items
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('points room');
    res.status(200).json({
      points: user.points || 0,
      room: user.room || { items: [] },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/room/buy  — purchase a furniture item with points
router.post('/buy', protect, async (req, res) => {
  try {
    const { itemId, cost } = req.body;

    if (!itemId || typeof cost !== 'number') {
      return res.status(400).json({ message: 'itemId and cost are required' });
    }

    const user = await User.findById(req.user.id);

    if (user.points < cost) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    const currentItems = user.room?.items || [];
    if (currentItems.includes(itemId)) {
      return res.status(400).json({ message: 'Item already owned' });
    }

    user.points -= cost;
    user.room = { items: [...currentItems, itemId] };
    await user.save();

    res.status(200).json({ points: user.points, room: user.room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/room/add-points  — used by the Pomodoro timer to award bonus points
router.post('/add-points', protect, async (req, res) => {
  try {
    const { points } = req.body;

    if (typeof points !== 'number' || points <= 0) {
      return res.status(400).json({ message: 'points must be a positive number' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { points } },
      { new: true }
    );

    res.status(200).json({ points: user.points });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;