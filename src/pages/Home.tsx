/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'motion/react';
import RealisticBlackHole from '../components/RealisticBlackHole';
import FeatureGrid from '../components/FeatureGrid';
import GeniusLogic from '../components/GeniusLogic';
import ScoutAgent from '../components/ScoutAgent';
import MockTestCreator from '../components/MockTestCreator';
import { ChevronDown, Sparkles, BrainCircuit, GraduationCap, Layers, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

interface HomeProps {
  onLoginClick: () => void;
}

export default function Home({ onLoginClick }: HomeProps) {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.from('users').select('id').limit(1);
        if (error) {
          console.error("Please check your Supabase configuration: ", error.message);
        }
      } catch (err) {
        console.error("Connection error.", err);
      }
    }
    testConnection();
  }, []);

  return (
    <>
      {/* Noise Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <RealisticBlackHole />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Hero Section */}
        <motion.section 
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20"
          style={{ y, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-5xl flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-widest text-gray-300 uppercase">Secure Domain</span>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
              <h1 className="relative text-7xl md:text-9xl font-bold tracking-tighter mb-6 leading-[0.85]">
                ENTER THE <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 drop-shadow-[0_0_40px_rgba(245,158,11,0.3)]">
                  NEXUS 3D
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl font-light text-gray-400 mb-12 tracking-wide max-w-3xl leading-relaxed">
              The Genius Logic Platform. Advanced cognitive modeling, real-time derivations, and elite university perspectives.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
              {!isLoggedIn ? (
                <button 
                  onClick={onLoginClick}
                  className="relative overflow-hidden group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="relative z-10">Sign In</span>
                  <ArrowRight className="w-5 h-5 relative z-10" />
                </button>
              ) : (
                <a href="/dashboard" className="relative overflow-hidden group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="relative z-10">Access Logic Engine</span>
                  <ArrowRight className="w-5 h-5 relative z-10" />
                </a>
              )}
              <button className="relative overflow-hidden group flex items-center gap-2 bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative z-10">View Documentation</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-12">
              <FeatureBadge icon={<BrainCircuit />} text="Chain-of-Thought AI" />
              <FeatureBadge icon={<GraduationCap />} text="University Perspectives" />
              <FeatureBadge icon={<Layers />} text="Multi-Tier Explanations" />
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">Scroll to Explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6 text-gray-500" />
            </motion.div>
          </motion.div>
        </motion.section>

        <FeatureGrid />

        {/* Genius Logic Interface */}
        <section id="engine" className="min-h-screen py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            {isLoggedIn ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-2xl"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <Sparkles className="w-10 h-10 text-orange-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">You're In</h2>
                <p className="text-gray-400 text-lg max-w-xl mb-8">
                  Head over to your dashboard to access the Genius Logic Engine, Scout Agent, and Mock Test Creator.
                </p>
                <a 
                  href="/dashboard"
                  className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Go to Dashboard
                </a>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-2xl"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <Lock className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Access Required</h2>
                <p className="text-gray-400 text-lg max-w-xl mb-8">
                  The Genius Logic Engine, Scout Agent, and Mock Test Creator are restricted to authenticated users. Please log in to access these tools.
                </p>
                <button 
                  onClick={onLoginClick}
                  className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Log In to Access
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-gray-500 border-t border-white/10 mt-24">
          <p className="tracking-widest uppercase text-sm">Nexus 3D © 2026. Open Source Educational Platform.</p>
        </footer>
      </div>
    </>
  );
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.05 }}
      className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-orange-500/30 transition-all shadow-lg hover:shadow-orange-500/20 cursor-pointer"
    >
      <span className="text-orange-400">{icon}</span>
      <span className="font-medium tracking-wide">{text}</span>
    </motion.div>
  );
}
