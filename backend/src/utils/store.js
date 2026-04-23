// ─── In-memory Storage ────────────────────────────────────────────────────────
// Patients list (newest first; critical patients sorted to top on insert)
const patients = [];

// Alerts list
const alerts = [];

// Full history list (all emergencies ever analyzed)
const history = [];

module.exports = { patients, alerts, history };
