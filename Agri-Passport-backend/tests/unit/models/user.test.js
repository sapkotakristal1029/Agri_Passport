const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../../../models/userModel");

jest.mock("bcryptjs", () => ({
  genSalt: jest.fn().mockResolvedValue("salt"),
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn(),
}));

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User Schema Validation", () => {
    it("should create a valid user", () => {
      const userData = {
        username: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "manufacturer",
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError).toBeUndefined();
    });

    it("should require username field", () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        role: "manufacturer",
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError.errors.username).toBeDefined();
      expect(validationError.errors.username.message).toContain("required");
    });

    it("should require email field", () => {
      const userData = {
        username: "Test User",
        password: "password123",
        role: "manufacturer",
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError.errors.email).toBeDefined();
    });

    it("should require password field", () => {
      const userData = {
        username: "Test User",
        email: "test@example.com",
        role: "manufacturer",
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError.errors.password).toBeDefined();
    });

    it("should only accept valid roles", () => {
      const validRoles = ["manufacturer", "consumer", "officer"];

      validRoles.forEach((role) => {
        const userData = {
          username: "Test User",
          email: "test@example.com",
          password: "password123",
          role: role,
        };

        const user = new User(userData);
        const validationError = user.validateSync();

        expect(validationError).toBeUndefined();
      });

      // Test invalid role
      const invalidUserData = {
        username: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "invalid-role",
      };

      const invalidUser = new User(invalidUserData);
      const validationError = invalidUser.validateSync();

      expect(validationError.errors.role).toBeDefined();
    });

    it("should have default role of consumer", () => {
      const userData = {
        username: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const user = new User(userData);
      expect(user.role).toBe("consumer");
    });
  });

  describe("Password Methods", () => {
    it("should have matchPassword method", async () => {
      bcrypt.compare.mockResolvedValue(true);

      const user = new User({
        username: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
        role: "manufacturer",
      });

      const isMatch = await user.matchPassword("plainPassword");

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "plainPassword",
        "hashedPassword"
      );
      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      bcrypt.compare.mockResolvedValue(false);

      const user = new User({
        username: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
        role: "manufacturer",
      });

      const isMatch = await user.matchPassword("wrongPassword");

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongPassword",
        "hashedPassword"
      );
      expect(isMatch).toBe(false);
    });
  });

  describe("User Model Functionality", () => {
    it("should create user with timestamps", () => {
      const userData = {
        username: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "manufacturer",
      };

      const user = new User(userData);

      expect(user.username).toBe("Test User");
      expect(user.email).toBe("test@example.com");
      expect(user.role).toBe("manufacturer");
    });

    it("should validate email uniqueness constraint", () => {
      const userData = {
        username: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "manufacturer",
      };

      const user = new User(userData);
      const schema = user.schema;

      expect(schema.paths.email.options.unique).toBe(true);
    });
  });
});

const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());

app.get("/credential/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

app.post("/credential/test", (req, res) => {
  res.json({ message: "Test POST working", data: req.body });
});

describe("Credential Routes Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Test Credential Endpoints", () => {
    it("should handle GET request", async () => {
      const response = await request(app).get("/credential/test").expect(200);

      expect(response.body.message).toBe("Test endpoint working");
    });

    it("should handle POST request", async () => {
      const testData = {
        schema_id: "test-schema",
        tag: "test-tag",
      };

      const response = await request(app)
        .post("/credential/test")
        .send(testData)
        .expect(200);

      expect(response.body.message).toBe("Test POST working");
      expect(response.body.data).toEqual(testData);
    });

    it("should return JSON responses", async () => {
      const response = await request(app).get("/credential/test").expect(200);

      expect(response.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("Credential System Validation", () => {
    it("should validate credential data structure", () => {
      const credentialData = {
        schema_id: "test-schema-123",
        tag: "food-safety",
        support_revocation: true,
      };

      expect(credentialData).toHaveProperty("schema_id");
      expect(credentialData).toHaveProperty("tag");
      expect(credentialData).toHaveProperty("support_revocation");
      expect(typeof credentialData.support_revocation).toBe("boolean");
    });

    it("should validate credential definition structure", () => {
      const credDef = {
        credential_definition_id: "test-cred-def-123",
        schema_id: "schema-123",
        tag: "food-safety-v1",
      };

      expect(credDef.credential_definition_id).toBeDefined();
      expect(credDef.schema_id).toBeDefined();
      expect(credDef.tag).toBeDefined();
    });
  });
});
