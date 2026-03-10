import { motion } from 'motion/react';
import FeatureGrid from '../components/FeatureGrid';

export default function Features() {
  return (
    <div className="min-h-screen bg-[#020813] text-white pt-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
            Platform Features
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore the advanced capabilities of the Genius Logic Engine.
          </p>
        </motion.div>
        
        <FeatureGrid />
      </div>
    </div>
  );
}
