const request = require("supertest");
const express = require("express");
const User = require("../../../models/userModel");
const {
  registerUser,
  authUser,
  getUserProfile,
} = require("../../../controllers/authController");

const app = express();
app.use(express.json());
app.post("/register", registerUser);
app.post("/login", authUser);

// Mock User model
jest.mock("../../../models/userModel");
jest.mock("../../../utils/generateToken", () =>
  jest.fn(() => "test-jwt-token")
);

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        username: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "manufacturer",
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: "user123",
        username: userData.username,
        email: userData.email,
        role: userData.role,
      });

      const response = await request(app)
        .post("/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("name", userData.username);
      expect(response.body).toHaveProperty("email", userData.email);
      expect(response.body).toHaveProperty("role", userData.role);
      expect(response.body).toHaveProperty("token", "test-jwt-token");
    });

    it("should reject registration with invalid role", async () => {
      const userData = {
        username: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "officer",
      };

      const response = await request(app)
        .post("/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid role specified");
    });

    it("should reject registration if user already exists", async () => {
      const userData = {
        username: "Existing User",
        email: "existing@example.com",
        password: "password123",
        role: "manufacturer",
      };

      User.findOne.mockResolvedValue({ email: userData.email });

      const response = await request(app)
        .post("/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("message", "User already exists");
    });

    it("should only allow manufacturer and consumer roles", async () => {
      const validRoles = ["manufacturer", "consumer"];
      const invalidRoles = ["officer", "admin", "user"];

      for (const role of validRoles) {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({
          _id: "user123",
          username: "Test User",
          email: `test-${role}@example.com`,
          role: role,
        });

        const response = await request(app)
          .post("/register")
          .send({
            username: "Test User",
            email: `test-${role}@example.com`,
            password: "password123",
            role: role,
          });

        expect(response.status).toBe(201);
      }

      for (const role of invalidRoles) {
        const response = await request(app)
          .post("/register")
          .send({
            username: "Test User",
            email: `test-${role}@example.com`,
            password: "password123",
            role: role,
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid role specified");
      }
    });

    it("should handle server errors during registration", async () => {
      const userData = {
        username: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "manufacturer",
      };

      User.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/register")
        .send(userData)
        .expect(500);

      expect(response.body).toHaveProperty("message", "Server error");
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /login", () => {
    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUser = {
        _id: "user123",
        username: "Test User",
        email: loginData.email,
        role: "manufacturer",
        matchPassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty("_id", "user123");
      expect(response.body).toHaveProperty("name", "Test User");
      expect(response.body).toHaveProperty("email", loginData.email);
      expect(response.body).toHaveProperty("role", "manufacturer");
      expect(response.body).toHaveProperty("token", "test-jwt-token");
    });

    it("should reject login with invalid email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      User.findOne.mockResolvedValue(null);
      const response = await request(app)
        .post("/login")
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });

    it("should reject login with invalid password", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const mockUser = {
        _id: "user123",
        username: "Test User",
        email: loginData.email,
        role: "manufacturer",
        matchPassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/login")
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });

    it("should handle server errors during login", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      User.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/login")
        .send(loginData)
        .expect(500);

      expect(response.body).toHaveProperty("message", "Server error");
    });
  });
});
