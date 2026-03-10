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
      <div className="backdrop-blur-xl bg-orange-950/20 border border-orange-500/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <FileSearch className="w-8 h-8 text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">The "Scout" Agent</h2>
          </div>
          <p className="text-orange-200/70 mb-8 text-lg">
            Our autonomous agent constantly scrapes past year papers and lecture notes from top universities. Upload or link a paper, and the Scout will analyze its difficulty based on IIT/MIT standards.
          </p>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl blur-md" />
              <div className="relative bg-black/40 border-2 border-white/10 hover:border-orange-500/50 rounded-xl p-8 flex flex-col items-center justify-center border-dashed transition-all group cursor-pointer overflow-hidden">
                {isScanning && (
                  <div className="absolute left-0 right-0 h-1 bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,1)] animate-[scan_2s_ease-in-out_infinite] z-0" />
                )}
                <div className="relative z-10 p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <FileSearch className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors" />
                </div>
                <span className="relative z-10 text-gray-400 group-hover:text-white transition-colors font-medium">Drag & Drop Exam Paper (PDF) or Paste URL</span>
              </div>
            </div>
            
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="relative overflow-hidden group/btn w-full md:w-auto px-8 py-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
              <span className="relative z-10 flex items-center gap-3">
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
              </span>
            </button>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-black/40 border border-white/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-orange-500/30 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Detected Source</div>
                <div className="text-lg font-medium text-white">{result.source}</div>
              </div>
              <div className="relative z-10 h-px w-full md:w-px md:h-12 bg-white/10" />
              <div className="relative z-10">
                <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Difficulty Rating</div>
                <div className={`text-lg font-bold ${result.difficulty.includes('Extreme') ? 'text-red-400' : result.difficulty.includes('Hard') ? 'text-orange-400' : 'text-amber-400'}`}>
                  {result.difficulty}
                </div>
              </div>
              <div className="relative z-10 h-px w-full md:w-px md:h-12 bg-white/10" />
              <div className="relative z-10 flex items-center gap-3">
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
