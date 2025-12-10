const express = require('express');
const Session = require('../models/Session');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all sessions for user
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create session
router.post('/', auth, async (req, res) => {
  const { title, description, jobRole, difficulty, duration } = req.body;
  try {
    const session = new Session({
      title,
      description,
      jobRole,
      difficulty,
      duration,
      userId: req.user.id
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update session
router.put('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    Object.assign(session, req.body);
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete session
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;