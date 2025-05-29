const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');

// Register user
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    if (!['manufacturer', 'consumer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Login user
exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.username,
        email: user.email,
        role: user.role, 
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
