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
      <form onSubmit={handleSubmit} className="relative mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about Quantum Mechanics, String Theory, Neural Networks..."
          className="w-full bg-black/40 border border-indigo-500/30 rounded-2xl py-6 pl-8 pr-20 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-[0_0_30px_rgba(99,102,241,0.1)]"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="prose prose-invert prose-lg max-w-none prose-headings:text-indigo-300 prose-a:text-pink-400 bg-black/40 p-8 rounded-2xl border border-white/5"
          >
            <ReactMarkdown>{response}</ReactMarkdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
