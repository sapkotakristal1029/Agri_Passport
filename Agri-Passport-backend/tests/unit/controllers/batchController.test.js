const request = require("supertest");
const express = require("express");
const Batch = require("../../../models/batchModel");
const {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
} = require("../../../controllers/batchController");

const app = express();
app.use(express.json());
app.post("/batches", createBatch);
app.get("/batches", getBatches);
app.get("/batches/:id", getBatchById);
app.put("/batches/:id", updateBatch);
app.delete("/batches/:id", deleteBatch);

jest.mock("../../../models/batchModel");

describe("Batch Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /batches - createBatch", () => {
    it("should create a new batch successfully", async () => {
      const batchData = {
        productName: "Organic Wheat",
        batchNumber: "WHT001",
        productionDate: "2025-01-01",
        expiryDate: "2025-12-31",
        description: "Premium organic wheat",
        ingredients: JSON.stringify([
          { name: "Wheat", quantity: 1000, unit: "kg" },
        ]),
        sources: JSON.stringify([
          { name: "Farm ABC", description: "Organic certified farm" },
        ]),
        manufacturerId: "manufacturer123",
      };

      const mockCreatedBatch = {
        _id: "batch123",
        ...batchData,
        ingredients: JSON.parse(batchData.ingredients),
        sources: JSON.parse(batchData.sources),
        sampleImage: "test-image.jpg",
        status: "pending",
        credentialExId: null,
      };

      Batch.create.mockResolvedValue(mockCreatedBatch);

      const response = await request(app)
        .post("/batches")
        .send(batchData)
        .expect(201);

      expect(response.body).toHaveProperty("_id", "batch123");
      expect(response.body).toHaveProperty(
        "productName",
        batchData.productName
      );
      expect(response.body).toHaveProperty(
        "batchNumber",
        batchData.batchNumber
      );
      expect(response.body.ingredients).toEqual([
        { name: "Wheat", quantity: 1000, unit: "kg" },
      ]);
    });

    it("should handle batch creation errors", async () => {
      const batchData = {
        productName: "Organic Rice",
        batchNumber: "RICE001",
        productionDate: "2025-01-01",
        expiryDate: "2025-12-31",
        ingredients: "[]",
        sources: "[]",
        manufacturerId: "manufacturer123",
      };

      Batch.create.mockRejectedValue(new Error("Validation failed"));

      const response = await request(app)
        .post("/batches")
        .send(batchData)
        .expect(500);

      expect(response.body).toHaveProperty("message", "Batch creation failed");
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /batches - getBatches", () => {
    it("should get all batches when no status filter", async () => {
      const mockBatches = [
        {
          _id: "batch1",
          productName: "Wheat",
          status: "pending",
        },
        {
          _id: "batch2",
          productName: "Rice",
          status: "approved",
        },
      ];

      Batch.find.mockResolvedValue(mockBatches);

      const response = await request(app).get("/batches").expect(200);

      expect(response.body).toHaveLength(2);
      expect(Batch.find).toHaveBeenCalledWith({});
    });

    it("should filter batches by status", async () => {
      const mockPendingBatches = [
        {
          _id: "batch1",
          productName: "Wheat",
          status: "pending",
        },
      ];

      Batch.find.mockResolvedValue(mockPendingBatches);

      const response = await request(app)
        .get("/batches?status=pending")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe("pending");
      expect(Batch.find).toHaveBeenCalledWith({ status: "pending" });
    });

    it("should handle database errors", async () => {
      Batch.find.mockRejectedValue(new Error("Database connection failed"));

      const response = await request(app).get("/batches").expect(500);

      expect(response.body).toHaveProperty("error", "Failed to fetch batches.");
    });
  });

  describe("GET /batches/:id - getBatchById", () => {
    it("should get batch by valid ID", async () => {
      const mockBatch = {
        _id: "batch123",
        productName: "Organic Wheat",
        batchNumber: "WHT001",
        status: "approved",
      };

      Batch.findById.mockResolvedValue(mockBatch);

      const response = await request(app).get("/batches/batch123").expect(200);

      expect(response.body).toEqual(mockBatch);
      expect(Batch.findById).toHaveBeenCalledWith("batch123");
    });

    it("should return 404 for non-existent batch", async () => {
      Batch.findById.mockResolvedValue(null);

      const response = await request(app)
        .get("/batches/nonexistent")
        .expect(404);

      expect(response.body).toHaveProperty("message", "Batch not found");
    });
  });

  describe("PUT /batches/:id - updateBatch", () => {
    it("should update batch successfully", async () => {
      const updateData = {
        productName: "Updated Wheat",
        description: "Updated description",
      };

      const mockUpdatedBatch = {
        _id: "batch123",
        ...updateData,
        batchNumber: "WHT001",
      };

      Batch.findByIdAndUpdate.mockResolvedValue(mockUpdatedBatch);

      const response = await request(app)
        .put("/batches/batch123")
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedBatch);
      expect(Batch.findByIdAndUpdate).toHaveBeenCalledWith(
        "batch123",
        updateData,
        { new: true }
      );
    });

    it("should return 404 for non-existent batch update", async () => {
      Batch.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put("/batches/nonexistent")
        .send({ productName: "Updated" })
        .expect(404);

      expect(response.body).toHaveProperty("message", "Batch not found");
    });
  });

  describe("DELETE /batches/:id - deleteBatch", () => {
    it("should delete batch successfully", async () => {
      const mockDeletedBatch = {
        _id: "batch123",
        productName: "Wheat",
      };

      Batch.findByIdAndDelete.mockResolvedValue(mockDeletedBatch);

      const response = await request(app)
        .delete("/batches/batch123")
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Batch deleted successfully"
      );
      expect(Batch.findByIdAndDelete).toHaveBeenCalledWith("batch123");
    });

    it("should return 404 for non-existent batch deletion", async () => {
      Batch.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete("/batches/nonexistent")
        .expect(404);

      expect(response.body).toHaveProperty("message", "Batch not found");
    });
  });
});
