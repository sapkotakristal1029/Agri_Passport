const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require('./routes/auth');
const batchRoutes = require('./routes/batch');
require("dotenv").config();
const cors = require("cors");

const { swaggerUi, specs } = require("./swagger");
const connectDB = require("./db/connection");

const app = express();
const PORT = process.env.PORT || 3000;


connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message for the AATP API
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: A welcome message
 */
app.get("/", (req, res) => {
  res.send("AATP Express.js API is running");
});


app.use('/uploads', express.static('uploads')); // to serve images

// Route imports

/**
 * @swagger
 * tags:
 *   name: Batch
 *   description: Endpoints related to product batches
 */
app.use('/batch', batchRoutes);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
app.use('/auth', authRoutes);

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Health check endpoints
 */
app.use("/status", require("./routes/status"));

/**
 * @swagger
 * tags:
 *   name: Schema
 *   description: Endpoints related to schema operations
 */
app.use("/schema", require("./routes/schema"));

/**
 * @swagger
 * tags:
 *   name: Connection
 *   description: Endpoints related to connection invitations and queries
 */
app.use("/connection", require("./routes/connection"));

/**
 * @swagger
 * tags:
 *   name: Credential
 *   description: Endpoints for creating and managing credentials
 */
app.use("/credential", require("./routes/credential"));

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Endpoints to send or retrieve messages
 */
app.use("/message", require("./routes/message"));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
