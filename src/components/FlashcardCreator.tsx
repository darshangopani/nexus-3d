import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Plus, Search, BrainCircuit, CheckCircle2, XCircle, RotateCcw, Save, Trash2, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '../utils/config';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: number;
  next_review: string;
}

export default function FlashcardCreator() {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFlashcards(data);
    }
    setIsLoading(false);
  };

  const generateFlashcards = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);

    try {
      const prompt = `
        You are a learning expert. Based on the following text, generate 5 meaningful flashcards.
        Flashcards should follow the "Question" and "Answer" format.
        Text: "${inputText}"
        
        Respond ONLY with a JSON array:
        [
          {"question": "...", "answer": "..."},
          ...
        ]
      `;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = res.text || '[]';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const generated = JSON.parse(cleanJson);

      const toInsert = generated.map((card: any) => ({
        user_id: user?.id,
        question: card.question,
        answer: card.answer,
      }));

      const { data, error } = await supabase.from('flashcards').insert(toInsert).select();
      
      if (!error && data) {
        setFlashcards([...data, ...flashcards]);
        setInputText('');
      }

    } catch (err) {
      console.error("Flashcard generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReview = async (difficulty: number) => {
    const card = flashcards[currentIndex];
    if (!card) return;

    // Leitner Logic: 
    // 0 = Easy (1 week), 1 = Medium (3 days), 2 = Hard (1 day), 3 = New
    let days = 1;
    if (difficulty === 0) days = 7;
    if (difficulty === 1) days = 3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + days);

    await supabase
      .from('flashcards')
      .update({ 
        difficulty: difficulty, 
        next_review: nextReview.toISOString() 
      })
      .eq('id', card.id);

    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      fetchFlashcards(); // Refresh list
      setCurrentIndex(0);
    }
  };

  const deleteCard = async (id: string) => {
    await supabase.from('flashcards').delete().eq('id', id);
    setFlashcards(flashcards.filter(c => c.id !== id));
  };

  const reviewCards = flashcards.filter(c => new Date(c.next_review) <= new Date());

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Layers className="text-orange-400" /> AI Flashcard Lab
          </h2>
          <p className="text-gray-400 mt-2">Generate smart cards from notes and master concepts with Spaced Repetition.</p>
        </div>
        <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Total Mastered</span>
          <div className="text-2xl font-bold text-orange-400">{flashcards.length} Cards</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Generation Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold">Auto-Gen Lab</h3>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your study notes or a complex topic here..."
              className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none text-sm leading-relaxed"
            />
            <button
              onClick={generateFlashcards}
              disabled={isGenerating || !inputText.trim()}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Plus className="w-4 h-4" />}
              Generate 5 Cards
            </button>
          </div>

          <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
            <div className="flex gap-4 items-start">
              <BrainCircuit className="text-orange-400 w-8 h-8" />
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Leitner Intelligence</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The system tracks your mastery levels. Cards you find "Hard" are shown daily, while "Easy" cards appear weekly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Area */}
        <div className="lg:col-span-2 space-y-8">
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
            </div>
          ) : reviewCards.length > 0 ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-bold">Session: {currentIndex + 1} / {reviewCards.length}</h3>
                <button 
                  onClick={() => setCurrentIndex(0)}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-2"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Session
                </button>
              </div>

              {/* Flashcard Component */}
              <div className="perspective-1000 h-[400px] relative w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                  className="w-full h-full relative transform-style-3d shadow-2xl rounded-[2rem]"
                >
                  {/* Front: Question */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                    <span className="absolute top-8 left-8 text-xs font-bold text-orange-400 uppercase tracking-widest">Question</span>
                    <h4 className="text-2xl md:text-3xl font-medium leading-tight">{reviewCards[currentIndex]?.question}</h4>
                    <p className="mt-8 text-xs text-gray-500 animate-pulse">Click to Reveal Answer</p>
                  </div>

                  {/* Back: Answer */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-orange-400 to-amber-500 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center rotate-y-180 text-black">
                    <span className="absolute top-8 left-8 text-xs font-bold text-black/40 uppercase tracking-widest">Answer</span>
                    <p className="text-xl md:text-2xl font-bold leading-relaxed">{reviewCards[currentIndex]?.answer}</p>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-3 gap-4"
                  >
                    <button onClick={() => handleReview(2)} className="group p-6 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-all text-center">
                      <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <div className="font-bold">Hard</div>
                      <div className="text-[10px] text-gray-500 mt-1">Review Tomorrow</div>
                    </button>
                    <button onClick={() => handleReview(1)} className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-center">
                      <RotateCcw className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <div className="font-bold">Medium</div>
                      <div className="text-[10px] text-gray-500 mt-1">3 Days Gap</div>
                    </button>
                    <button onClick={() => handleReview(0)} className="group p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/20 transition-all text-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="font-bold">Easy</div>
                      <div className="text-[10px] text-gray-500 mt-1">1 Week Gap</div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-[500px] border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-400/30" />
              </div>
              <h3 className="text-2xl font-bold mb-4">You're All Caught Up!</h3>
              <p className="text-gray-400 max-w-sm">No cards due for review. Generate new cards from your research to continue building your knowledge base.</p>
            </div>
          )}
        </div>
      </div>

      {/* Card List / Manage */}
      <div className="pt-24 border-t border-white/10">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Layers className="w-6 h-6 text-gray-400" /> Deck Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {flashcards.map((card) => (
            <div key={card.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                  card.difficulty === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                  card.difficulty === 1 ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {card.difficulty === 0 ? 'Easy' : card.difficulty === 1 ? 'Medium' : 'Hard'}
                </span>
                <button onClick={() => deleteCard(card.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-bold text-white mb-2">{card.question}</h4>
              <p className="text-sm text-gray-400 line-clamp-2 italic">"{card.answer}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
