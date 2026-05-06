"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonrepair } from "jsonrepair";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

// Helper pour extraire le JSON proprement
function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return match[0];
}

export async function analyzeApp(url: string, country: string = "us") {
  if (!url) throw new Error("URL manquante");

  try {
    // 1. Extraction de l'ID App Store
    const match = url.match(/id(\d+)/);
    if (!match) throw new Error("Lien invalide. Assurez-vous d'utiliser un lien App Store valide.");
    const appId = match[1];

    // 2. Récupération des Metadata
    const metaRes = await fetch(`https://itunes.apple.com/lookup?id=${appId}`);
    const metaData = await metaRes.json();
    const appInfo = metaData?.results?.[0];

    if (!appInfo) throw new Error("Impossible de trouver les informations de l'application.");

    // 3. Récupération des Reviews (100 dernières)
    let allReviews: any[] = [];
    for (let page = 1; page <= 2; page++) {
      const reviewsRes = await fetch(
        `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${appId}/sortBy=mostRecent/json`
      );
      const reviewsData = await reviewsRes.json();
      const pageEntries = reviewsData?.feed?.entry ?? [];
      const actualReviews = page === 1 ? pageEntries.slice(1) : pageEntries;
      allReviews = [...allReviews, ...actualReviews];
      if (pageEntries.length < 50) break;
    }

    const reviewsText = allReviews
      .map((r: any) => `[${r["im:rating"]?.label}★] ${r.title?.label}: ${r.content?.label}`)
      .join("\n");

    // 4. Configuration et Appel Gemini (Modèle : gemini-2.0-flash)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", 
    });

    const prompt = `
      You are an expert app store analyst.
      TASK: Analyze the following user reviews for the app "${appInfo.trackName}" and provide a deep dive analysis.
      
      RULES:
      - Be CONCISE and educational.
      - Return ONLY valid JSON.
      - Use double line breaks \\n\\n for readability in the text.

      REVIEWS TO ANALYZE:
      ${reviewsText}

      RESPONSE FORMAT (JSON ONLY):
      {
        "topInsight": "A single, punchy sentence summarizing the most important takeaway.",
        "sentimentScore": 85,
        "pros": ["Point fort 1", "Point fort 2", "Point fort 3"],
        "cons": ["Point faible 1", "Point faible 2", "Point faible 3"],
        "recommendation": "Short priority recommendation for the developers."
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 8024,
      },
    });

    const response = await result.response;
    const textContent = response.text().trim();

    // 5. Extraction et Réparation du JSON
    const extracted = extractJSON(textContent);
    const repairedJson = jsonrepair(extracted);
    const aiAnalysis = JSON.parse(repairedJson);

    return {
      name: appInfo.trackName,
      developer: appInfo.artistName,
      icon: appInfo.artworkUrl100,
      rating: appInfo.averageUserRating,
      reviewsCount: appInfo.userRatingCount,
      ...aiAnalysis
    };

  } catch (error: any) {
    console.error("❌ Erreur Analyse:", error);
    throw new Error(error.message || "L'analyse a échoué.");
  }
}
