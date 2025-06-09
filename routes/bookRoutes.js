const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticate = require('../middleware/authMiddleware');

router.post('/books', authenticate, bookController.addBook)
router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookDetails);

module.exports = router