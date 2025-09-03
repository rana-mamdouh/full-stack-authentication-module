# Authentication App

A full-stack authentication application built with **NestJS**, **React**, and **MongoDB**, fully containerized with Docker.

## 🚀 Quick Start

**Run the entire application with one command:**

```bash
docker-compose up --build
```

**Access the application:**
- **Frontend (React)**: http://localhost:3000
- **Backend API (NestJS)**: http://localhost:3001
- **Database UI (Mongo Express)**: http://localhost:8081
- **MongoDB**: localhost:27017

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Git (for cloning the repository)

## 🏗️ Project Structure

```
full-stack-authentication-module/
├── docker-compose.yml          # Docker orchestration
├── README.md                   # This file
├── nestjs-server/                    # NestJS API
│   ├── Dockerfile             
│   ├── .dockerignore          
│   ├── package.json           
│   ├── src/                   
│   │   ├── main.ts            # Application entry point
│   │   ├── app.module.ts      # Root module
│   │   └── ...                # Your NestJS code
│   └── ...
├── reactjs-client/            # React Application
│   ├── Dockerfile             
│   ├── .dockerignore          
│   ├── package.json           
│   ├── src/                   
│   │   ├── services/          
│   │   │   └── api.ts         # API client configuration
│   │   └── ...                # Your React code
└── └── ...

```

## 🛠️ Technologies Used

### Backend
- **NestJS** - Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication

### Frontend  
- **React** - Frontend framework
- **Vite** - Frontend build tool
- **TypeScript** - Type safety

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Mongo Express** - Database management UI

## 📦 Services

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| Frontend | `react-frontend` | 3000 | React application |
| Backend | `nestjs-backend` | 3001 | NestJS API server |
| Database | `authentication_app_mongodb` | 27017 | MongoDB database |
| Database UI | `authentication_app_mongo_express` | 8081 | MongoDB management interface |

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/rana-mamdouh/full-stack-authentication-module.git
cd full-stack-authentication-module
```

### 2. Configure Environment Variables (Optional)
Create a `.env` file in the root directory for custom JWT settings:

```bash
# JWT Configuration
JWT_KEY=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Other optional variables
NODE_ENV=development
```

**Note**: If you don't create a `.env` file, the application will use default values:
- `JWT_KEY`: "your-secret-key-here"
- `JWT_EXPIRES_IN`: "1h"

**Alternative: Set environment variables directly in shell:**
```bash
# Set JWT configuration
export JWT_KEY="your-super-secret-jwt-key-here"
export JWT_EXPIRES_IN="24h"

# Then run docker-compose
docker-compose up --build
```

### 3. Start the Application
```bash
# Start all services
docker-compose up --build

# Or start in background (detached mode)
docker-compose up --build -d
```

### 4. Verify Everything is Running
```bash
# Check container status
docker-compose ps

# Should show all 4 containers running
```

## 🔧 Development Commands

### Start/Stop Services
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up frontend

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose up --build

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

## 🌍 Environment Variables

### Backend Environment Variables
The backend service automatically configures these variables:

```bash
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/authentication_app
DATABASE_NAME=authentication_app
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### JWT Configuration
JWT settings can be customized via environment variables:

```bash
# Required for production - set these in your .env file
JWT_KEY=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Examples of JWT_EXPIRES_IN values:
# 1h    - 1 hour
# 24h   - 24 hours
# 7d    - 7 days
# 30d   - 30 days
```

### Frontend Environment Variables
```bash
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🔗 API Endpoints

The NestJS backend runs on `http://localhost:3001` with the following base structure:

```
GET    /api/                 # Health check
POST   /api/auth/signin      # User login
POST   /api/auth/signup      # User registration
GET    /api/auth/profile     # Get user profile
```

## 📊 Database Management

### Access MongoDB
```bash
# Using Mongo Express (GUI)
# Visit: http://localhost:8081

# Using MongoDB Shell
docker-compose exec mongodb mongosh authentication_app
```

### Database Info
- **Database Name**: `authentication_app`
- **Connection String**: `mongodb://mongodb:27017/authentication_app`
- **Admin UI**: http://localhost:8081

## 🔐 Security Notes

- **JWT_KEY**: In production, always use a strong, unique secret key
- **JWT_EXPIRES_IN**: Set appropriate expiration times for your use case
- **Database**: MongoDB is exposed on localhost:27017 - restrict access in production
- **Environment**: The application runs in development mode by default

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3001, 27017, and 8081 are available
2. **JWT errors**: Check that JWT_KEY is properly set in your .env file
3. **Database connection**: Verify MongoDB container is running with `docker-compose ps`
4. **Build failures**: Try `docker-compose down -v` and `docker-compose up --build`

### Logs
```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
```