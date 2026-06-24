const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// CREATE TASK (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;
    const task = await Task.create({
      title, description, status, priority,
      assignedTo, createdBy: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL TASKS
router.get('/', protect, async (req, res) => {
  try {
    const tasks = req.user.role === 'admin'
      ? await Task.find().populate('assignedTo', 'name email')
      : await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE TASK
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE TASK (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;