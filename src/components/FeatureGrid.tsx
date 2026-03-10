import { motion } from 'motion/react';
import { Shield, Zap, Globe, Cpu, Lock, Network } from 'lucide-react';

const features = [
  {
    title: 'Quantum Processing',
    desc: 'Real-time derivation and synthesis of complex academic concepts using our proprietary multi-tiered logic engine.',
    icon: <Cpu className="w-6 h-6 text-orange-400" />,
    className: 'md:col-span-2 md:row-span-2 bg-gradient-to-br from-orange-900/20 to-amber-900/20 group',
  },
  {
    title: 'Private Enclave',
    desc: 'Military-grade encryption for your intellectual property and research data.',
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    className: 'md:col-span-1 md:row-span-1 bg-white/[0.02] group',
  },
  {
    title: 'Neural Sync',
    desc: 'Adaptive learning paths tailored to your unique cognitive profile and goals.',
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    className: 'md:col-span-1 md:row-span-1 bg-white/[0.02] group',
  },
  {
    title: 'Global Network',
    desc: 'Connect with top-tier academic nodes worldwide for collaborative research.',
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    className: 'md:col-span-1 md:row-span-1 bg-white/[0.02] group',
  },
  {
    title: 'Zero-Trust Architecture',
    desc: 'Absolute privacy and security for your most sensitive academic endeavors.',
    icon: <Lock className="w-6 h-6 text-rose-400" />,
    className: 'md:col-span-1 md:row-span-1 bg-white/[0.02] group',
  },
  {
    title: 'Distributed Nodes',
    desc: 'Decentralized processing power ensuring 99.99% uptime for your critical tasks.',
    icon: <Network className="w-6 h-6 text-cyan-400" />,
    className: 'md:col-span-2 md:row-span-1 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 group',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Exclusive Infrastructure
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Built for the top 1%. A private domain equipping you with unparalleled cognitive tools.
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-[2rem] border border-white/5 p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] ${feature.className}`}
          >
            {/* Subtle inner glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/[0.03] group-hover:to-transparent transition-all duration-500 pointer-events-none" />
            
            {/* Dot grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl w-fit mb-auto border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-xl">
                {feature.icon}
              </div>
              <div className="transform transition-transform duration-500 group-hover:translate-x-2">
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
