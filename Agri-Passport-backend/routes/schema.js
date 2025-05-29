const express = require("express");
const router = express.Router();
const apiClient = require("../utils/apiClient");

/**
 * @swagger
 * /schema/create:
 *   post:
 *     summary: Create a new schema
 *     tags: [Schema]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schema_name:
 *                 type: string
 *               schema_version:
 *                 type: string
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Schema created
 */
router.post("/create", async (req, res) => {
  const { schema_name, schema_version, attributes } = req.body;
  try {
    const response = await apiClient.post("/schemas", {
      schema_name,
      schema_version,
      attributes,
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error creating schema:", err.message);
    res.status(500).json({ error: "Failed to create schema" });
  }
});

/**
 * @swagger
 * /schema/get:
 *   get:
 *     summary: Retrieve a schema by ID
 *     tags: [Schema]
 *     parameters:
 *       - in: query
 *         name: schema_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the schema
 *     responses:
 *       200:
 *         description: Schema retrieved
 */
router.get("/get", async (req, res) => {
  const { schema_id } = req.query;
  try {
    const response = await apiClient.get(`/schemas/${schema_id}`);
    res.json(response.data);
  } catch (err) {
    console.error("Error getting schema:", err.message);
    res.status(500).json({ error: "Failed to get schema" });
  }
});

module.exports = router;
