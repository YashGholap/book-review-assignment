const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(()=>{
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT
        )
        `);

    db.run(`
        CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT UNIQUE,
        author TEXT UNIQUE,
        genre TEXT
        )
        `);

    db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        bookId INTEGER,
        rating INTEGER,
        comment TEXT,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(bookId) REFERENCES books(id)
        UNIQUE(userId, bookId)
        )
        `);
});

module.exports = db;