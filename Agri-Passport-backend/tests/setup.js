process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-key-for-testing";
process.env.AUTH_TOKEN = "test-auth-token";
process.env.PORT = "3001";
process.env.API_URL = "http://localhost:3000";

// Mock external API client
jest.mock("../utils/apiClient", () => ({
  post: jest.fn().mockResolvedValue({
    data: { cred_ex_id: "test-credential-id" },
  }),
  get: jest.fn().mockResolvedValue({
    data: { test: "data" },
  }),
}));

// Mock file upload middleware
jest.mock("../middleware/uploadMiddleware", () => ({
  single: () => (req, res, next) => {
    req.file = { filename: "test-image.jpg" };
    next();
  },
}));

// Mock database connection
jest.mock("../db/connection", () => jest.fn());

// Global test cleanup
afterEach(() => {
  jest.clearAllMocks();
});
