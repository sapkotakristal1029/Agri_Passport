const express = require("express");
const router = express.Router();
const apiClient = require("../utils/apiClient");

/**
 * @swagger
 * /status/ready:
 *   get:
 *     summary: Check server readiness
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Server is ready
 */
router.get("/ready", async (req, res) => {
  try {
    const response = await apiClient.get("/status/ready");
    res.json(response.data);
  } catch (err) {
    console.error("Error checking status:", err.message);
    res.status(500).json({ error: "Failed to check status" });
  }
});

module.exports = router;
