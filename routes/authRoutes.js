const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// route to signup as user.
router.post('/signup', authController.signup);
// route to login - returns token. 
router.post('/login', authController.login);


module.exports = router;