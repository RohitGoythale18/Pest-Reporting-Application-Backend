const express = require('express');
const { adminProtect } = require('../middlewares/Auth');
const { registerAdmin, loginAdmin, updateAdmin, verifyAdmin } = require('../controllers/Admin');
const adminRouter = express.Router();

adminRouter.post('/register', registerAdmin);
adminRouter.post('/login-admin', loginAdmin);
adminRouter.get('/verify-admin', adminProtect, verifyAdmin);
adminRouter.put('/update/:id', adminProtect, updateAdmin);

module.exports = adminRouter;