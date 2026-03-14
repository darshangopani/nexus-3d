import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ADSTERRA_KEY } from '../utils/config';

interface AdsterraAdProps {
  format: '728x90' | '300x250' | '160x600';
}

export default function AdsterraAd({ format }: AdsterraAdProps) {
  useEffect(() => {
    if (!ADSTERRA_KEY) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//www.profitabledisplaynetwork.com/${ADSTERRA_KEY}/invoke.js`;
    
    // Inject at the end of the body
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const dimensions = {
    '728x90': 'w-full max-w-[728px] h-[90px]',
    '300x250': 'w-[300px] h-[250px]',
    '160x600': 'w-[160px] h-[600px]',
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`mx-auto ${dimensions[format]} bg-black/20 border border-white/5 rounded-xl flex items-center justify-center text-gray-600 overflow-hidden relative`}
    >
      <div id={`container-${ADSTERRA_KEY}`} className="relative z-10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-20">Secure Ad Network Active</span>
      </div>
    </motion.div>
  );
}
