const request = require("supertest");
const express = require("express");
const batchRoutes = require("../../routes/batch");

const app = express();
app.use(express.json());
app.use("/batch", batchRoutes);

// Mock Batch model
jest.mock("../../models/batchModel", () => {
  const mockBatch = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  };

  return mockBatch;
});

// Mock middleware
jest.mock("../../middleware/authMiddleware", () => ({
  protect: (req, res, next) => {
    req.user = { _id: "user123", role: "manufacturer" };
    next();
  },
  authorizeRoles:
    (...roles) =>
    (req, res, next) => {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ message: "Forbidden: Insufficient role" });
      }
    },
}));

const Batch = require("../../models/batchModel");

describe("Batch Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /batch", () => {
    it("should get all batches", async () => {
      const mockBatches = [
        { _id: "batch1", productName: "Wheat", status: "pending" },
        { _id: "batch2", productName: "Rice", status: "approved" },
      ];

      Batch.find.mockResolvedValue(mockBatches);

      const response = await request(app).get("/batch").expect(200);

      expect(response.body).toHaveLength(2);
      expect(Batch.find).toHaveBeenCalledWith({});
    });

    it("should filter batches by status", async () => {
      const mockPendingBatches = [
        { _id: "batch1", productName: "Wheat", status: "pending" },
      ];

      Batch.find.mockResolvedValue(mockPendingBatches);

      const response = await request(app)
        .get("/batch?status=pending")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(Batch.find).toHaveBeenCalledWith({ status: "pending" });
    });
  });

  describe("GET /batch/user", () => {
    it("should get user batches", async () => {
      const mockUserBatches = [
        { _id: "batch1", manufacturerId: "user123", productName: "Wheat" },
      ];

      Batch.find.mockResolvedValue(mockUserBatches);

      const response = await request(app)
        .get("/batch/user")
        .set("Authorization", "Bearer test-token")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(Batch.find).toHaveBeenCalledWith({ manufacturerId: "user123" });
    });
  });
});
