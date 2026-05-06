"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, Zap, Database, BarChart3, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { analyzeApp } from "./actions";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState("us");

  const countries = [
    { code: "us", label: "🇺🇸 US" },
    { code: "ca", label: "🇨🇦 CA" },
    { code: "gb", label: "🇬🇧 UK" },
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisData(null);

    try {
      const result = await analyzeApp(url, country);
      setAnalysisData(result);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'analyse.");
    } finally {
      setIsAnalyzing(false);
    }
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

        {/* Country Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex gap-2 mb-6 p-1 rounded-xl glass bg-white/5"
        >
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => setCountry(c.code)}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300
                ${country === c.code 
                  ? "bg-white/10 text-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}
              `}
            >
              {c.label}
            </button>
          ))}
        </motion.div>

        {/* Input Area */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={onSubmit}
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

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real Analysis Result */}
        <AnimatePresence>
          {analysisData && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 w-full max-w-2xl p-6 rounded-2xl glass border-orange-500/20 bg-orange-500/5 text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center text-2xl">
                    {analysisData.icon ? (
                      <img src={analysisData.icon} alt={analysisData.name} className="w-full h-full object-cover" />
                    ) : (
                      "🍎"
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-100">{analysisData.name}</h3>
                    <p className="text-sm text-zinc-500">{analysisData.developer}</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
                  Success
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Gemini Insight</span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed italic">"{analysisData.topInsight}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-green-500/70 uppercase tracking-widest pl-1">Strengths</span>
                    {analysisData.pros?.map((pro: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        {pro}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest pl-1">Weaknesses</span>
                    {analysisData.cons?.map((con: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-zinc-300">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        {con}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Recommendation</span>
                  </div>
                  <p className="text-sm text-zinc-300">{analysisData.recommendation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-zinc-500 uppercase">AI Sentiment</span>
                    <p className="text-lg font-bold text-orange-400 mt-1">{analysisData.sentimentScore}% Positive</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-zinc-500 uppercase">Avg. Rating</span>
                    <p className="text-lg font-bold text-zinc-100 mt-1">{analysisData.rating} ★</p>
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
