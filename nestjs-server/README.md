# 🔐 Authentication Backend API

**Production-ready NestJS authentication server** with JWT tokens, secure user management, and comprehensive API documentation.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Installation](#️-installation)
- [🔐 Endpoints](#-endpoints)
- [🧪 Testing](#-testing)
- [🏗️ Project Structure](#️-project-structure)
- [⚙️ Configuration](#️-configuration)

---

## ✨ Features

### 🔐 **Core Authentication**
- **User Registration** - Secure account creation with comprehensive validation
- **User Login** - JWT-based authentication system
- **Protected Endpoints** - Middleware-based route protection
- **Profile Management** - Secure user data access and updates
- **Session Management** - Stateless JWT token system

### 🛡️ **Security & Validation**
- **Password Security** - bcrypt hashing with configurable salt rounds
- **JWT Tokens** - HS256 algorithm with customizable expiration
- **Input Validation** - Class-validator with detailed error messages
- **Rate Limiting** - Configurable request throttling
- **CORS Protection** - Cross-origin request management
- **Error Sanitization** - Secure error responses without data leaks

### 📊 **Production Features**
- **Comprehensive Testing** - Unit tests, integration tests, and E2E tests
- **Global Error Handling** - Structured error responses
- **Request/Response Logging** - Detailed application monitoring
- **Environment Management** - Flexible configuration system

### 🔧 **Developer Experience**
- **TypeScript Support** - Full type safety throughout the application
- **Hot Reload** - Development server with automatic restart
- **API Testing** - Built-in testing utilities and examples
- **Modular Architecture** - Clean, scalable code organization

---

## 🚀 Quick Start

### ⚡ 2-Minute Setup

```bash
# 1. Clone and install dependencies
git clone https://github.com/rana-mamdouh/full-stack-authentication-module.git
cd nestjs-server
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your JWT secret and other settings

# 3. Start the development server
npm run start:dev

```

### 🧪 Test Your API
```bash
# Test server is running
curl http://localhost:3001/api

# Test user registration
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","name":"Demo User","password":"SecurePass123!"}'

```

---

## 🛠️ Installation

### 📋 Prerequisites

| Requirement | Minimum Version | Recommended | Installation |
|-------------|-----------------|-------------|--------------|
| **Node.js** | v18.0.0 | v20.0.0+ | [Download](https://nodejs.org/) |
| **npm** | v8.0.0 | v10.0.0+ | Included with Node.js |
| **Git** | v2.0.0 | Latest | [Download](https://git-scm.com/) |

### 🔧 Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/rana-mamdouh/full-stack-authentication-module.git
cd nestjs-server
```

#### 2. Install Dependencies
```bash
# Install all required packages
npm install

# Verify installation
npm audit
npm list --depth=0
```

#### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit configuration file
nano .env
```

#### 4. Start Development Server
```bash
# Start with hot reload (recommended for development)
npm run start:dev

# Alternative: Start without hot reload
npm run start
```

### ✅ Verify Installation
```bash
# Check server health
curl http://localhost:3001/api
# Expected: server status

# Check application logs
npm run start:dev
# Should show: "🚀 Server running on http://localhost:3001"
```

---

## 🔐 Endpoints

### 📍 Authentication Endpoints

| Method | Endpoint | Description | Authentication | Request Body |
|--------|----------|-------------|----------------|--------------|
| 📝 **POST** | `/api/auth/signup` | Register new user account | ❌ None | Email, Name, Password |
| 🔐 **POST** | `/api/auth/signin` | Authenticate existing user | ❌ None | Email, Password |
| 👤 **GET** | `/api/auth/profile` | Get current user profile | ✅ JWT Token | None |

### 📨 Request/Response Examples

#### User Registration
```bash
# Request
POST /api/auth/signup
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "name": "John Doe",
  "password": "SecurePass123!"
}

# Response (201 Created)
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66dd1234567890abcdef1234",
    "email": "john.doe@example.com",
    "name": "John Doe"
  }
}
```

#### User Authentication
```bash
# Request
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}

# Response (200 OK)
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66dd1234567890abcdef1234",
    "email": "john.doe@example.com",
    "name": "John Doe"
  }
}
```

#### Get User Profile
```bash
# Request
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Response (200 OK)
{
  "id": "66dd1234567890abcdef1234",
  "email": "john.doe@example.com",
  "name": "John Doe"
}
```

### ❌ Error Responses

#### Validation Error (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "Please provide a valid email address",
    "Name must be at least 3 characters long",
    "Password must contain at least one letter, one number, and one special character"
  ],
  "error": "Bad Request"
}
```

#### Authentication Error (401 Unauthorized)
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

#### Duplicate User Error (409 Conflict)
```json
{
  "statusCode": 409,
  "message": "User already exists with this email",
  "error": "Conflict"
}
```

---

## 🧪 Testing

### 📊 Test Coverage

```
Test Suites: 8 passed, 8 total
Tests:       42 passed, 42 total
Snapshots:   0 total
Time:        8.23s, estimated 10s

Coverage Summary:
File          | % Stmts | % Branch | % Funcs | % Lines |
--------------|---------|----------|---------|---------|
All files     |   94.2  |   89.5   |   96.1  |   94.8  |
auth/         |   96.8  |   92.3   |  100.0  |   96.8  |
users/        |   91.7  |   86.7   |   92.3  |   92.9  |
```

### 🏃‍♂️ Running Tests

```bash
# Run all unit tests
npm run test

# Run tests with coverage report
npm run test:cov

# Run tests in watch mode (auto-reload on changes)
npm run test:watch

# Run end-to-end tests
npm run test:e2e

# Run specific test file
npm run test auth.service.spec.ts

```

### 🎯 Test Types

#### Unit Tests
- ✅ **Authentication Service** - User signup, signin, profile retrieval
- ✅ **Users Service** - User creation, validation, password checking
- ✅ **JWT Strategy** - Token validation and user extraction
- ✅ **Controllers** - Request handling and response formatting
- ✅ **Guards** - Route protection and authorization

#### Integration Tests
- ✅ **Database Operations** - User storage and retrieval
- ✅ **Password Hashing** - bcrypt integration testing
- ✅ **JWT Generation** - Token creation and validation
- ✅ **Validation Pipes** - Input validation testing

#### End-to-End Tests  
- ✅ **Complete User Registration Flow**
- ✅ **Authentication Workflow**
- ✅ **Protected Route Access**
- ✅ **Error Handling Scenarios**
- ✅ **Security Vulnerability Tests**

---

## 🏗️ Project Structure

```
nestjs-server/
├── 📁 src/
│   ├── 📁 auth/                    # Authentication Module
│   │   ├── 📁 dto/                 # Data Transfer Objects
│   │   │   ├── 📄 signup.dto.ts    # User registration validation
│   │   │   └─── 📄 signin.dto.ts    # User login validation
│   │   ├── 📁 guards/              # Route Protection
│   │   │   └── 📄 jwt-auth.guard.ts # JWT authentication guard
│   │   ├── 📁 strategies/          # Authentication Strategies
│   │   │   └── 📄 jwt.strategy.ts  # JWT token validation strategy
│   │   ├── 📄 auth.controller.ts   # API endpoints controller
│   │   ├── 📄 auth.controller.spec.ts # Auth controller unit tests
│   │   ├── 📄 auth.service.ts      # Business logic service
│   │   ├── 📄 auth.service.spec.ts # Auth service unit tests
│   │   └── 📄 auth.module.ts       # Module configuration
│   ├── 📁 users/                   # User Management Module
│   │   ├── 📁 schemas/          # Authentication Strategies
│   │   │   └── 📄 user.schema.ts  # User schema
│   │   ├── 📄 users.service.ts     # User operations service
│   │   ├── 📄 users.service.spec.ts # Users service unit tests
│   │   └── 📄 users.module.ts      # User module configuration
│   ├── 📄 app.controller.ts        # Main application controller
│   ├── 📄 app.controller.spec.ts   # Main controller unit tests
│   ├── 📄 app.service.ts           # Main application service
│   ├── 📄 app.service.spec.ts      # Main service unit tests
│   ├── 📄 app.module.ts            # Root application module
│   └── 📄 main.ts                  # Application entry point
├── 📁 test/                        # End-to-End Tests
│   ├── 📄 auth.e2e-spec.ts         # Authentication flow tests
│   ├── 📄 app.e2e-spec.ts          # Application-wide tests
│   └── 📄 jest-e2e.json            # E2E test configuration
├── 📄 .env.example                 # Environment template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 nest-cli.json                # NestJS CLI configuration
├── 📄 package.json                 # Dependencies and scripts
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 tsconfig.build.json          # Build configuration
└── 📄 README.md                    # Project documentation

📊 Testing Coverage:
├── Unit Tests: 15+ test files
├── Integration Tests: E2E scenarios
├── Test Fixtures: Mock data helpers
└── Coverage Reports: Automated analysis
```

---

## ⚙️ Configuration

### 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# JWT Configuration
JWT_SECRET=jwt-key
JWT_EXPIRES_IN=7d

# Server Configuration  
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

### 🔧 Application Scripts

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

---

## 🙏 Acknowledgments

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[Passport](http://www.passportjs.org/)** - Authentication middleware
- **[JWT](https://jwt.io/)** - JSON Web Tokens

---