const express = require("express");
const { submitReport, getReports } = require("../controllers/Report");
const { protect } = require("../middlewares/Auth");
const reportRouter = express.Router();
const multer = require("multer");
const storage = require("../config/cloudinary");

const upload = multer({ storage });

reportRouter.post("/submit", protect, upload.single("image"), submitReport);
reportRouter.get("/reports", protect, getReports);

module.exports = reportRouter;
