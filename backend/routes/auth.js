const express = require('express');
const {register, login, getMe, logout ,deleteUser} = require('../controllers/auth/user');
const { carProviderRegister, carProviderLogin, getMeCarProvider } = require("../controllers/auth/carProvider");

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

///////// For Customer /////
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.delete('/deleteuser/:id',protect,authorize('admin'),deleteUser);
///////////////////////////////////

///////// For Car Provider /////
router.post('/register/carProvider', carProviderRegister);
router.post('/login/carProvider', carProviderLogin);
router.get('/me/carProvider', protect, getMeCarProvider);
router.get('/logout', logout);

////////////////////////////////

module.exports = router;