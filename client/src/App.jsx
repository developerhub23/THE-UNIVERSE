import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import SolarSystem from './components/SolarSystem';
import EarthExplorer from './components/EarthExplorer';
import SpaceNews from './components/SpaceNews';
import AIChat from './components/AIChat';

const App = () => {
  const [activeView, setActiveView] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  const handleViewChange = useCallback((view) => {
    setIsLoading(true);
    setActiveView(view);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'solar': return <SolarSystem />;
      case 'earth': return <EarthExplorer />;
      case 'news': return <SpaceNews />;
      case 'ai': return <AIChat />;
      default: return (
        <motion.div className="min-h-screen flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/50" />
          <motion.div className="relative z-10 text-center px-6" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <motion.h1 className="text-5xl md:text-7xl font-bold text-white mb-6" style={{ textShadow: '0 0 30px rgba(74, 144, 226, 0.3), 0 0 60px rgba(123, 104, 238, 0.3)' }}>
              THE UNIVERSE
            </motion.h1>
            <motion.p className="text-xl md:text-2xl text-white/70 mb-4 max-w-2xl mx-auto" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.5 }}>
              Explore Everything. From Earth to Infinity.
            </motion.p>
            <motion.p className="text-lg text-white/50 mb-12 max-w-xl mx-auto" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.6 }}>
              A NASA-level 3D space exploration experience featuring a realistic solar system, interactive Earth globe, live space news, and AI-powered guidance.
            </motion.p>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.7 }}>
              {[{ id: 'solar', title: 'Solar System', icon: '🌍' }, { id: 'earth', title: 'Earth Explorer', icon: '🌎' }, { id: 'news', title: 'Space News', icon: '📰' }, { id: 'ai', title: 'AI Guide', icon: '🤖' }].map((feature, index) => (
                <motion.button key={feature.id} onClick={() => handleViewChange(feature.id)} whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + index * 0.1 }} className="group relative overflow-hidden rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 p-6 transition-all hover:border-white/30">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}>{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm">Explore {feature.title}</p>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)' }} />
      <Navbar activeView={activeView} onViewChange={handleViewChange} />
      <AnimatePresence mode="wait">
        <motion.main key={activeView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
          {renderView()}
        </motion.main>
      </AnimatePresence>
      {isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-blue-500 animate-spin" />
        </motion.div>
      )}
    </div>
  );
};

export default App;