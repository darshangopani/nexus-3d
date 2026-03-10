import { motion } from 'motion/react';
import { Info, Users, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#020813] text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
            About Nexus 3D
          </h1>
          
          <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
            <p>
              Nexus 3D is a Genius Logic Platform designed to provide advanced cognitive modeling, real-time derivations, and elite university perspectives.
            </p>
            <p>
              Our mission is to democratize access to high-level academic and professional reasoning, breaking down complex topics into understandable, actionable insights.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <Info className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                <p className="text-sm text-gray-400">To create the world's most advanced cognitive reasoning engine.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <Users className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Community</h3>
                <p className="text-sm text-gray-400">Built for scholars, researchers, and professionals worldwide.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <Globe className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Global Impact</h3>
                <p className="text-sm text-gray-400">Empowering decisions with data-driven, logical derivations.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
