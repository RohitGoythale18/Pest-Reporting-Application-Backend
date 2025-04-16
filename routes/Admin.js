const express = require('express');
const { protect } = require('../middlewares/Auth');
const { registerAdmin, loginAdmin, updateAdmin, verifyAdmin } = require('../controllers/Admin');
const adminRouter = express.Router();

adminRouter.post('/register', registerAdmin);
adminRouter.post('/login', loginAdmin);
adminRouter.get('/verify', verifyAdmin);
adminRouter.put('/update/:id', protect, updateAdmin);

module.exports = adminRouter;