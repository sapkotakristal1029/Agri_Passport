const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  credential_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    default: null,
  },
});

const batchSchema = new mongoose.Schema(
  {
    manufacturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    credentialExId: {
      type: String,
      default: null,
    },
    productName: { type: String, required: true },
    batchNumber: { type: String, required: true },
    productionDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    description: { type: String },
    ingredients: [ingredientSchema],
    sources: [
      {
        name: String,
        description: String,
      },
    ],
    sampleImage: { type: String }, // file path or URL
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    status: {
      type: String,
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Batch', batchSchema);
