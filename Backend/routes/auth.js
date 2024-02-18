const express = require('express');
const router = express.Router();
const User = require('../models/user');
const session = require('express-session');

const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

const app = express();

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true
}));

// Register route
router.post('/signup', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.setHeader('Content-Type', 'application/json'); 
      res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
      res.setHeader('Content-Type', 'application/json'); 
      res.status(400).json({ message: 'Failed to sign up user' });
    }
  });
  

// Login route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user ) {
      req.session.user = { email };
      return res.status(401).send({ error: 'Invalid login credentials' });
    }
    // Here you can generate and send a JWT token for authentication
    res.status(200).send({ redirectUrl: 'http://localhost:3000/dashboard' });

  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
