# Book Review API (Node.js + Express + SQLite)

A simple RESTful API that allows users to sign up, login, add books, and post reviews — with JWT-based authentication.

---

## Features

- User Registration and Login (JWT Auth)
- Add/Get Books with filters and pagination
- Add/Update/Delete Book Reviews
- Search books by title/author
- Clean and modular codebase
- SQLite used as database (easy local setup)

---

## Tech Stack

- Node.js
- Express.js
- SQLite3
- bcrypt
- JWT
- dotenv

---

## Project Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-username/book-review-api.git
cd book-review-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
PORT=3000
JWT_SECRET=yourSecretKeyHere
```

### 4. Run the project
```bash
npm start
```

---

## API Endpoints

### Auth

#### POST /api/signup
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}
```

#### POST /api/login
```json
{
  "username": "john",
  "password": "secret123"
}
```

---

### Books

#### POST /api/books (Auth required)
Headers: `Authorization: Bearer <token>`
```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "genre": "Self-help"
}
```

#### GET /api/books?author=james&genre=self-help&page=1

#### GET /api/books/:id

---

### Reviews

#### POST /api/books/:id/reviews (Auth required)
```json
{
  "rating": 5,
  "comment": "Fantastic book!"
}
```

#### PUT /api/reviews/:id (Auth required)
```json
{
  "rating": 3,
  "comment": "Great book!"
}
```

#### DELETE /api/reviews/:id (Auth required)

---

### Search

#### GET /api/search?title=atomic&author=clear

---

## Design Decisions

- SQLite chosen for simplicity (easily replaceable with Postgres or MongoDB)
- Passwords hashed with `bcrypt`
- JWT stored in Authorization header for secure access
- Modular controller, route, and middleware separation for scalability

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT,
  password TEXT
);

-- Books
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  author TEXT,
  genre TEXT
);

-- Reviews
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  bookId INTEGER,
  rating INTEGER,
  comment TEXT,
  FOREIGN KEY(userId) REFERENCES users(id),
  FOREIGN KEY(bookId) REFERENCES books(id)
);
```

---

## Postman Collection

[Download Collection (JSON)](https://github.com/YashGholap/book-review-assignment/blob/develop/Book_Review.postman_collection.json)
