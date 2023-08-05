const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /api/user/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = await User.create({ username, password, email });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to register user' });
  }
});

// POST /api/user/login - Log in user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log in user' });
  }
});

// GET /api/user/:id - Get user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// DELETE /api/user/:id - Delete user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: `User with ID ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
