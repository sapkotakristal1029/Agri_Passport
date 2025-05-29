const express = require("express");
const router = express.Router();
const User = require('../models/userModel');
const apiClient = require("../utils/apiClient");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /connection/create-invitation:
 *   post:
 *     summary: Create a connection invitation
 *     tags: [Connection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *               auto_accept:
 *                 type: boolean
 *               public:
 *                 type: boolean
 *               multi_use:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Invitation created
 */
router.post("/create-invitation", protect, async (req, res) => {
  const { alias, auto_accept, public, multi_use } = req.body;
  const user_id = req.user._id;
  try {

    const userData = await User.findById(user_id);

    const response = await apiClient.post(
      `/connections/create-invitation?alias=${alias}&multi_use=false`,
      {
      }
    );

    if (response.data) {
      // Update the user's connection_id in the database
      userData.connection_id = response.data.connection_id;
      await userData.save();
    }

    res.json(response.data);
  } catch (err) {
    console.error("Error creating invitation:", err);
    res.status(500).json({ error: "Failed to create invitation" });
  }
});


/**
 * @swagger
 * /connection/{id}:
 *   post:
 *     summary: get connection detail by connection id
 *     tags: [Connection]
 *     parameters:
 *      - name: id
 *     responses:
 *       200:
 *         description: Invitation created
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await apiClient.get(`/connections/${id}`);
    res.json(response.data);
  } catch (err) {
    console.error("Error getting connection:", err);
    res.status(500).json({ error: "Failed to get connection" });
  }
})

/**
 * @swagger
 * /connection/{id}/invitation:
 *   post:
 *     summary: get connection invitaion by connection id
 *     tags: [Connection]
 *     parameters:
 *      - name: id
 *     responses:
 *       200:
 *         description: Invitation created
 */
router.get("/:id/invitation", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await apiClient.get(`/connections/${id}/invitation`);
    res.json(response.data);
  } catch (err) {
    console.error("Error getting connection:", err.message);
    res.status(500).json({ error: "Failed to get connection" });
  }
})

/**
 * @swagger
 * /connection/query-connections:
 *   get:
 *     summary: Query active connections
 *     tags: [Connection]
 *     responses:
 *       200:
 *         description: List of active connections
 */
router.get("/query-connections", async (req, res) => {
  try {
    const response = await apiClient.get("/connections");
    res.json(response.data);
  } catch (err) {
    console.error("Error querying connections:", err.message);
    res.status(500).json({ error: "Failed to query connections" });
  }
});

module.exports = router;
