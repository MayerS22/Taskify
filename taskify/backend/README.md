# Taskify Backend

This is the backend for the Taskify project, built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/) using SQLite as the database. It provides authentication and user management APIs, and is designed to be easily extended for features like lists and todos.

---

## Features
- User registration (first name, last name, email, password)
- User login with JWT authentication
- Passwords securely hashed with bcrypt
- Protected routes (e.g., user profile)
- Modular structure for easy feature expansion

---

## Getting Started

### 1. **Install Dependencies**
```bash
cd backend
npm install
```

### 2. **Run the Development Server**
```bash
npm run start:dev
```
- The backend will start on [http://localhost:3001](http://localhost:3001)

### 3. **Environment Variables**
- By default, the JWT secret and SQLite DB are hardcoded for development.
- For production, use environment variables (e.g., `JWT_SECRET`).

---

## API Endpoints

### **Auth**
- `POST /auth/register` — Register a new user
  - Body: `{ "firstName": string, "lastName": string, "email": string, "password": string }`
- `POST /auth/login` — Login and receive a JWT token
  - Body: `{ "email": string, "password": string }`
  - Response: `{ "access_token": string }`

### **Users**
- `GET /users/me` — Get current user info (requires JWT in `Authorization` header)

---

## Authentication Flow
1. **Register:**
   - Send user details to `/auth/register`.
   - User is created in the database with a hashed password.
2. **Login:**
   - Send credentials to `/auth/login`.
   - If valid, receive a JWT token.
3. **Access Protected Routes:**
   - Send the JWT token in the `Authorization: Bearer <token>` header.
   - Example: `GET /users/me`

---

## Project Structure
```
backend/
  src/
    auth/      # Authentication module
    users/     # User management module
    ...        # (future: lists, todos, etc.)
    app.module.ts
    main.ts
  package.json
  README.md
  ...
```

---

## Extending the Backend
- Add new modules (e.g., `lists`, `todos`) in `src/`.
- Register new entities with TypeORM in the relevant module and in `app.module.ts`.
- Add new endpoints in controllers and services.

---

## License
MIT
