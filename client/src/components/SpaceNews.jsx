import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpaceNews } from '../hooks/useSpaceNews';

const SpaceNews = () => {
  const { news, loading } = useSpaceNews(12, true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const truncateText = (text, length = 100) => {
    return text?.length > length ? text.substring(0, length) + '...' : text;
  };

  if (loading && news.length === 0) return <div className="p-6 text-white">Loading space news...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/50 to-blue-900/50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-2xl border-b border-white/10 px-6 py-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Space News</h1>
                <p className="text-white/60 text-sm">Latest updates from across the universe</p>
              </div>
            </div>
            <motion.button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg border border-white/20 transition-all flex items-center gap-2" onClick={() => window.location.reload()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </motion.button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {!selectedArticle ? (
            <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {news.map((article, index) => (
                <motion.div key={article.id || index} onClick={() => setSelectedArticle(article)} whileHover={{ y: -5, scale: 1.02 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="group cursor-pointer bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20">
                  {article.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full mb-2">{article.news_site || 'Space News'}</span>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400">{article.title}</h3>
                    <p className="text-white/70 text-sm">{truncateText(article.summary || article.description || '', 120)}</p>
                    <p className="text-white/50 text-xs mt-2">{formatDate(article.published_at || article.publishedAt || article.date)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="expanded" className="relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
              <button className="flex items-center gap-2 text-white/80 hover:text-white mb-8" onClick={() => setSelectedArticle(null)}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back to News</button>
              {selectedArticle && (
                <motion.div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                  {selectedArticle.image_url && (
                    <motion.div className="relative h-64 md:h-96 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </motion.div>
                  )}
                  <motion.div className="p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="mb-6">
                      <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-sm rounded-full mb-4">{selectedArticle.news_site || 'Space News'}</span>
                      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedArticle.title}</h1>
                      <p className="text-white/60 text-sm">{formatDate(selectedArticle.published_at || selectedArticle.publishedAt || selectedArticle.date)}</p>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed">{selectedArticle.summary || selectedArticle.description || 'No summary available.'}</p>
                    {selectedArticle.url && (
                      <motion.a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 text-white font-medium rounded-xl border border-white/20 transition-all" whileHover={{ scale: 1.02, x: 5 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                        Read Full Article
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </motion.a>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {selectedArticle && (
        <motion.button className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10 md:hidden" onClick={() => setSelectedArticle(null)} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
          <span className="text-xl">×</span>
        </motion.button>
      )}
    </div>
  );
};

export default SpaceNews;