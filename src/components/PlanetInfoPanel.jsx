import { motion } from 'framer-motion';

const PlanetInfoPanel = ({ planet, onClose }) => {
  if (!planet) return null;

  const dataRows = [
    { label: 'Type', value: planet.type },
    { label: 'Mass', value: planet.mass },
    { label: 'Diameter', value: planet.diameter },
    { label: 'Gravity', value: planet.gravity },
    { label: 'Temperature', value: planet.temperature },
    { label: 'Composition', value: planet.composition },
    { label: 'Orbital Period', value: planet.orbitalPeriod },
    { label: 'Rotation Period', value: planet.rotationPeriod },
    { label: 'Moons', value: planet.moons },
    { label: 'Distance from Sun', value: planet.distanceFromSun }
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-96">
      <div className="relative p-6 pb-0">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at center, rgba(74, 144, 226, 0.3), transparent 70%)' }} />
        <div className="relative flex items-center gap-4">
          <motion.div className="w-16 h-16 rounded-full flex-shrink-0 border-2 border-white/30" style={{ background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.6), rgba(123, 104, 238, 0.3))', boxShadow: '0 0 30px rgba(74, 144, 226, 0.3)' }} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: 'spring', damping: 10 }} />
          <div>
            <motion.h2 className="text-2xl font-bold text-white" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>{planet.name}</motion.h2>
            <motion.p className="text-white/60 text-sm" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>{planet.type}</motion.p>
          </div>
        </div>
      </div>
      <motion.div className="px-6 py-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <p className="text-white/80 text-sm leading-relaxed">{planet.description}</p>
      </motion.div>
      <motion.div className="px-6 py-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="space-y-3">
          {dataRows.map((row, index) => (
            <motion.div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + index * 0.05 }}>
              <span className="text-white/60 text-sm font-medium">{row.label}</span>
              <span className="text-white text-sm font-medium">{row.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.button className="w-full py-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 text-white font-medium transition-all border-t border-white/5" onClick={onClose} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Close
      </motion.button>
    </motion.div>
  );
};

export default PlanetInfoPanel;