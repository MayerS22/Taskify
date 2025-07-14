# Taskify Backend

This is the backend for the Taskify project, built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/) using SQLite as the database. It provides authentication and user management APIs, and is designed to be easily extended for features like lists and todos.

---

## Features
- User registration (first name, last name, email, password, phone, country)
- User login with JWT authentication
- Passwords securely hashed with bcrypt
- Password reset (forgot password, reset via email link)
- Success and error modals in frontend for user feedback
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
  - Body: `{ "firstName": string, "lastName": string, "email": string, "password": string, "phone"?: string, "country"?: string }`
- `POST /auth/login` — Login and receive a JWT token
  - Body: `{ "email": string, "password": string }`
  - Response: `{ "access_token": string }`
- `POST /auth/forgot-password` — Request a password reset link
  - Body: `{ "email": string }`
  - Always returns a generic message for security
- `POST /auth/reset-password` — Reset password using a token
  - Body: `{ "token": string, "newPassword": string }`
  - Returns a success or error message

### **Users**
- `GET /users/me` — Get current user info (requires JWT in `Authorization` header)

---

## Authentication & Password Reset Flow
1. **Register:**
   - Send user details to `/auth/register`.
   - User is created in the database with a hashed password.
2. **Login:**
   - Send credentials to `/auth/login`.
   - If valid, receive a JWT token.
3. **Forgot Password:**
   - Send email to `/auth/forgot-password`.
   - If the email exists, a reset token is generated and an email is sent (using Ethereal in development).
   - Check the backend console for the Ethereal preview URL to view the email.
4. **Reset Password:**
   - Send token and new password to `/auth/reset-password`.
   - If valid, the password is updated and the token is invalidated.
5. **Access Protected Routes:**
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

## Development & Testing
- The backend runs on [http://localhost:3001](http://localhost:3001)
- Password reset emails are sent using [Ethereal Email](https://ethereal.email/) for development/testing.
- After requesting a password reset, check the backend console for a preview URL to view the email.
- For production, configure a real SMTP provider in `auth.service.ts`.

---

## License
MIT
