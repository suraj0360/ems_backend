# EMS Backend (Express + MongoDB)

This is the migrated backend for the Event Management System, built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

## Prerequisites

- Node.js (v18+)
- MongoDB (Atlas or Local Replica Set)

> **Note**: Database transactions (used in Bookings/Payments) require a MongoDB Replica Set. MongoDB Atlas provides this by default. For local development, ensure your local MongoDB is running as a replica set.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the `backend` directory with the following:
    ```env
    PORT=8000
    DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/ems
    CORS_ORIGIN=http://localhost:3000
    
    # JWT Secrets
    ACCESS_TOKEN_SECRET=your_access_secret
    ACCESS_TOKEN_EXPIRY=15m
    REFRESH_TOKEN_SECRET=your_refresh_secret
    REFRESH_TOKEN_EXPIRY=7d
    ```

3.  **Run the Server**:
    - Development:
        ```bash
        npm run dev
    - Production:
        ```bash
        npm start
        ```

## API Documentation

- **Swagger UI**: Visit `http://localhost:8000/api-docs` (Not implemented yet, use Postman).
- **Postman**: Import `postman_collection.json`.

## Project Structure

- `src/models`: Mongoose Schemas
- `src/controllers`: Request Handlers
- `src/services`: Business Logic
- `src/routes`: API Routes
- `src/middleware`: Auth, Error Handling

## Features

- **Auth**: JWT (Access/Refresh) with Cookies.
- **Users**: RBAC (Admin/Organizer/User).
- **Events**: CRUD with pagination and filtering.
- **Bookings**: Transactional booking creation.
- **Payments**: Mock payment processing.
- **Analytics**: Dashboard stats.
