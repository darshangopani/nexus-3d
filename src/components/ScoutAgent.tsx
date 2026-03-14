import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSearch, ShieldAlert, CheckCircle2, Loader2, Globe, BookOpen, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '../utils/config';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface Topic {
  title: string;
  explanation: string;
}

interface ScoutResult {
  difficulty: string;
  source: string;
  confidence: number;
  topics: Topic[];
}

export default function ScoutAgent() {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ScoutResult | null>(null);

  const handleScan = async () => {
    if (!url.trim()) return;
    
    setIsScanning(true);
    setResult(null);

    try {
      const prompt = `
        You are the "Scout Agent", an autonomous intelligence that analyzes educational resources, notes, and exam papers.
        The user has provided a URL: "${url}"
        
        Analyze this URL (or the resource it likely points to) and provide a detailed scouting report EXACTLY in the following JSON format:
        {
          "difficulty": "e.g., Extreme (IIT JEE Advanced Standard)",
          "source": "e.g., MIT OpenCourseWare 2023",
          "confidence": 95,
          "topics": [
            {
              "title": "Topic Name",
              "explanation": "A concise but thorough explanation of why this topic is important in this resource and what it covers."
            },
            ...
          ]
        }
        
        Identify at least 3-5 important topics. Provide meaningful explanations for each.
        Respond ONLY with the JSON.
      `;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = res.text || '{}';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(cleanJson);
      
      const scoutData: ScoutResult = {
        difficulty: analysis.difficulty || 'Moderate (Standard)',
        source: analysis.source || 'Unknown Source',
        confidence: analysis.confidence || 85,
        topics: analysis.topics || []
      };

      setResult(scoutData);

      // Persist to Supabase
      if (user) {
        const topicsMd = scoutData.topics.map(t => `#### ${t.title}\n${t.explanation}`).join('\n\n');
        await supabase.from('history').insert({
          user_id: user.id,
          query: `Detailed Scout Analysis: ${url}`,
          response: `### Scout Report\n- **Source**: ${scoutData.source}\n- **Difficulty**: ${scoutData.difficulty}\n- **Confidence**: ${scoutData.confidence}%\n\n### Important Topics\n${topicsMd}`,
          q_type: 'custom'
        });
      }

    } catch (error) {
      console.error("Scout analysis error:", error);
      setResult(null);
    } finally {
      setIsScanning(false);
    }
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
            Detect core concepts and difficulty levels in any educational resource. Paste a URL below to extract key topics and explanations.
          </p>

          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded-2xl blur opacity-75 group-focus-within:opacity-100 transition duration-1000" />
              <div className="relative flex items-center bg-black/60 rounded-xl overflow-hidden border border-white/10">
                <div className="pl-6 text-gray-400">
                  <Globe className="w-5 h-5" />
                </div>
                <input 
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste URL (MIT OCW, Khan Academy, PDF links...)"
                  className="w-full bg-transparent border-none py-6 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
                />
              </div>
            </div>
            
            <button
              onClick={handleScan}
              disabled={isScanning || !url.trim()}
              className="relative overflow-hidden group/btn w-full px-8 py-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
              <span className="relative z-10 flex items-center gap-3">
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Extracting Intelligence...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5" />
                    Perform Deep Scouting Analysis
                  </>
                )}
              </span>
            </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 space-y-8"
              >
                {/* High Level Summary Card */}
                <div className="p-6 bg-black/40 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">Source Intel</div>
                    <div className="text-lg font-medium text-white">{result.source}</div>
                  </div>
                  <div className="relative z-10 h-px w-full md:w-px md:h-12 bg-white/10" />
                  <div className="relative z-10">
                    <div className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">Hardness Rank</div>
                    <div className={`text-lg font-bold ${result.difficulty.includes('Extreme') ? 'text-red-400' : 'text-orange-400'}`}>
                      {result.difficulty}
                    </div>
                  </div>
                  <div className="relative z-10 h-px w-full md:w-px md:h-12 bg-white/10" />
                  <div className="relative z-10 flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">Scout Confidence</div>
                      <div className="text-lg font-medium text-white">{result.confidence}%</div>
                    </div>
                  </div>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 mb-2 px-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <h3 className="text-xl font-medium text-orange-100">Core Concepts Extracted</h3>
                  </div>
                  {result.topics.map((topic, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] hover:border-orange-500/20 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">
                            {topic.title}
                          </h4>
                          <p className="text-gray-400 leading-relaxed">
                            {topic.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
