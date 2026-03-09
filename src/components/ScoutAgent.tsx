import { useState } from 'react';
import { motion } from 'motion/react';
import { FileSearch, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

export default function ScoutAgent() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ difficulty: string; source: string; confidence: number } | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);

    // Simulate scraping and analysis
    setTimeout(() => {
      const difficulties = ['Hard (MIT Standard)', 'Extreme (IIT JEE Advanced Standard)', 'Moderate (Standard University)'];
      const sources = ['MIT OpenCourseWare 2023', 'IIT JEE Advanced 2022', 'Stanford CS229 Notes'];
      
      setResult({
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
      });
      setIsScanning(false);
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-24">
      <div className="backdrop-blur-xl bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <FileSearch className="w-8 h-8 text-pink-400" />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">The "Scout" Agent</h2>
          </div>
          <p className="text-indigo-200/70 mb-8 text-lg">
            Our autonomous agent constantly scrapes past year papers and lecture notes from top universities. Upload or link a paper, and the Scout will analyze its difficulty based on IIT/MIT standards.
          </p>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-xl blur-md" />
              <div className="relative bg-black/40 border border-white/10 rounded-xl p-6 flex items-center justify-center border-dashed">
                <span className="text-gray-400">Drag & Drop Exam Paper (PDF) or Paste URL</span>
              </div>
            </div>
            
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full md:w-auto px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  Run Scout Analysis
                </>
              )}
            </button>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-black/40 border border-white/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Detected Source</div>
                <div className="text-lg font-medium text-white">{result.source}</div>
              </div>
              <div className="h-px w-full md:w-px md:h-12 bg-white/10" />
              <div>
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Difficulty Rating</div>
                <div className={`text-lg font-bold ${result.difficulty.includes('Extreme') ? 'text-pink-400' : result.difficulty.includes('Hard') ? 'text-indigo-400' : 'text-emerald-400'}`}>
                  {result.difficulty}
                </div>
              </div>
              <div className="h-px w-full md:w-px md:h-12 bg-white/10" />
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Confidence</div>
                  <div className="text-lg font-medium text-white">{result.confidence}%</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
