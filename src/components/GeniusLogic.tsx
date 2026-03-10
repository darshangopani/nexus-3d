import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function GeniusLogic() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const prompt = `
You are the "Genius Logic Engine". The user will ask a question or provide a topic.
You must use a Chain-of-Thought (CoT) structure and respond EXACTLY in the following format using Markdown:

## 1. Core Principle
[Identify and briefly explain the core principle of the topic, e.g., Quantum Entanglement, Thermodynamics, etc.]

## 2. University Perspective
[Select a specific university perspective (e.g., MIT's focus on mathematical derivation vs. Harvard's focus on conceptual theory) and explain how they approach this topic.]

## 3. Explanations

### Basic (ELI5)
[Explain the topic as if the user is 5 years old. Use simple analogies.]

### Intermediate (University Level)
[Explain the topic at an undergraduate university level. Introduce key terms and standard concepts.]

### Advanced (Research Level)
[Explain the topic at a cutting-edge research level. Discuss current challenges, advanced theories, or mathematical frameworks.]

User Query: "${query}"
      `;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResponse(res.text || 'No response generated.');
    } catch (error) {
      console.error('Error generating content:', error);
      setResponse('An error occurred while generating the response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative mb-12 group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-[2rem] blur-xl transition duration-1000 ${isLoading ? 'opacity-100 animate-pulse' : 'opacity-50 group-hover:opacity-100 group-hover:duration-200'}`} />
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about Quantum Mechanics, String Theory, Neural Networks..."
            className="w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl py-6 pl-8 pr-24 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all shadow-2xl"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 p-4 bg-white text-black hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 rounded-3xl blur-lg" />
            <div className="relative prose prose-invert prose-lg max-w-none prose-headings:text-orange-300 prose-a:text-amber-400 bg-black/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none" />
              <div className="relative z-10">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
