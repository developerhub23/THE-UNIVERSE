import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ activeView, onViewChange }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'solar', label: 'Solar System' },
    { id: 'earth', label: 'Earth Explorer' },
    { id: 'news', label: 'Space News' },
    { id: 'ai', label: 'AI Guide' }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav className="fixed top-0 left-0 right-0 z-50" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
        <div className={`flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-black/20 backdrop-blur-2xl border-b border-white/10' : 'bg-transparent'}`}>
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">THE UNIVERSE</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <motion.button key={item.id} onClick={() => onViewChange(item.id)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeView === item.id ? 'bg-white/10 text-white border border-white/20' : 'text-white/70 hover:text-white hover:bg-white/5'}`} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>{item.label}</motion.button>
            ))}
          </div>
          <motion.button className="md:hidden p-2 rounded-lg text-white hover:bg-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} whileTap={{ scale: 0.9 }}>{mobileMenuOpen ? '×' : '☰'}</motion.button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)}>
            <motion.div className="absolute top-20 left-6 right-6 bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              {navItems.map((item, index) => (
                <motion.button key={item.id} onClick={() => { onViewChange(item.id); setMobileMenuOpen(false); }} className={`w-full py-4 rounded-xl text-left text-lg font-medium transition-all ${activeView === item.id ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'}`} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}>{item.label}</motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;