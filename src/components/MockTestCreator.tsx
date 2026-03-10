import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileQuestion, Loader2, Settings2, CheckCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function MockTestCreator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate (University Level)');
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [mockTest, setMockTest] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setMockTest(null);

    try {
      const prompt = `
You are the "Nexus Mock Test Generator", an expert academic evaluator.
Generate a rigorous mock test based on the following parameters:
- Topic: ${topic}
- Difficulty Level: ${difficulty}
- Number of Questions: ${questionCount}

Format the output EXACTLY as follows using Markdown:

# Mock Test: ${topic}
**Difficulty:** ${difficulty} | **Questions:** ${questionCount}

---

## Questions
[List the questions here. Use a mix of multiple-choice and short-answer questions if appropriate for the difficulty. For "Extreme (IIT/MIT)" difficulty, include complex analytical or mathematical problems.]

---

## Answer Key & Explanations
[Provide the correct answers and a brief, high-yield explanation for each.]
      `;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setMockTest(res.text || 'Failed to generate mock test.');
    } catch (error) {
      console.error('Error generating mock test:', error);
      setMockTest('An error occurred while generating the mock test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <FileQuestion className="w-8 h-8 text-orange-400" />
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Mock Test Generator</h2>
        </div>
        <p className="text-gray-400 mb-12 text-lg max-w-2xl">
          Instantly generate custom mock tests for any subject. Tailor the difficulty from basic concepts to extreme IIT/MIT standards.
        </p>

        <form onSubmit={handleGenerate} className="space-y-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Topic / Subject</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Organic Chemistry, Linear Algebra..."
                className="w-full bg-black/60 backdrop-blur-xl border border-white/10 hover:border-orange-500/30 rounded-xl py-4 px-6 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
                required
              />
            </div>
            
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Difficulty</label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-black/60 backdrop-blur-xl border border-white/10 hover:border-orange-500/30 rounded-xl py-4 px-6 text-lg text-white appearance-none focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
                >
                  <option value="Basic (High School)">Basic (High School)</option>
                  <option value="Intermediate (University Level)">Intermediate (University Level)</option>
                  <option value="Advanced (Research/Grad)">Advanced (Research/Grad)</option>
                  <option value="Extreme (IIT JEE / MIT Standard)">Extreme (IIT JEE / MIT Standard)</option>
                </select>
                <Settings2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
                className="w-full bg-black/60 backdrop-blur-xl border border-white/10 hover:border-orange-500/30 rounded-xl py-4 px-6 text-lg text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="relative overflow-hidden group/btn w-full py-5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
            <span className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Test...
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Create Mock Test
                </>
              )}
            </span>
          </button>
        </form>

        <AnimatePresence mode="wait">
          {mockTest && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative prose prose-invert prose-lg max-w-none prose-headings:text-orange-300 prose-a:text-amber-400 bg-black/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none" />
              <div className="relative z-10">
                <ReactMarkdown>{mockTest}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
