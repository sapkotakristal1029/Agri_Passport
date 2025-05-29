const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require("../models/userModel")

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *               role:
 *                 type: string
 *                 enum: [manufacturer, consumer, officer]
 *                 example: manufacturer
 *               rules:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["add_product", "view_orders"]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60f6c0e3f4d3a200154f3541
 *                 username:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *                 role:
 *                   type: string
 *                   example: manufacturer
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', authUser);


/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 rules:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - No token or invalid token
 *       404:
 *         description: User not found
 */
router.get('/profile', protect, getUserProfile);


// get all user with role manufacturer
router.get('/manufacturers', protect, async (req, res) => {
  try {
    const manufacturers = await User.find({ role: 'manufacturer' });
    res.json(manufacturers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch manufacturers.' });
  }
});

module.exports = router;
