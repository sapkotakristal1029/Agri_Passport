// utils/apiClient.js
const axios = require("axios");
require("dotenv").config();

const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

module.exports = apiClient;
