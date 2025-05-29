const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch
} = require('../controllers/batchController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const apiClient = require("../utils/apiClient");


/**
 * @swagger
 * tags:
 *   name: Batch
 *   description: Endpoints for managing product batches
 */

/**
 * @swagger
 * /batch:
 *   post:
 *     summary: Create a new product batch
 *     tags: [Batch]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - batchNumber
 *               - productionDate
 *               - expiryDate
 *             properties:
 *               manufacturerId:
 *                 type: string
 *                 description: Manufacturer's user ID
 *               productName:
 *                 type: string
 *                 example: Organic Wheat Flour
 *               batchNumber:
 *                 type: string
 *                 example: wht105
 *               productionDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-05-01
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-01
 *               description:
 *                 type: string
 *                 example: Certified whole grain flour for export.
 *               ingredients:
 *                 type: string
 *                 example: '[{"name":"Wheat","quantity":500,"unit":"g"}]'
 *               sampleImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Batch created successfully
 *       500:
 *         description: Batch creation failed
 */
router.post('/', upload.single('sampleImage'), createBatch);

/**
 * @swagger
 * /batch:
 *   get:
 *     summary: Get all product batches
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: List of batches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Batch'
 */
  router.get('/', getBatches);


  // get user batches
router.get('/user', protect, async (req, res) => {
  try {
    const batches = await require('../models/batchModel').find({ manufacturerId: req.user._id });
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


  // get only approved batches for a manufacturer
router.get('/approved', protect, async (req, res) => {
  try {
    const batches = await require('../models/batchModel').find({
      manufacturerId: req.user._id,
      status: 'approved'
    });
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// share batch with user if status is approved
router.post('/share', protect, async (req, res) => {
  const batchId = req.body.batchId;
  const userId = req.body.userId;

  try {
    const batch = await require('../models/batchModel').findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    if (batch.status !== 'approved') {
      return res.status(403).json({ message: 'Batch must be approved to share' });
    }

    if (!batch.sharedWith.includes(userId)) {
      batch.sharedWith.push(userId);
      await batch.save();
    }

    res.status(200).json({ message: 'Batch shared successfully', batch });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// get all batches shared with specific user
router.get('/shared', protect, async (req, res) => {
  try {
    const batches = await require('../models/batchModel').find({ sharedWith: req.user._id });
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// get total number of batches, number of approved batches, pending batches and number of rejected batches
router.get('/stats', protect, authorizeRoles('officer'), async (req, res) => {
  try {
    const batchModel = require('../models/batchModel');
    const totalBatches = await batchModel.countDocuments();
    const approvedBatches = await batchModel.countDocuments({ status: 'approved' });
    const pendingBatches = await batchModel.countDocuments({ status: 'pending' });
    const rejectedBatches = await batchModel.countDocuments({ status: 'rejected' });

    res.status(200).json({
      totalBatches,
      approvedBatches,
      pendingBatches,
      rejectedBatches
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /batch/{id}:
 *   get:
 *     summary: Get a single batch by ID
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 *       404:
 *         description: Batch not found
 */
router.get('/:id', getBatchById);


// get batch detail with all the details for ingredentails credential details too
router.get('/:id/qr-details', protect, async (req, res) => {
  try {
    const batch = await require('../models/batchModel').findById(req.params.id).populate('ingredients.credential_id');
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /batch/{id}:
 *   put:
 *     summary: Update a batch by ID
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               description:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Batch updated
 *       404:
 *         description: Batch not found
 */
router.put('/:id', updateBatch);

/**
 * @swagger
 * /batch/{id}:
 *   delete:
 *     summary: Delete a batch by ID
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch deleted
 *       404:
 *         description: Batch not found
 */
router.delete('/:id', deleteBatch);


/**
 * @swagger
 * /batch/{id}/status:
 *   patch:
 *     summary: Approve or reject a batch (officer only)
 *     tags: [Batch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 example: approved
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Batch not found
 */
router.patch(
  '/:id/status',
  protect,
  authorizeRoles('officer'),
  async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const batch = await require('../models/batchModel').findById(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    console.log("Batch to update:", batch);
    const manufacturerId = batch.manufacturerId;


    let credentialExId = null

    if(status === 'approved'){
      // get manufacturer's connection_id
      const manufacturer = await require('../models/userModel').findById(manufacturerId);
      console.log("Manufacturer:", manufacturer);
      if (!manufacturer || !manufacturer.connection_id) {
        return res.status(404).json({ message: 'Manufacturer not found or no connection_id' });
      }

      const temCred = {
        auto_issue: true,
        auto_remove: false,
        connection_id: manufacturer.connection_id,
        credential_preview: {
            "@type": "issue-credential/2.0/credential-preview",
            attributes: [
                {
                    name: "valid",
                    value: "true"
                },
                {
                  name: "batch_id",
                  value: batch._id.toString()
                },
                {
                    name: "mfd",
                    value: batch.productionDate
                },
                {
                    name: "exp",
                    value: batch.expiryDate
                },
                {
                  name: "manufacturer",
                  value: manufacturer.username || "Unknown Manufacturer"
                },
                {
                  name: "ingredients",
                  value: batch.ingredients.map(ing => `${ing.name} (${ing.quantity}${ing.unit})`).join(', ')
                },
                {
                  name: "sources",
                  value: batch.sources.map(src => `${src.name} - ${src.description}`).join(', ')
                }
            ]
        },
        filter: {
            indy: {
                cred_def_id: "GXcTazAzAsrthv5r2pALrT:3:CL:2818514:food safety 2.0"
            }
        },
        trace: false
      }

      try {
        const response = await apiClient.post(
          "/issue-credential-2.0/send-offer",
          temCred
        );
        credentialExId = response.data.cred_ex_id;
      } catch (err) {
        console.error("Error issuing credential:", err.message);
        res.status(500).json({ error: "Failed to issue credential" });
      }
    }

    try {
      batch.status = status;
      batch.credentialExId = credentialExId; // Update credentialExId if approved
      await batch.save();

      res.status(200).json({ message: `Batch ${status}`, batch });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);


module.exports = router;
