const { patients, history } = require("../utils/store");
const { supabase } = require("../lib/supabase");

async function updatePatientStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // --- UPDATE SUPABASE ---
    const { data: dbUpdated, error } = await supabase
      .from("triage_requests")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      console.warn("⚠️ Supabase Update Error:", error.message);
    }
    
    // --- Keep in-memory in sync ---
    const patientIndex = patients.findIndex(p => p.id === id);
    if (patientIndex !== -1) {
      patients[patientIndex].status = status;
    }

    return res.status(200).json({ 
      success: true, 
      data: dbUpdated ? dbUpdated[0] : (patients[patientIndex] || { id, status }) 
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { updatePatientStatus };
