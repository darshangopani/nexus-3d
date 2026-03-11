import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import GeniusLogic from '../components/GeniusLogic';
import ScoutAgent from '../components/ScoutAgent';
import MockTestCreator from '../components/MockTestCreator';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#020813] text-white pt-32 px-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
            Main Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Access your advanced cognitive modeling and real-time derivation tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <Sparkles className="w-8 h-8 text-orange-400" />
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">The "Genius" Logic Engine</h2>
          </div>
          <p className="text-gray-400 mb-12 text-lg max-w-2xl">
            Ask any complex question. Our AI will identify the core principle, select a university perspective, and explain it across three levels of depth.
          </p>
          
          <GeniusLogic />
        </motion.div>

        <ScoutAgent />
        
        <MockTestCreator />
      </div>
    </div>
  );
}
