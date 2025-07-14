<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

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
