"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, Zap, Database, BarChart3, CheckCircle2, XCircle, Lightbulb, Copy, Check, Star } from "lucide-react";
import { analyzeApp } from "./actions";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState("us");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCopyingAll, setIsCopyingAll] = useState(false);

  const countries = [
    { code: "us", label: "🇺🇸 US" },
    { code: "ca", label: "🇨🇦 CA" },
    { code: "gb", label: "🇬🇧 UK" },
  ];

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllReviews = async () => {
    if (!analysisData?.reviews) return;
    
    const formattedReviews = analysisData.reviews
      .map((r: any) => `--- \nRating: ${r.rating}/5\nTitle: ${r.title}\nContent: ${r.content}\n---`)
      .join("\n\n");
    
    await navigator.clipboard.writeText(formattedReviews);
    setIsCopyingAll(true);
    setTimeout(() => setIsCopyingAll(false), 2000);
  };

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

        {/* Analysis Result - Reviews List */}
        <AnimatePresence mode="wait">
          {analysisData && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 w-full max-w-4xl text-left"
            >
              {/* App Info Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-6 rounded-2xl glass border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden shadow-2xl flex-shrink-0">
                    <img src={analysisData.icon} alt={analysisData.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">{analysisData.name}</h2>
                    <p className="text-zinc-500 font-medium">{analysisData.developer}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {analysisData.rating?.toFixed(1)}
                      </div>
                      <span className="text-zinc-600 text-xs">•</span>
                      <span className="text-zinc-500 text-xs font-medium">{analysisData.reviews?.length || 0} reviews fetched</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={copyAllReviews}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-bold text-sm hover:bg-white/10 hover:text-white transition-all active:scale-95"
                >
                  {isCopyingAll ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      All Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy All Reviews
                    </>
                  )}
                </button>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisData.reviews?.map((review: any) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative p-6 rounded-2xl glass border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? "text-orange-400 fill-current" : "text-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => copyToClipboard(`[${review.rating}/5] ${review.title}: ${review.content}`, review.id)}
                        className="p-2 rounded-lg bg-white/0 group-hover:bg-white/5 text-zinc-600 group-hover:text-zinc-400 transition-all hover:text-white"
                      >
                        {copiedId === review.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <h3 className="font-bold text-zinc-100 mb-2 leading-tight">
                      {review.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                      {review.content}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-zinc-600">
                      <span>{review.author}</span>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
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
