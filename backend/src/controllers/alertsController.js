const { v4: uuidv4 } = require("uuid");
const { alerts, patients } = require("../utils/store");

/**
 * POST /api/alerts
 * Manually trigger a critical alert for a patient.
 *
 * Body: { patientId, triageScore }
 * If triageScore === 1, stores and returns the alert.
 */
function createAlertController(req, res) {
  const { patientId, triageScore, message } = req.body;

  if (triageScore !== 1 && triageScore !== "1") {
    return res.status(200).json({
      success: true,
      message: "No alert needed for non-critical triage score.",
      triggered: false,
    });
  }

  // Find patient information if patientId provided
  const patient = patientId ? patients.find((p) => p.id === patientId) : null;

  const alert = {
    id: uuidv4(),
    patientId: patientId || null,
    patientName: patient ? patient.name : "Unknown Patient",
    message: message || (patient
      ? `CRITICAL ALERT: ${patient.name} — ${patient.condition}`
      : "Critical emergency alert triggered"),
    severity: "Critical",
    timestamp: new Date().toISOString(),
  };

  alerts.unshift(alert);

  return res.status(201).json({
    success: true,
    message: "Critical alert triggered",
    data: alert,
  });
}

/**
 * GET /api/alerts
 * Return all stored alerts.
 */
function getAlertsController(req, res) {
  return res.status(200).json({
    success: true,
    count: alerts.length,
    data: alerts,
  });
}

module.exports = { createAlertController, getAlertsController };
