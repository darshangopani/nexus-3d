import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Send, Loader2, Book, GraduationCap, FileText, Search, Mic, Volume2, ChartSpline, Users } from 'lucide-react';
import MermaidDiagram from './MermaidDiagram';
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mermaidChart, setMermaidChart] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [activePodId, setActivePodId] = useState<string | null>(new URLSearchParams(window.location.search).get('pod_id'));

  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`]/g, ''));
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    setMermaidChart(null);
    setShowMap(false);

    try {
      let systemPrompt = '';
      
      if (activeMode === 'concept') {
        systemPrompt = `You are a world-class educator. Provide the BEST and SIMPLEST explanation for the given topic. Focus on clarity and core intuition. 
        Additionally, create a Mermaid.js flowchart (graph TD) that visualizes the core connections of this concept.
        Use Markdown for the explanation.
        At the VERY END of your response, provide the mermaid code block wrapped in [MERMAID_START] and [MERMAID_END] tags.`;
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
      
      // Parse mermaid chart if available
      const mermaidMatch = responseText.match(/\[MERMAID_START\]([\s\S]*?)\[MERMAID_END\]/);
      if (mermaidMatch) {
        setMermaidChart(mermaidMatch[1].replace(/```mermaid|```/g, '').trim());
      }
      
      const cleanResponse = responseText.replace(/\[MERMAID_START\][\s\S]*?\[MERMAID_END\]/, '').trim();
      setResponse(cleanResponse);

      if (user && responseText !== 'No response generated.') {
        try {
          // Standard history
          await supabase
            .from('history')
            .insert({
              user_id: user.id,
              query: `[${activeMode.toUpperCase()}] ${query.trim()}`,
              response: responseText,
              q_type: 'custom'
            });

          // Pod broadcast
          if (activePodId) {
            await supabase
              .from('pod_messages')
              .insert({
                pod_id: activePodId,
                user_id: user.id,
                user_name: user.email?.split('@')[0] || 'Anonymous',
                query: query.trim(),
                response: responseText
              });
          }
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
        {activePodId && (
          <Link
            to={`/pod/${activePodId}`}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold hover:bg-emerald-500/30 transition-all"
          >
            <Users className="w-4 h-4" /> Active Pod: Live
          </Link>
        )}
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
            className="w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl py-6 pl-16 pr-36 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all shadow-2xl"
          />
          <div className="absolute right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={startListening}
              className={`p-4 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              <Mic className="w-6 h-6" />
            </button>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-4 bg-white text-black hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </button>
          </div>
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
              <div className="absolute top-8 right-8 z-20">
                <button
                  onClick={() => speakText(response)}
                  className={`p-3 rounded-full transition-all ${isSpeaking ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {mermaidChart && (
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all border ${
                      showMap 
                        ? 'bg-orange-500 border-orange-400 text-white' 
                        : 'bg-white/5 border-white/10 text-orange-400 hover:bg-white/10'
                    }`}
                  >
                    <ChartSpline className="w-4 h-4" />
                    {showMap ? 'Show Text Explanation' : 'View Concept Map'}
                  </button>
                </div>
              )}

              <div className="relative z-10">
                {showMap && mermaidChart ? (
                  <MermaidDiagram chart={mermaidChart} />
                ) : (
                  <ReactMarkdown>{response}</ReactMarkdown>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
