import { motion } from 'motion/react';

interface AdsterraAdProps {
  format: '728x90' | '300x250' | '160x600';
}

export default function AdsterraAd({ format }: AdsterraAdProps) {
  // In a real implementation, this would contain the Adsterra script tags
  // For the open-source platform, we provide a placeholder where users can inject their Adsterra API keys/scripts.
  
  const dimensions = {
    '728x90': 'w-full max-w-[728px] h-[90px]',
    '300x250': 'w-[300px] h-[250px]',
    '160x600': 'w-[160px] h-[600px]',
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`mx-auto ${dimensions[format]} bg-white/5 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-gray-500 relative overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="font-mono text-sm tracking-widest uppercase mb-2">Adsterra Ad Space</span>
      <span className="font-mono text-xs opacity-50">{format}</span>
      <div className="absolute bottom-2 right-2 text-[10px] uppercase tracking-wider opacity-30">
        Insert Script Here
      </div>
    </motion.div>
  );
}
