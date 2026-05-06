"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function analyzeAppReviews(reviewsText: string, appName: string) {
  if (!reviewsText) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert app store analyst. Analyze the following user reviews for the app "${appName}".
      
      Reviews:
      ${reviewsText}
      
      Provide a structured analysis in JSON format with the following fields:
      - topInsight: A single, punchy sentence summarizing the most important takeaway.
      - sentimentScore: A number from 0 to 100 representing the overall positivity.
      - pros: An array of the top 3 positive aspects mentioned.
      - cons: An array of the top 3 negative aspects or complaints mentioned.
      - recommendation: A short sentence on what the developers should prioritize next.

      Return ONLY the JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response in case Gemini adds markdown code blocks
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      topInsight: "L'analyse a échoué, mais les données sont récupérées.",
      sentimentScore: 50,
      pros: ["Données brutes disponibles"],
      cons: ["Erreur de communication avec l'IA"],
      recommendation: "Vérifiez votre clé API ou réessayez."
    };
  }
}
