/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from '@react-three/fiber';
import { Environment, Float, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'motion/react';
import BlackHoleKinetix from './components/BlackHoleKinetix';
import GeniusLogic from './components/GeniusLogic';
import ScoutAgent from './components/ScoutAgent';
import MockTestCreator from './components/MockTestCreator';
import PricingTiers from './components/PricingTiers';
import AdsterraAd from './components/AdsterraAd';
import { Sparkles, BrainCircuit, GraduationCap, Layers } from 'lucide-react';

export default function App() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <BlackHoleKinetix />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Hero Section */}
        <motion.section 
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ y, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              NEXUS 3D
            </h1>
            <p className="text-xl md:text-3xl font-light text-gray-300 mb-12 tracking-wide">
              The Genius Logic Platform.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <FeatureBadge icon={<BrainCircuit />} text="Chain-of-Thought AI" />
              <FeatureBadge icon={<GraduationCap />} text="University Perspectives" />
              <FeatureBadge icon={<Layers />} text="Multi-Tier Explanations" />
            </div>
          </motion.div>
        </motion.section>

        {/* Adsterra Top Placeholder */}
        <div className="w-full max-w-5xl mx-auto px-6 py-12">
          <AdsterraAd format="728x90" />
        </div>

        {/* Genius Logic Interface */}
        <section className="min-h-screen py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <Sparkles className="w-8 h-8 text-indigo-400" />
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">The "Genius" Logic Engine</h2>
              </div>
              <p className="text-gray-400 mb-12 text-lg max-w-2xl">
                Ask any complex question. Our AI will identify the core principle, select a university perspective, and explain it across three levels of depth.
              </p>
              
              <GeniusLogic />
            </motion.div>

            <ScoutAgent />
            
            <MockTestCreator />

            <PricingTiers />
          </div>
        </section>

        {/* Adsterra Bottom Placeholder */}
        <div className="w-full max-w-5xl mx-auto px-6 py-12">
          <AdsterraAd format="300x250" />
        </div>

        {/* Footer */}
        <footer className="py-12 text-center text-gray-500 border-t border-white/10 mt-24">
          <p className="tracking-widest uppercase text-sm">Nexus 3D © 2026. Open Source Educational Platform.</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
      <span className="text-indigo-400">{icon}</span>
      <span className="font-medium tracking-wide">{text}</span>
    </div>
  );
}
