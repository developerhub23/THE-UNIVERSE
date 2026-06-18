import { motion } from 'framer-motion';

const CountryInfoCard = ({ country, onClose }) => {
  if (!country) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 w-80">
      <div className="relative p-6 pb-0">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at center, rgba(123, 104, 238, 0.3), transparent 70%)' }} />
        <div className="relative flex items-center gap-4">
          <motion.div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl border-2 border-white/30" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: 'spring', damping: 10 }}>
            🌍
          </motion.div>
          <div>
            <motion.h2 className="text-xl font-bold text-white" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>{country.name}</motion.h2>
            <motion.p className="text-white/60 text-sm" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>{country.capital}</motion.p>
          </div>
        </div>
      </div>
      <motion.div className="px-6 py-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="grid grid-cols-2 gap-3">
          {country.population && <div className="bg-white/5 rounded-lg p-3"><div className="text-white/60 text-xs font-medium mb-1">Population</div><div className="text-white text-sm font-medium">{country.population}</div></div>}
          {country.area && <div className="bg-white/5 rounded-lg p-3"><div className="text-white/60 text-xs font-medium mb-1">Area</div><div className="text-white text-sm font-medium">{country.area}</div></div>}
        </div>
      </motion.div>
      <motion.button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all" onClick={onClose} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Close
      </motion.button>
    </motion.div>
  );
};

export default CountryInfoCard;