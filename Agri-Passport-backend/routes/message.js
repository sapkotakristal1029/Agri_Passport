const express = require("express");
const router = express.Router();
const apiClient = require("../utils/apiClient");

/**
 * @swagger
 * /message/send-message:
 *   post:
 *     summary: Send a message to a connection
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               connection_id:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent
 */
router.post("/send-message", async (req, res) => {
  const { connection_id, content } = req.body;
  try {
    const response = await apiClient.post(
      `/connections/${connection_id}/send-message`,
      { content }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error sending message:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

/**
 * @swagger
 * /message/query-messages:
 *   get:
 *     summary: Query messages from a connection
 *     tags: [Message]
 *     parameters:
 *       - in: query
 *         name: connection_id
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         required: false
 *         default: sent
 *     responses:
 *       200:
 *         description: Messages retrieved
 */
router.get("/query-messages", async (req, res) => {
  const { connection_id, state = "sent" } = req.query;
  try {
    const response = await apiClient.get(
      `/basicmessages?connection_id=${connection_id}&state=${state}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error querying messages:", err.message);
    res.status(500).json({ error: "Failed to query messages" });
  }
});

module.exports = router;
