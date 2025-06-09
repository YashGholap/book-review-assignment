const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middleware/authMiddleware');

// route to add review
router.post('/books/:id/reviews', authenticate, reviewController.addReview);
//route to update existing review
router.put('/reviews/:id', authenticate, reviewController.updateReview);
//route to delete existing review
router.delete('/reviews/:id', authenticate, reviewController.deleteReview);
// optional : route to search a book with filter author and title
router.get('/search', reviewController.searchBook);

module.exports = router;