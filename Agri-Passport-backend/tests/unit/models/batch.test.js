const mongoose = require("mongoose");
const Batch = require("../../../models/batchModel");

describe("Batch Model", () => {
  describe("Batch Schema Validation", () => {
    it("should create a valid batch", () => {
      const batchData = {
        manufacturerId: new mongoose.Types.ObjectId(),
        productName: "Organic Wheat",
        batchNumber: "WHT001",
        productionDate: new Date("2025-01-01"),
        expiryDate: new Date("2025-12-31"),
        description: "Premium organic wheat",
        ingredients: [
          {
            name: "Wheat",
            quantity: 1000,
            unit: "kg",
          },
        ],
        sources: [
          {
            name: "Farm ABC",
            description: "Organic certified farm",
          },
        ],
      };

      const batch = new Batch(batchData);
      const validationError = batch.validateSync();

      expect(validationError).toBeUndefined();
    });

    it("should require manufacturerId", () => {
      const batchData = {
        productName: "Organic Wheat",
        batchNumber: "WHT001",
        productionDate: new Date("2025-01-01"),
        expiryDate: new Date("2025-12-31"),
      };

      const batch = new Batch(batchData);
      const validationError = batch.validateSync();

      expect(validationError.errors.manufacturerId).toBeDefined();
    });

    it("should require productName", () => {
      const batchData = {
        manufacturerId: new mongoose.Types.ObjectId(),
        batchNumber: "WHT001",
        productionDate: new Date("2025-01-01"),
        expiryDate: new Date("2025-12-31"),
      };

      const batch = new Batch(batchData);
      const validationError = batch.validateSync();

      expect(validationError.errors.productName).toBeDefined();
    });

    it("should require batchNumber", () => {
      const batchData = {
        manufacturerId: new mongoose.Types.ObjectId(),
        productName: "Organic Wheat",
        productionDate: new Date("2025-01-01"),
        expiryDate: new Date("2025-12-31"),
      };

      const batch = new Batch(batchData);
      const validationError = batch.validateSync();

      expect(validationError.errors.batchNumber).toBeDefined();
    });

    it("should have default status of pending", () => {
      const batchData = {
        manufacturerId: new mongoose.Types.ObjectId(),
        productName: "Organic Wheat",
        batchNumber: "WHT001",
        productionDate: new Date("2025-01-01"),
        expiryDate: new Date("2025-12-31"),
      };

      const batch = new Batch(batchData);
      expect(batch.status).toBe("pending");
    });

    it("should only accept valid status values", () => {
      const validStatuses = ["approved", "rejected", "pending"];

      validStatuses.forEach((status) => {
        const batchData = {
          manufacturerId: new mongoose.Types.ObjectId(),
          productName: "Organic Wheat",
          batchNumber: "WHT001",
          productionDate: new Date("2025-01-01"),
          expiryDate: new Date("2025-12-31"),
          status: status,
        };

        const batch = new Batch(batchData);
        const validationError = batch.validateSync();

        expect(validationError).toBeUndefined();
      });

      // Test invalid status
      const invalidBatchData = {
        manufacturerId: new mongoose.Types.ObjectId(),
        productName: "Organic Wheat",
        batchNumber: "WHT001",
        productionDate: new Date("2025-01-01"),
        expiryDate: new Date("2025-12-31"),
        status: "invalid-status",
      };

      const invalidBatch = new Batch(invalidBatchData);
      const validationError = invalidBatch.validateSync();

      expect(validationError.errors.status).toBeDefined();
    });

    it("should validate ingredient schema", () => {
      const batchData = {
        manufacturerId: new mongoose.Types.ObjectId(),
        productName: "Organic Wheat",
        batchNumber: "WHT001",
        productionDate: new Date("2025-01-01"),
        expiryDate: new Date("2025-12-31"),
        ingredients: [
          {
            name: "Wheat",
            quantity: 1000,
            unit: "kg",
            credential_id: new mongoose.Types.ObjectId(),
          },
          {
            name: "Salt",
            quantity: 50,
            unit: "g",
          },
        ],
      };

      const batch = new Batch(batchData);
      const validationError = batch.validateSync();

      expect(validationError).toBeUndefined();
      expect(batch.ingredients).toHaveLength(2);
      expect(batch.ingredients[0].name).toBe("Wheat");
      expect(batch.ingredients[1].credential_id).toBeNull();
    });

    it("should have default credentialExId as null", () => {
      const batchData = {
        manufacturerId: new mongoose.Types.ObjectId(),
        productName: "Organic Wheat",
        batchNumber: "WHT001",
        productionDate: new Date("2025-01-01"),
        expiryDate: new Date("2025-12-31"),
      };

      const batch = new Batch(batchData);
      expect(batch.credentialExId).toBeNull();
    });
  });
});
