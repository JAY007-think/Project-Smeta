const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { analyzeEmergency } = require("../services/geminiService");
const { supabase } = require("../lib/supabase"); // Import Supabase
const { patients, alerts, history } = require("../utils/store");

async function analyzeController(req, res, next) {
  try {
    const { text = "", voiceTranscript = "", name, age, gender, location } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${path.basename(req.file.path)}`
      : null;

    if (!text && !voiceTranscript && !imagePath) {
      return res.status(400).json({
        success: false,
        error: "At least one of text, voiceTranscript, or image must be provided.",
      });
    }

    const patientInfo = { name, age, gender, location };

    let aiResult;
    try {
      aiResult = await analyzeEmergency(text, voiceTranscript, imagePath, patientInfo);
      aiResult.source = "Gemini 2.5 Flash AI";
    } catch (aiError) {
      aiResult = buildFallbackResult(text, voiceTranscript);
      aiResult.source = "Local Fallback Rules";
    }

    const id = `TRG-${uuidv4().substr(0, 5).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const newPatient = {
      id,
      name: name || "Anonymous",
      age: age ? parseInt(age, 10) : null,
      gender: gender || "Unknown",
      location: location || "Unknown",
      symptoms_text: text, // Matched to DB column name
      voice_transcript: voiceTranscript, // Matched to DB column name
      image_url: imageUrl, // Matched to DB column name
      triage_score: aiResult.triageScore,
      severity: aiResult.severity,
      condition: aiResult.condition,
      department: aiResult.department || "General Emergency",
      recommended_action: aiResult.recommendedAction,
      estimated_wait_time: aiResult.estimatedWaitTime || "N/A",
      source: aiResult.source,
      status: "Waiting",
    };

    // --- SAVE TO SUPABASE ---
    const { error: dbError } = await supabase
      .from("triage_requests")
      .insert([newPatient]);

    if (dbError) {
      console.error("❌ Supabase Insert Error:", dbError);
    } else {
      console.log("✅ Successfully saved to Supabase");
    }

    // Still push to in-memory for immediate legacy support/testing
    patients.unshift(newPatient);

    return res.status(200).json({
      success: true,
      data: {
        ...newPatient,
        timestamp: timestamp.split("T")[0],
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Deterministic fallback triage when the Gemini API is unavailable.
 * Scans the combined text for critical keywords.
 */
function buildFallbackResult(text, voiceTranscript) {
  const combined = `${text} ${voiceTranscript}`.toLowerCase();

  const criticalKeywords = ["heart attack", "cardiac", "stroke", "unconscious", "not breathing", "chest pain", "anaphylaxis"];
  const highKeywords = ["allergic", "severe", "difficulty breathing", "fracture", "bleeding"];
  const mediumKeywords = ["abdominal", "pain", "fever", "nausea", "injury"];

  let triageScore = 4;
  let severity = "Low";
  let condition = "Requires Assessment";

  // Check for high fever (e.g. 104, 120, etc)
  const tempMatch = combined.match(/(\d{3})\s*f/);
  const feverValue = tempMatch ? parseInt(tempMatch[1]) : 0;

  if (criticalKeywords.some((k) => combined.includes(k)) || feverValue >= 104) {
    triageScore = 1; severity = "Critical"; condition = feverValue >= 104 ? "Severe Hyperpyrexia" : "Potential Life-Threatening Emergency";
  } else if (highKeywords.some((k) => combined.includes(k)) || feverValue >= 102) {
    triageScore = 2; severity = "High"; condition = feverValue >= 102 ? "High Fever" : "Urgent Medical Condition";
  } else if (mediumKeywords.some((k) => combined.includes(k))) {
    triageScore = 3; severity = "Medium"; condition = "Semi-Urgent Condition";
  }

  return {
    triageScore,
    severity,
    condition,
    confidence: "72%",
    recommendedAction: "Please consult with a medical professional immediately.",
    estimatedWaitTime: triageScore === 1 ? "Immediate" : triageScore === 2 ? "< 10 minutes" : "< 30 minutes",
    department: triageScore <= 2 ? "Emergency / Trauma" : "General Medicine",
    symptoms: ["Symptoms require clinical assessment"],
  };
}

module.exports = { analyzeController };
