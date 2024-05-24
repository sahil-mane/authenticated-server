const express = require('express');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.get('/',authController.view)
router.post('/signup',authController.signup);
router.post('/login',authController.login);

module.exports = router;