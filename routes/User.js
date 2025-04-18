const express = require('express');
const { registerUser, loginUser, verifyUser, userProfile } = require('../controllers/User');
const { protect } = require('../middlewares/Auth');
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login-user', loginUser);
userRouter.get('/verify-user', verifyUser);
userRouter.get('/profile/:id', protect, userProfile);

module.exports = userRouter;