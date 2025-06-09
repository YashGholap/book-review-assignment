const db = require('../models/db');

// Helper to send errors
const sendError = (res, code, message) => {
    return res.status(code).json({ message });
};

//  Helper to get a review by ID
const getReviewById = (reviewId, callback) => {
    db.get(`SELECT * FROM reviews WHERE id = ?`, [reviewId], callback);
};

//  Helper to validate rating
const isValidRating = (rating) => rating && rating >= 1 && rating <= 5;

// Add review - one user per book
exports.addReview = (req, res) => {
    const { id: bookId } = req.params;
    const { rating, comment = '' } = req.body;
    const userId = req.user.id;

    if (!isValidRating(rating)) return sendError(res, 400, 'Rating must be between 1 and 5.');

    const checkQuery = `SELECT * FROM reviews WHERE userId = ? AND bookId = ?`;
    db.get(checkQuery, [userId, bookId], (err, existingReview) => {
        if (err) return sendError(res, 500, 'Internal Server Error');
        if (existingReview) return sendError(res, 400, 'You already reviewed this book.');

        const insertQuery = `INSERT INTO reviews (userId, bookId, rating, comment) VALUES (?, ?, ?, ?)`;
        db.run(insertQuery, [userId, bookId, rating, comment], function (err) {
            if (err) return sendError(res, 500, 'Could not add review.');
            res.status(201).json({ message: 'Review added successfully.', reviewId: this.lastID });
        });
    });
};

// update own review
exports.updateReview = (req, res) => {
    const { id: reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    getReviewById(reviewId, (err, review) => {
        if (err || !review) return sendError(res, 404, 'Review Not Found!');
        if (review.userId !== userId) return sendError(res, 403, 'Not allowed to edit this review.');

        const updatedRating = isValidRating(rating) ? rating : review.rating;
        const updatedComment = comment || review.comment;

        const updateQuery = `UPDATE reviews SET rating = ?, comment = ? WHERE id = ?`;
        db.run(updateQuery, [updatedRating, updatedComment, reviewId], function (err) {
            if (err) return sendError(res, 500, 'Error updating review.');
            res.json({ message: 'Review updated.' });
        });
    });
};

// delete own review
exports.deleteReview = (req, res) => {
    const { id: reviewId } = req.params;
    const userId = req.user.id;

    getReviewById(reviewId, (err, review) => {
        if (err || !review) return sendError(res, 404, 'Review Not Found!');
        if (review.userId !== userId) return sendError(res, 403, 'Not allowed to delete this review.');

        db.run(`DELETE FROM reviews WHERE id = ?`, [reviewId], function (err) {
            if (err) return sendError(res, 500, 'Error deleting review.');
            res.json({ message: 'Review Deleted' });
        });
    });
};

// search book by title and author
exports.searchBook = (req, res) => {
    const { title, author } = req.query;

    let query = `SELECT * FROM books WHERE 1=1`;
    const params = [];

    if (title) {
        query += ` AND title LIKE ?`;
        params.push(`%${title}%`);
    }

    if (author) {
        query += ` AND author LIKE ?`;
        params.push(`%${author}%`);
    }

    db.all(query, params, (err, books) => {
        if (err) return sendError(res, 500, 'Search failed.');
        res.json({ books });
    });
};

