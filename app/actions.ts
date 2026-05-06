"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function analyzeApp(url: string) {
  if (!url) throw new Error("URL manquante");

  try {
    // 1. Extraire l'ID depuis le lien (Côté Serveur)
    const match = url.match(/id(\d+)/);
    if (!match) throw new Error("Lien invalide. Assurez-vous d'utiliser un lien App Store valide.");
    const appId = match[1];

    // 2. Fetch les metadata de l'app (Côté Serveur - PAS DE CORS)
    const metaRes = await fetch(`https://itunes.apple.com/lookup?id=${appId}`);
    const metaData = await metaRes.json();
    const appInfo = metaData?.results?.[0];

    if (!appInfo) throw new Error("Impossible de trouver les informations de l'application.");

    // 3. Fetch les reviews iTunes API (Boucle sur 2 pages = 100 reviews)
    let allReviews: any[] = [];
    for (let page = 1; page <= 2; page++) {
      const reviewsRes = await fetch(
        `https://itunes.apple.com/us/rss/customerreviews/page=${page}/id=${appId}/sortBy=mostRecent/json`
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

    // 4. Appel à Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert app store analyst. Analyze the following user reviews for the app "${appInfo.trackName}".
      
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
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const aiAnalysis = JSON.parse(cleanedText);

    // 5. Retourner l'objet complet
    return {
      name: appInfo.trackName,
      developer: appInfo.artistName,
      icon: appInfo.artworkUrl100,
      rating: appInfo.averageUserRating,
      reviewsCount: appInfo.userRatingCount,
      ...aiAnalysis
    };

  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "L'analyse a échoué.");
  }
}
