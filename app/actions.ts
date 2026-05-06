"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");


export async function analyzeApp(url: string, country: string = "us", page: number = 1) {
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

    // 3. Récupération des Reviews (Batch de 50 spécifique)
    const reviewsRes = await fetch(
      `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${appId}/sortBy=mostRecent/json`
    );
    const reviewsData = await reviewsRes.json();
    const pageEntries = reviewsData?.feed?.entry ?? [];

    // Le premier élément du flux RSS est souvent l'info de l'app, pas une review
    const actualReviews = page === 1 ? pageEntries.slice(1) : pageEntries;

    const reviews = actualReviews.map((r: any) => ({
      id: r.id?.label,
      rating: parseInt(r["im:rating"]?.label || "0"),
      title: r.title?.label,
      content: r.content?.label,
      author: r.author?.name?.label,
      date: r.updated?.label
    }));

    return {
      name: appInfo.trackName,
      developer: appInfo.artistName,
      icon: appInfo.artworkUrl100,
      rating: appInfo.averageUserRating,
      reviewsCount: appInfo.userRatingCount,
      reviews: reviews
    };

  } catch (error: any) {
    console.error("❌ Erreur Analyse:", error);
    throw new Error(error.message || "L'analyse a échoué.");
  }
}
