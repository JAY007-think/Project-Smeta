const express = require("express");
const router = express.Router();
const { getPatientsController } = require("../controllers/patientsController");
const { updatePatientStatus } = require("../controllers/statusController");

// GET /api/patients
router.get("/", getPatientsController);

// PATCH /api/patients/:id/status
router.patch("/:id/status", updatePatientStatus);

module.exports = router;
