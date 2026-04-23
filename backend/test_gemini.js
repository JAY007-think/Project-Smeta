require('dotenv').config({path: './.env'});
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch (error) {
    console.error("FULL ERROR:", error);
  }
}
test();
