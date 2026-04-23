const express = require("express");
const router = express.Router();
const { getHistoryController } = require("../controllers/historyController");

// GET /api/history
router.get("/", getHistoryController);

module.exports = router;
