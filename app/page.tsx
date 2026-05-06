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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
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
    setCurrentPage(1);

    try {
      const result = await analyzeApp(url, country, 1);
      setAnalysisData(result);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'analyse.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadMore = async () => {
    if (!url || isLoadingMore) return;
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);

    try {
      const result = await analyzeApp(url, country, nextPage);
      setAnalysisData((prev: any) => ({
        ...prev,
        reviews: [...(prev.reviews || []), ...(result.reviews || [])]
      }));
      setCurrentPage(nextPage);
    } catch (err: any) {
      setError("Erreur lors du chargement des avis suivants.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const jumpToPage = async (pageNum: number) => {
    if (!url || isAnalyzing) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeApp(url, country, pageNum);
      setAnalysisData(result);
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(`Erreur lors du chargement de la page ${pageNum}.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePageSelection = (p: number) => {
    setSelectedPages(prev =>
      prev.includes(p) ? prev.filter(page => page !== p) : [...prev, p].sort((a, b) => a - b)
    );
  };

  const bulkExport = async () => {
    if (!url || selectedPages.length === 0) return;
    setIsBulkLoading(true);

    try {
      const allResults = await Promise.all(
        selectedPages.map(p => analyzeApp(url, country, p))
      );

      const allReviews = allResults.flatMap(res => res.reviews || []);
      const formattedReviews = allReviews
        .map((r: any) => `--- \nRating: ${r.rating}/5\nTitle: ${r.title}\nContent: ${r.content}\n---`)
        .join("\n\n");

      await navigator.clipboard.writeText(formattedReviews);
      setIsCopyingAll(true);
      setTimeout(() => setIsCopyingAll(false), 2000);
      setShowBulkModal(false);
    } catch (err: any) {
      setError("Erreur lors de l'exportation massive.");
    } finally {
      setIsBulkLoading(false);
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
              {isAnalyzing && !analysisData ? (
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
            <div className="relative w-full max-w-6xl mt-12">
              {/* Fixed Pagination Sidebar */}
              <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-2 z-30">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 text-center">Page</p>
                {[...Array(10)].map((_, i) => {
                  const p = i + 1;
                  const isSelected = selectedPages.includes(p);
                  return (
                    <div key={p} className="flex items-center gap-2">
                      <button
                        onClick={() => jumpToPage(p)}
                        className={`
                          w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                          ${currentPage === p 
                            ? "pulp-gradient text-black shadow-lg shadow-orange-500/20 scale-110" 
                            : "glass text-zinc-500 hover:text-zinc-200 hover:bg-white/10"}
                        `}
                      >
                        {p}
                      </button>
                      <button 
                        onClick={() => togglePageSelection(p)}
                        className={`w-3 h-3 rounded-full border transition-all ${isSelected ? "bg-orange-500 border-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "border-zinc-700 hover:border-zinc-500"}`}
                      />
                    </div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl mx-auto text-left lg:pl-12"
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
                        <span className="text-zinc-500 text-xs font-medium">Page {currentPage} active</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBulkModal(true)}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass border-white/10 text-zinc-400 font-bold text-sm hover:bg-white/10 hover:text-white transition-all active:scale-95"
                    >
                      <Database className="w-4 h-4" />
                      Bulk Export
                      {selectedPages.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-md bg-orange-500 text-black text-[10px]">
                          {selectedPages.length}
                        </span>
                      )}
                    </button>

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
                          Copy All ({analysisData.reviews?.length})
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisData.reviews?.map((review: any, idx: number) => (
                    <motion.div
                      key={`${review.id}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (idx % 10) * 0.05 }}
                      className="group relative p-6 rounded-2xl glass border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < review.rating ? "text-orange-400 fill-current" : "text-zinc-800"
                                }`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => copyToClipboard(`[${review.rating}/5] ${review.title}: ${review.content}`, review.id + idx)}
                          className="p-2 rounded-lg bg-white/0 group-hover:bg-white/5 text-zinc-600 group-hover:text-zinc-400 transition-all hover:text-white"
                        >
                          {copiedId === review.id + idx ? (
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

                {/* Load More Button */}
                <div className="mt-12 flex justify-center pb-24">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl glass border-white/10 text-zinc-300 font-bold hover:bg-white/5 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Load Next 50 Reviews
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Hero Loading State (Initial Search) */}
        {isAnalyzing && !analysisData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto" />
            <p className="text-zinc-500 text-xs mt-4 font-medium uppercase tracking-widest">Squeezing the reviews...</p>
          </motion.div>
        )}

        {/* Feature Grid - Hidden when results are shown */}
        {!analysisData && !isAnalyzing && (
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
        )}
      </main>

      {/* Bulk Export Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md p-8 rounded-3xl glass border-white/10 bg-zinc-900 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">Bulk Export</h2>
              <p className="text-zinc-500 text-sm mb-8">Select the pages you want to export. Each page contains 50 reviews.</p>
              
              <div className="grid grid-cols-5 gap-3 mb-8">
                {[...Array(10)].map((_, i) => {
                  const p = i + 1;
                  const isSelected = selectedPages.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => togglePageSelection(p)}
                      className={`
                        h-12 rounded-xl flex items-center justify-center font-bold transition-all
                        ${isSelected 
                          ? "pulp-gradient text-black scale-105" 
                          : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200"}
                      `}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl glass border-white/5 text-zinc-500 font-bold hover:text-zinc-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={bulkExport}
                  disabled={selectedPages.length === 0 || isBulkLoading}
                  className="flex-[2] pulp-gradient px-6 py-4 rounded-2xl text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isBulkLoading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy {selectedPages.length * 50} Reviews
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
