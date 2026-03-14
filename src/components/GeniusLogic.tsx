import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Book, GraduationCap, FileText, Search } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { GEMINI_API_KEY } from '../utils/config';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

type Mode = 'concept' | 'university' | 'pdf';

export default function GeniusLogic() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [activeMode, setActiveMode] = useState<Mode>('concept');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      let systemPrompt = '';
      
      if (activeMode === 'concept') {
        systemPrompt = `You are a world-class educator. Provide the BEST and SIMPLEST explanation for the given topic. Focus on clarity and core intuition. Use Markdown.`;
      } else if (activeMode === 'university') {
        systemPrompt = `You are an academic researcher. Explain how top universities (like MIT, IIT, Stanford, Harvard) specifically approach the following topic. Highlight the pedagogical differences. Use Markdown.`;
      } else if (activeMode === 'pdf') {
        systemPrompt = `You are a research librarian. Recommend the best textbooks, research papers, and PDF resources for the following topic. Provide titles and brief descriptions of why they are essential. Use Markdown.`;
      }

      const prompt = `
        ${systemPrompt}
        
        User Query: "${query}"
      `;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const responseText = res.text || 'No response generated.';
      setResponse(responseText);

      if (user && responseText !== 'No response generated.') {
        try {
          await supabase
            .from('history')
            .insert({
              user_id: user.id,
              query: `[${activeMode.toUpperCase()}] ${query.trim()}`,
              response: responseText,
              q_type: 'custom'
            });
        } catch (dbError) {
          console.error('Error saving history to Supabase:', dbError);
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setResponse('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'concept', label: 'Concept Search', icon: Book, placeholder: 'Search any concept...' },
    { id: 'university', label: 'University Intel', icon: GraduationCap, placeholder: 'Search how universities teach...' },
    { id: 'pdf', label: 'PDF Explorer', icon: FileText, placeholder: 'Find textbooks & research PDFs...' },
  ];

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as Mode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-medium ${
              activeMode === tab.id 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative mb-12 group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-[2rem] blur-xl transition duration-1000 ${isLoading ? 'opacity-100 animate-pulse' : 'opacity-50 group-hover:opacity-100 group-hover:duration-200'}`} />
        <div className="relative flex items-center">
          <div className="absolute left-6 text-gray-500">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tabs.find(t => t.id === activeMode)?.placeholder}
            className="w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl py-6 pl-16 pr-24 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all shadow-2xl"
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
