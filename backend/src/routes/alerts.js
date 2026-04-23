const express = require("express");
const router = express.Router();
const { createAlertController, getAlertsController } = require("../controllers/alertsController");

// POST /api/alerts  – trigger a critical alert
router.post("/", createAlertController);

// GET  /api/alerts  – retrieve all alerts
router.get("/", getAlertsController);

module.exports = router;
