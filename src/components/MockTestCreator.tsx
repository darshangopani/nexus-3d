import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileQuestion, Loader2, Settings2, CheckCircle, Code2, Trash2, Send, AlertCircle, XCircle, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { GEMINI_API_KEY } from '../utils/config';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface Question {
  id: number;
  type: 'mcq' | 'coding';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export default function MockTestCreator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate (University Level)');
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setQuestions([]);
    setUserAnswers({});
    setIsSubmitted(false);

    try {
      const prompt = `
        You are the "Nexus Mock Test Generator".
        Generate a rigorous mock test based on:
        - Topic: ${topic}
        - Difficulty: ${difficulty}
        - Count: ${questionCount}

        Return EXACTLY a JSON array of objects. Each object must have:
        - id: number
        - type: "mcq" or "coding" (if the topic is programming/CS related, include at least one coding question)
        - question: text
        - options: Array of 4 strings (only for mcq)
        - correctAnswer: the correct option text OR the expected logic for coding
        - explanation: a simple, best-in-class explanation.

        Respond ONLY with the JSON.
      `;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = res.text || '[]';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      setQuestions(JSON.parse(cleanJson));
    } catch (error) {
      console.error('Error generating mock test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
  };

  const handleAnswerChange = (id: number, value: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <FileQuestion className="w-10 h-10 text-orange-400" />
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Mock Test Generator</h2>
        </div>

        {!questions.length || isSubmitted === false ? (
          <form onSubmit={handleGenerate} className="space-y-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Topic / Subject</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quantum Physics, Python Hooks..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-4 px-6 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-all"
                  required
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-4 px-6 text-lg text-white focus:outline-none focus:border-orange-500 appearance-none"
                >
                  <option>Basic (High School)</option>
                  <option>Intermediate (University Level)</option>
                  <option>Advanced (Research/Grad)</option>
                  <option>Extreme (IIT JEE / MIT Standard)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Questions</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-4 px-6 text-lg text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
              {isLoading ? 'Generating Global Standard Test...' : 'Start Assessment'}
            </button>
          </form>
        ) : null}

        <div className="space-y-8">
          {questions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-2xl border ${
                isSubmitted 
                  ? (userAnswers[q.id] === q.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30')
                  : 'bg-black/40 border-white/10'
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-orange-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <h3 className="text-xl text-white font-medium">{q.question}</h3>
              </div>

              {q.type === 'mcq' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options?.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswerChange(q.id, opt)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        userAnswers[q.id] === opt 
                          ? 'bg-orange-500 border-orange-400 text-white shadow-lg' 
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      } ${
                        isSubmitted && opt === q.correctAnswer ? 'border-emerald-500 ring-2 ring-emerald-500/50' : ''
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 text-sm mb-2">
                    <Code2 className="w-4 h-4" />
                    <span>Programizer Logic Editor</span>
                  </div>
                  <textarea
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="// Implement your solution here..."
                    className="w-full h-40 bg-black/80 font-mono text-emerald-400 p-4 rounded-xl border border-white/10 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>
              )}

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <div className="flex items-start gap-3">
                    {userAnswers[q.id] === q.correctAnswer ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 mt-1" />
                    )}
                    <div>
                      <div className={`font-bold mb-2 ${userAnswers[q.id] === q.correctAnswer ? 'text-emerald-400' : 'text-red-400'}`}>
                        {userAnswers[q.id] === q.correctAnswer ? 'Perfect!' : 'Incorrect'}
                      </div>
                      <div className="text-gray-300 leading-relaxed">
                        <span className="text-orange-300 font-semibold italic">Scout Intel: </span>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {questions.length > 0 && !isSubmitted && (
            <button
              onClick={handleSubmitTest}
              className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold rounded-2xl shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3"
            >
              <Send className="w-6 h-6" />
              Finalize & Grade Assessment
            </button>
          )}

          {isSubmitted && (
            <button
              onClick={() => { setQuestions([]); }}
              className="w-full py-6 bg-white/10 hover:bg-white/20 text-white text-xl font-bold rounded-2xl transition-all flex items-center justify-center gap-3"
            >
              <Trash2 className="w-6 h-6" />
              Clear Results & Try Again
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
