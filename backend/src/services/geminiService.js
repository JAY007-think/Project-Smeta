const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Convert a local image file to a Gemini-compatible inlineData part.
 */
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };
}

/**
 * Detect mime type from extension.
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return map[ext] || "image/jpeg";
}

/**
 * Analyzes an emergency case using Google Gemini (multimodal).
 *
 * @param {string} text - Symptom description text.
 * @param {string} voiceTranscript - Voice-recorded transcript.
 * @param {string|null} imagePath - Absolute path to uploaded image (or null).
 * @param {object} patientInfo - { name, age, gender, location, emergencyType }
 * @returns {Promise<object>} - Parsed triage result from Gemini.
 */
async function analyzeEmergency(text, voiceTranscript, imagePath, patientInfo) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ]
  });

  const prompt = `You are an expert emergency triage AI system , you have a deep knowledge about symptoms of different diseases and their severity. Analyze the following emergency case and return a structured JSON response.

Patient Information:
- Name: ${patientInfo.name || "Unknown"}
- Age: ${patientInfo.age || "Unknown"}
- Gender: ${patientInfo.gender || "Unknown"}
- Location: ${patientInfo.location || "Unknown"}

Symptom Description:
${text || "No text provided"}

Voice Transcript:
${voiceTranscript || "No voice transcript provided"}

${imagePath ? "An injury/medical image has been provided. Analyze it carefully for visible signs of trauma, injury, or medical condition. Do NOT block medical or injury photos as they are critical for triage assessment." : "No image provided."}

Based on this information, provide a triage assessment. Return ONLY a valid JSON object (no markdown, no explanation, just raw JSON) with exactly these fields:

{
  "triageScore": <number 1-5>,
  "severity": "<Critical|High|Medium|Low|Non-Urgent>",
  "condition": "<predicted medical condition>",
  "confidence": "<percentage as string e.g. '87%'>",
  "recommendedAction": "<specific recommended medical action>",
  "estimatedWaitTime": "<estimated wait time e.g. 'Immediate' or '5-10 minutes'>",
  "department": "<suggested hospital department e.g. 'Cardiology', 'Trauma', 'Pediatrics'>",
  "symptoms": ["<symptom 1>", "<symptom 2>", "<symptom 3>"]
}

Triage Score Reference and Rules:
1 = Critical (immediate life threat, e.g., temperature >= 104°F / 40°C, cardiac symptoms, severe trauma, unconsciousness, severe breathing difficulty). Wait time: Immediate.
2 = High (urgent, e.g., severe pain, major allergic reactions, heavy bleeding). Wait time: < 10 mins.
3 = Medium (semi-urgent, e.g., moderate cuts, moderate pain, stable but needs tests). Wait time: < 30 mins.
4 = Low (non-urgent, e.g., minor sprain, mild headache). Wait time: < 1 hour.
5 = Non-Urgent (can wait or refer elsewhere).

CRITICAL INSTRUCTION: Analyze the symptoms strictly. A fever of 104°F (40°C) or higher, or anything near 110°F implies severe hyperpyrexia/heat stroke and MUST be classified as Triage Score 1 (Critical). Apply similar strict clinical limits for other vitals.`;

  const parts = [{ text: prompt }];

  // Add image if provided
  if (imagePath && fs.existsSync(imagePath)) {
    const mimeType = getMimeType(imagePath);
    parts.push(fileToGenerativePart(imagePath, mimeType));
  }

  const result = await model.generateContent(parts);
  const response = await result.response;
  const rawText = response.text();

  // Parse the JSON response from Gemini
  let parsed;
  try {
    // Strip any accidental markdown fences
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Gemini returned invalid JSON: ${rawText} `);
  }

  return parsed;
}

module.exports = { analyzeEmergency };
