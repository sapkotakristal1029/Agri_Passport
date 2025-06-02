# 🌾 Agri-Food Product Passport Demonstrator

A blockchain-based prototype to support **agricultural traceability** in Australia. This application uses **Decentralized Identity (DID)** and **Verifiable Credentials (VC)** to issue and verify digital product passports across the agri-food supply chain.

---

## 🚀 Project Overview

This project demonstrates the use of **SSI (Self-Sovereign Identity)** principles to issue and share verified product data for enhanced transparency, compliance, and consumer trust.

Key features:

- Verifiable Credentials for batches, ingredients, and products
- DID-based authentication and secure communication
- Shareable QR code for supply chain participants
- Interactive UI to issue, view, and share credentials

---

## 🧱 Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Frontend     | React.js (with Next.js)           |
| Backend/API  | Express.js                        |
| Identity     | ACA-Py (Aries Cloud Agent Python) |
| Wallet       | BC Wallet / Mobile Wallet (VCs)   |
| Data Storage | JSON / NoSQL / Temporary Store    |
| Protocol     | DIDComm, VC                       |

---

## 📁 Project Structure

```
Agri_Passport/
├── backend/                 # Express.js API for issuing and verifying credentials
│   ├── controllers/         # API logic for endpoints
│   ├── db/                  # Database connection and config
│   ├── middleware/          # Middlewares (auth, error handling, etc.)
│   ├── models/              # Mongoose models or data schemas
│   ├── routes/              # API routing definitions
│   ├── utils/               # Utility functions
│   ├── .env                 # Environment variables (example)
│   ├── .gitignore           # Git ignored files
│   ├── index.js             # Application entry point
│   ├── package.json         # Node dependencies
│   └── swagger.js           # Swagger documentation setup
│   ├── tests/               # Comprehensive test suite
│   │   ├── unit/            # Unit tests for controllers & models
│   │   ├── integration/     # API integration tests
│   │   └── e2e/             # End-to-end workflow tests
│
├── frontend/                # Next.js based React UI
│   ├── api/                 # API service utilities
│   ├── app/                 # Next.js 13 app directory
│   ├── components/          # Reusable components
│   ├── context/             # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Library and helper functions
│   ├── public/              # Static assets
│   ├── styles/              # Tailwind and custom styles
│   ├── package.json         # Node dependencies
├── README.md                # Project documentation
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/sapkotakristal1029/Agri_Passport.git
cd Agri_Passport
```

### 2. Install Dependencies

#### Backend

```bash
cd Agri-Passport-backend
npm install --legacy-peer-deps

```

#### Frontend

```bash
cd Agri-Passport-frontend
npm install --legacy-peer-deps
```

### 3. Configure `.env`

#### 🔐 AUTHENTICATION TOKEN (REQUIRED)<br>

You must obtain an auth token from the Traction Developer Portal:<br>
https://traction-sandbox-tenant-ui.apps.silver.devops.gov.bc.ca/tenant/developer

#### Steps:

1.  Create an account — this will act as the credential issuer.
2.  After logging in, go to the top-right "Developer" menu → "Wallet".
3.  Copy the Auth Token from the wallet section and paste it Agri-Passport-backend/.env file.<br>

```bash
AUTH_TOKEN=your_auth_token_here
```

#### ⚠️ NOTE:

This project uses the **BC Wallet**, which is free and intended for testing only.<br>
All credential history and data in the sandbox environment expire every 15 days.

---

## 🧪 Running the Project

### 1. Run the Backend

```bash
cd Agri-Passport-backend
npm run dev
```

### 3. Run the Frontend

```bash
cd ../frontend
npm run dev
```

---

🧪 Testing 

**Overview**
The backend includes a comprehensive testing suite with 35 tests covering unit, integration, and end-to-end scenarios. The test suite ensures code quality, reliability, and security of the blockchain-based traceability system.

**Testing Coverage**
1. Authentication: Registration, login, user management
2. Batch Management: CRUD operations, filtering, validation
3. Model Validation: Schema validation, field requirements
4. Route Protection: Authorization, role-based access
5. Error Handling: Comprehensive error scenarios

**Running Tests**
Run All Tests
npm test
Run Tests with Coverage Report
npm run test:coverage

**Test Results**
1. Test Suites: 8 passed, 8 total
2. Tests: 55 passed, 55 total  
3. Time: ~2.4 seconds
4. Coverage: Controllers, Models, Routes, Middleware

**Key Testing Features**
1. Isolated Testing: Each test runs independently with mocked dependencies
2. Security Testing: Authentication, authorization, and input validation
3. Data Integrity: Schema validation and business logic verification
4. Error Scenarios: Comprehensive error handling and edge cases
5. Role-Based Testing: Manufacturer, officer, and customer

Note: The testing suite focuses exclusively on backend API reliability and security. For detailed testing documentation, see Testing Documentation.

---

## 📘 API Documentation

If Swagger is set up, access the backend API documentation at:

```bash
http://localhost:3000/api-docs
```

---

## 🔄 How It Works

1. The **Manufacturer** creates their own account and logs in via the platform.
2. They submit a **batch request** to the verifying **Officer**.
3. The Officer issues a **Verifiable Credential** to the Manufacturer’s wallet.
4. The Manufacturer accepts the credential and stores it in their **BC Wallet**.
5. Each verified product includes a **QR code** generated by the platform.
6. End customers can **scan the QR code** using a compatible wallet app to view trusted batch and product details on their device.

📽️ [**Full demo available here**](https://youtu.be/yxhGexWsEPo)

---

## ⚠️ Known Issues / Limitations

- BC Wallet sandbox expires credentials every 15 days<br>
- QR verification may require re-authentication after token expiry<br>
- UI tested mainly on Chrome

---

## License

This project was developed for educational purposes as part of the 3821ICT Work Intergrated Learning at Griffith University.
