const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { analyzeController } = require("../controllers/analyzeController");

// POST /api/analyze
// Accepts multipart/form-data with optional image field
router.post("/", upload.single("image"), analyzeController);

module.exports = router;
