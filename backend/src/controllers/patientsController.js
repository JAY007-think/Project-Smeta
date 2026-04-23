const { patients } = require("../utils/store");
const { supabase } = require("../lib/supabase");

async function getPatientsController(req, res) {
  try {
    // Attempt to fetch from Supabase
    const { data: dbPatients, error } = await supabase
      .from("triage_requests")
      .select("*")
      .order("triage_score", { ascending: true });

    if (error) {
      throw error;
    }

    // Map DB columns to Frontend expected camelCase if needed
    const result = dbPatients.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      condition: p.condition,
      severity: p.severity,
      triageScore: p.triage_score,
      status: p.status,
      timestamp: p.created_at,
      recommendedAction: p.recommended_action,
      estimatedWaitTime: p.estimated_wait_time,
      department: p.department,
      symptoms: p.symptoms_text ? [p.symptoms_text] : [],
    }));

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err) {
    console.error("⚠️ Supabase Fetch Error, falling back to in-memory:", err.message);
    
    // Fallback to in-memory store
    const sorted = [...patients].sort((a, b) => a.triageScore - b.triageScore);
    return res.status(200).json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  }
}

module.exports = { getPatientsController };
