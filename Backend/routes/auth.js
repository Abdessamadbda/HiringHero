const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Register route
router.post('/signup', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to sign up user' });
    }
  });
  

// Login route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }
    // Here you can generate and send a JWT token for authentication
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
