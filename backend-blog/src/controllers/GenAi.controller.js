import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GenContent(req, res) {
  try {
    const { prompt } = req.body;
    console.log(prompt);

    const genAI = new GoogleGenerativeAI(process.env.GEN_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      
    });

    // const result = await model.generateContent(prompt);
    const result = await model.generateContent(prompt);

    const response = result.response;
    return res.json({ text: response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.json({
      message: "Failed to generate content",
      status: 500,
    });
  }
}
