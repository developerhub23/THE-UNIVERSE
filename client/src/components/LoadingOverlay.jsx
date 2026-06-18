import { motion } from 'framer-motion';

const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="relative w-32 h-32 mb-8" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
        {[1, 2, 3].map((i) => (
          <motion.div key={i} className="absolute rounded-full border border-white/10" style={{ width: `${80 + i * 20}px`, height: `${80 + i * 20}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} animate={{ rotate: -360 }} transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }} />
        ))}
        <motion.div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg shadow-blue-500/50" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <motion.div className="absolute w-24 h-24 rounded-full bg-blue-500/20 blur-xl" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.div>
      <motion.p className="text-white/80 text-lg font-medium mb-4" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>{message}</motion.p>
    </motion.div>
  );
};

export default LoadingOverlay;