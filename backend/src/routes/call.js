const express = require("express");
const router = express.Router();
const { analyzeCallChunk } = require("../controllers/callController");

// POST /api/analyze-call
router.post("/", analyzeCallChunk);

module.exports = router;
