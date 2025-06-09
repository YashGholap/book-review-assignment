const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticate = require('../middleware/authMiddleware');

// route to add book - requires authentication.
router.post('/books', authenticate, bookController.addBook)
// route to get all the books.
router.get('/books', bookController.getBooks);
// route to get book details by book id.
router.get('/books/:id', bookController.getBookDetails);

module.exports = router