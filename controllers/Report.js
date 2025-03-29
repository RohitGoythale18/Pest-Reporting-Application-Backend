const Report = require('../models/Report');

const submitReport = async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        console.log("Uploaded File:", req.file);

        const { location, pestType, description } = req.body;

        if (!location || !pestType || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const report = await Report.create({
            user: req.user.id,
            location,
            pestType,
            description,
            imageUrl: req.file ? req.file.path : null,
        });

        await report.save();

        res.status(201).json({ message: "Report submitted successfully" });
    } catch (err) {
        console.error("Submission Error:", err);
        res.status(500).json({ error: err.message });
    }
};

const getReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const reports = await Report.find({ user: userId }).populate("user", "username");

        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    submitReport,
    getReports,
}