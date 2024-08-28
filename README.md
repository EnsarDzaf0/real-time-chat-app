# Real-Time Chat Application

This is a real-time chat application built with Node.js, React, TypeScript, and WebSockets, utilizing Redis for rate limiting and Sequelize ORM for PostgreSQL. The application supports real-time messaging with features like typing indicators, group chats, user search etc.

The live backend api url can be found here: `https://zamger.site/api/`

The live application url can be found here: `https://orca-app-z6h3n.ondigitalocean.app/`

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)

## Features

- Real-time messaging with WebSockets
- User authentication and authorization
- Group chat functionality
- Typing indicators
- Rate limiting with Redis to prevent abuse
- Profile image upload support using DigitalOcean Spaces
- PostgreSQL database with Sequelize ORM
- Responsive design using Material UI

## Tech Stack

- **Frontend**: React, TypeScript, Material UI
- **Backend**: Node.js, Express, WebSockets
- **Database**: PostgreSQL, Sequelize ORM
- **Cache/Rate Limiting**: Redis
- **Storage**: DigitalOcean Spaces
- **Deployment**: DigitalOcean Droplets & Apps

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **PostgreSQL**
- **Redis**
- **DigitalOcean Account** for Spaces

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/EnsarDzaf0/real-time-chat-app.git
cd real-time-chat-app
```

### 2. Install Dependencies

Backend
```bash
cd api
npm install
```

Frontend
```bash
cd app
npm install
```

### 3. Configure Environment Variables

Create a .env file in the api directory with the following variables:
```bash
PORT = 8080
NODE_ENV = development

DB_USER = 
DB_PASSWORD =  
DB_HOST = 
DB_PORT = 
POSTGRES_DB =   

DB_USER_PROD = 
DB_PASSWORD_PROD = 
DB_HOST_PROD = 
DB_PORT_PROD = 
POSTGRES_DB_PROD = 

SECRET_KEY = 

HASHED_PASSWORD = "OPTIONAL FOR UNIT TEST"

REDIS_PORT = 
REDIS_HOST = 
REDIS_PASSWORD = 

SPACES_ACCESS_KEY = 
SPACES_SECRET_KEY = 
SPACE_REGION = 
SPACE_NAME = 
SPACE_ENDPOINT = 
```

### 4. Database Migration
Run the following command to set up the PostgreSQL database:
```bash
cd api
npx sequelize-cli db:migrate
```

### 5. Start the Application
Backend
```bash
cd api
npm run dev
```

Frontend
```bash
cd app
npm start
```

## Configuration
Rate Limiting with Redis
The application uses Redis to rate limit the number of requests a user can make. This is configured in the rateLimiter middleware. Adjust the limits as needed in the rateLimiter.js file.

DigitalOcean Spaces
For profile image uploads, the application uses DigitalOcean Spaces. Ensure your environment variables for the Spaces configuration are correctly set up in the .env file.

## Running the Application

Once the backend and frontend servers are running, you can access the application at `http://localhost:3000`. The backend API will run on `http://localhost:8080`.
