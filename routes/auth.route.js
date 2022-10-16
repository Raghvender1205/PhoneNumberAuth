const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');
const {
    fetchCurrUser,
    loginWithOTP,
    createNewUser,
    verifyOTP, 
    handleAdmin
} = require('../controllers/auth.controller');

router.post('/register', createNewUser);
router.post('login', loginWithOTP);
router.post('/verify', verifyOTP);

router.get('/me', checkAuth, fetchCurrUser);
router('/admin', checkAuth, checkAdmin, handleAdmin);

module.exports = router;