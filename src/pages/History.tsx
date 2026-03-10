import { motion } from 'motion/react';
import { Clock, Search, ArrowRight } from 'lucide-react';

export default function History() {
  const mockHistory = [
    { id: 1, query: "Explain Quantum Entanglement", date: "2 hours ago", type: "Physics" },
    { id: 2, query: "Derive the Navier-Stokes equations", date: "Yesterday", type: "Mathematics" },
    { id: 3, query: "Analyze the economic impact of AGI", date: "3 days ago", type: "Economics" },
  ];

  return (
    <div className="min-h-screen bg-[#020813] text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            Query History
          </h1>

          <div className="space-y-4">
            {mockHistory.map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">{item.type}</span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">{item.query}</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
