const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("../../routes/auth");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);

jest.mock("../../models/userModel", () => {
  const mockUser = {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  };

  // Constructor function
  function User(data) {
    Object.assign(this, data);
    this._id = "user123";
  }

  // Static methods
  User.findOne = mockUser.findOne;
  User.create = mockUser.create;
  User.find = mockUser.find;

  return User;
});

// Mock generateToken
jest.mock("../../utils/generateToken", () => jest.fn(() => "test-jwt-token"));

// Mock middleware
jest.mock("../../middleware/authMiddleware", () => ({
  protect: (req, res, next) => {
    req.user = { _id: "user123", role: "officer" };
    next();
  },
}));

const User = require("../../models/userModel");

describe("Auth Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("should register user through route", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: "user123",
        username: "Test User",
        email: "test@example.com",
        role: "manufacturer",
      });

      const response = await request(app)
        .post("/auth/register")
        .send({
          username: "Test User",
          email: "test@example.com",
          password: "password123",
          role: "manufacturer",
        })
        .expect(201);

      expect(response.body).toHaveProperty("token");
    });

    it("should reject invalid role during registration", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          username: "Test User",
          email: "test@example.com",
          password: "password123",
          role: "officer",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid role specified");
    });
  });

  describe("POST /auth/login", () => {
    it("should login user through route", async () => {
      const mockUser = {
        _id: "user123",
        username: "Test User",
        email: "test@example.com",
        role: "manufacturer",
        matchPassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("name", "Test User");
    });

    it("should reject invalid credentials", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "wrong@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });
  });

  describe("GET /auth/manufacturers", () => {
    it("should get all manufacturers", async () => {
      const mockManufacturers = [
        {
          _id: "manu1",
          username: "Manufacturer 1",
          email: "manu1@example.com",
          role: "manufacturer",
        },
      ];

      User.find.mockResolvedValue(mockManufacturers);

      const response = await request(app)
        .get("/auth/manufacturers")
        .set("Authorization", "Bearer test-token")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(User.find).toHaveBeenCalledWith({ role: "manufacturer" });
    });
  });
});
