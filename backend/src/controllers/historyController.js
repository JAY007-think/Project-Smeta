const { history } = require("../utils/store");

/**
 * GET /api/history
 * Return all past emergency triage records.
 * Supports optional query params:
 *  - severity (Critical|High|Medium|Low)
 *  - limit    (number, default 100)
 *  - offset   (number, default 0)
 */
function getHistoryController(req, res) {
  const { severity, limit = 100, offset = 0 } = req.query;

  let filtered = [...history];

  if (severity) {
    filtered = filtered.filter(
      (h) => h.severity.toLowerCase() === severity.toLowerCase()
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));

  const result = paginated.map((h) => ({
    id: h.id,
    patient: h.name,
    age: h.age,
    condition: h.condition,
    severity: h.severity,
    score: h.triageScore,
    date: h.timestamp ? h.timestamp.split("T")[0] : "",
    time: h.timestamp ? h.timestamp.split("T")[1]?.substring(0, 5) : "",
    outcome: h.status || "Waiting",
    confidence: h.confidence,
    recommendedAction: h.recommendedAction,
    symptoms: h.symptoms,
  }));

  return res.status(200).json({
    success: true,
    total,
    count: result.length,
    data: result,
  });
}

module.exports = { getHistoryController };
