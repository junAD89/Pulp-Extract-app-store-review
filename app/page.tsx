"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, Zap, Database, BarChart3 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);



  const handleAnalyze = async (url: string) => {
    // 1. Extraire l'ID depuis le lien
    const match = url.match(/id(\d+)/);
    if (!match) throw new Error("Lien invalide");
    const appId = match[1];

    // 2. Fetch les reviews iTunes API
    const reviewsRes = await fetch(
      `https://itunes.apple.com/us/rss/customerreviews/id=${appId}/sortBy=mostRecent/json`
    );
    const reviewsData = await reviewsRes.json();
    const reviews = reviewsData?.feed?.entry ?? [];

    // 3. Fetch les metadata de l'app
    const metaRes = await fetch(
      `https://itunes.apple.com/lookup?id=${appId}`
    );
    const metaData = await metaRes.json();
    const appInfo = metaData?.results?.[0];

    // 4. Formater les reviews pour Claude
    const reviewsText = reviews
      .slice(1) // le premier entry est l'app elle-même, pas une review
      .map((r: any) => `[${r["im:rating"]?.label}★] ${r.title?.label}: ${r.content?.label}`)
      .join("\n");



  };
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="grainy" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-orange-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation / Logo */}
      <nav className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg pulp-gradient flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="text-black w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">pulp</span>
        </div>
        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          <a href="#" className="hover:text-white transition-colors">Changelog</a>
        </div>
        <button className="px-5 py-2 rounded-full glass text-sm font-medium hover:bg-white/5 transition-colors">
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
            Extract what matters
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 gradient-text"
        >
          The juice of the <br />
          <span className="text-orange-500">App Store</span>, distilled.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed"
        >
          Paste any App Store link and let Pulp extract sentiment, feature requests,
          and competitive insights in seconds.
        </motion.p>

        {/* Input Area */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleAnalyze}
          className="w-full max-w-2xl group relative"
        >
          <div className="relative flex items-center p-2 rounded-2xl glass transition-all duration-300 group-focus-within:ring-2 ring-orange-500/20 group-focus-within:border-orange-500/30">
            <div className="pl-4 pr-3 text-zinc-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Paste App Store link (e.g. apps.apple.com/...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 py-4"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !url}
              className="pulp-gradient px-6 py-3 rounded-xl text-black font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isAnalyzing ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Analyze
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Progress Bar (Visible when analyzing) */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3, ease: "linear" }}
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange-500 origin-left rounded-full z-10"
              />
            )}
          </AnimatePresence>
        </motion.form>

        {/* Mock Analysis Result */}
        <AnimatePresence>
          {url && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 w-full max-w-2xl p-6 rounded-2xl glass border-orange-500/20 bg-orange-500/5 text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl">
                    🍎
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-100">App Name (Mock)</h3>
                    <p className="text-sm text-zinc-500">Developer Name</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
                  Success
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Top Insight</span>
                  <p className="text-sm text-zinc-300 mt-1">Users are reporting a bug in the latest version related to the login screen on iOS 17.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-zinc-500 uppercase">Sentiment</span>
                    <p className="text-lg font-bold text-orange-400 mt-1">84% Positive</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-zinc-500 uppercase">Avg. Rating</span>
                    <p className="text-lg font-bold text-zinc-100 mt-1">4.8 ★</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full text-left"
        >
          <FeatureCard
            icon={<Database className="w-5 h-5 text-orange-400" />}
            title="Metadata Extraction"
            description="Get version history, ratings, and developer details instantly."
          />
          <FeatureCard
            icon={<BarChart3 className="w-5 h-5 text-orange-400" />}
            title="Sentiment Analysis"
            description="Understand what users love and what they hate about any app."
          />
          <FeatureCard
            icon={<Sparkles className="w-5 h-5 text-orange-400" />}
            title="Feature Discovery"
            description="Automatically identify requested features from user reviews."
          />
        </motion.div>
      </main>

      <footer className="mt-auto py-12 text-zinc-600 text-sm">
        &copy; 2026 Pulp. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl glass hover:bg-white/[0.05] transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold mb-2 text-zinc-200">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
