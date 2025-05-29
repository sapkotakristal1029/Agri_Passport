const Batch = require('../models/batchModel');

exports.createBatch = async (req, res) => {
  try {
    const {
      productName,
      batchNumber,
      productionDate,
      expiryDate,
      description,
      ingredients,
      manufacturerId,
      sources,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const newBatch = await Batch.create({
      manufacturerId,
      credentialExId: null, 
      productName,
      batchNumber,
      productionDate,
      expiryDate,
      description,
      ingredients: JSON.parse(ingredients),
      sources: JSON.parse(sources),
      sampleImage: image,
    });

    res.status(201).json(newBatch);
  } catch (err) {
    res.status(500).json({ message: 'Batch creation failed', error: err.message });
  }
};

// GET /?status=pending
exports.getBatches = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    // Add status to filter if provided
    if (status) {
      filter.status = status;
    }

    const batches = await Batch.find(filter);
    res.json(batches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch batches.' });
  }
};


exports.getBatchById = async (req, res) => {
  const batch = await Batch.findById(req.params.id);
  if (!batch) return res.status(404).json({ message: 'Batch not found' });
  res.json(batch);
};

exports.updateBatch = async (req, res) => {
  const updated = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Batch not found' });
  res.json(updated);
};

exports.deleteBatch = async (req, res) => {
  const deleted = await Batch.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Batch not found' });
  res.json({ message: 'Batch deleted successfully' });
};
