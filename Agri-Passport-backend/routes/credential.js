const express = require("express");
const router = express.Router();
const apiClient = require("../utils/apiClient");

/**
 * @swagger
 * /credential/get-cred-def:
 *   get:
 *     summary: Get a credential definition by ID
 *     tags: [Credential]
 *     parameters:
 *       - in: query
 *         name: credential_definition_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Credential definition retrieved
 */
router.get("/get-cred-def", async (req, res) => {
  const { credential_definition_id } = req.query;
  try {
    const response = await apiClient.get(
      `/credential-definitions/${credential_definition_id}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error getting credential definition:", err.message);
    res.status(500).json({ error: "Failed to get credential definition" });
  }
});

/**
 * @swagger
 * /credential/create-cred-def:
 *   post:
 *     summary: Create a new credential definition
 *     tags: [Credential]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schema_id:
 *                 type: string
 *               tag:
 *                 type: string
 *               support_revocation:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Credential definition created
 */
router.post("/create-cred-def", async (req, res) => {
  const { schema_id, tag, support_revocation } = req.body;
  try {
    const response = await apiClient.post("/credential-definitions", {
      schema_id,
      tag,
      support_revocation,
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error creating credential definition:", err.message);
    res.status(500).json({ error: "Failed to create credential definition" });
  }
});

/**
 * @swagger
 * /credential/issue-credential:
 *   post:
 *     summary: Issue a credential
 *     tags: [Credential]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential_data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Credential issued
 */
router.post("/issue-credential", async (req, res) => {
  try {
    const response = await apiClient.post(
      "/issue-credential-2.0/send-offer",
      JSON.parse(req.body.credential_data)
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error issuing credential:", err.message);
    res.status(500).json({ error: "Failed to issue credential" });
  }
});

/**
 * @swagger
 * /credential/send-proposal:
 *   post:
 *     summary: Send a credential proposal
 *     tags: [Credential]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Proposal sent
 */
router.post("/send-proposal", async (req, res) => {
  try {
    const response = await apiClient.post(
      "/issue-credential-2.0/send-proposal",
      req.body
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error sending proposal:", err.message);
    res.status(500).json({ error: "Failed to send proposal" });
  }
});

/**
 * @swagger
 * /credential/fetch-credential-records:
 *   get:
 *     summary: Fetch credential records by connection ID
 *     tags: [Credential]
 *     parameters:
 *       - in: query
 *         name: connection_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Credential records retrieved
 */
router.get("/fetch-credential-records", async (req, res) => {
  const { connection_id } = req.query;
  try {
    const response = await apiClient.get(
      `/issue-credential-2.0/records?connection_id=${connection_id}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching credential records:", err.message);
    res.status(500).json({ error: "Failed to fetch credential records" });
  }
});

module.exports = router;
