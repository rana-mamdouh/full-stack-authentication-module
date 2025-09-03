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

### Frontend  
- **React** - Frontend framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

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

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/rana-mamdouh/full-stack-authentication-module.git
cd full-stack-authentication-module
```

### 2. Start the Application
```bash
# Start all services
docker-compose up --build

# Or start in background (detached mode)
docker-compose up --build -d
```

### 3. Verify Everything is Running
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
```bash
NODE_ENV=development
DATABASE_URL=mongodb://mongodb:27017/authentication_app
MONGODB_URI=mongodb://mongodb:27017/authentication_app
PORT=3000
```

### Frontend Environment Variables
```bash
REACT_APP_API_URL=http://localhost:3001
CHOKIDAR_USEPOLLING=true
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


---