const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple in-memory cache to prevent redundant hits
let lastTranscript = "";
let lastResult = null;

exports.analyzeCallChunk = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || transcript.trim() === "") {
      return res.json({
        success: true,
        data: {
          triageScore: 5,
          severity: "Pending",
          condition: "Listening...",
          symptoms: [],
          distressLevel: "Low",
          criticalKeywords: [],
        },
      });
    }

    // If transcript hasn't changed much, return last result to save quota
    if (transcript === lastTranscript && lastResult) {
      return res.json({ success: true, data: lastResult });
    }

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

    const prompt = `You are a real-time emergency dispatch AI. Analyze the following partial transcript of an ongoing 911/emergency call.

Partial Transcript: "${transcript}"

Task: Provide an interim triage assessment. Return ONLY a valid JSON object with EXACTLY these fields:
{
  "triageScore": <number 1-5, where 1 is critical life-threat, 5 is non-urgent>,
  "severity": "<Critical|High|Medium|Low|Pending>",
  "condition": "<very brief predicted medical condition based on info so far>",
  "symptoms": ["<extracted symptom 1>", "<extracted symptom 2>"],
  "distressLevel": "<Extreme|High|Moderate|Low>",
  "criticalKeywords": ["<e.g. bleeding>", "<e.g. not breathing>", "<any alarming words spoken>"]
}

Be fast and tolerate incomplete sentences. Do not include markdown or code wrappers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    let parsed;
    try {
      const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (err) {
      // Fallback
      parsed = {
        triageScore: 3,
        severity: "Medium",
        condition: "Analyzing...",
        symptoms: [],
        distressLevel: "Moderate",
        criticalKeywords: [],
      };
    }

    // Update cache
    lastTranscript = transcript;
    lastResult = parsed;

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error("Live Call Analysis Error:", error.message);
    
    // Handle Rate Limit (429) gracefully
    if (error.message.includes("429") || error.message.includes("quota")) {
      return res.json({
        success: true,
        data: lastResult || {
          triageScore: 3,
          severity: "Busy",
          condition: "AI Cooling Down...",
          symptoms: ["System busy"],
          distressLevel: "Moderate",
          criticalKeywords: ["Rate Limit"]
        }
      });
    }

    res.status(500).json({ success: false, error: "Analysis failed" });
  }
};
