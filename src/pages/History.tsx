import { motion, AnimatePresence } from 'motion/react';
import { Clock, Search, ArrowRight, Loader2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';

interface HistoryItem {
  id: string;
  query: string;
  response: string;
  createdAt: any;
}

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map Supabase columns to our component state structure
        const items = data.map(item => ({
          id: item.id,
          query: item.query,
          response: item.response,
          createdAt: { toDate: () => new Date(item.created_at) } // Mocking Firestore timestamp behavior
        }));

        setHistory(items);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#020813] text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            Query History
          </h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-gray-400">No history found. Try asking the Genius Logic Engine a question!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Query</span>
                      <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors line-clamp-1">{item.query}</h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-4xl max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.1)] overflow-hidden pointer-events-auto flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                  <h2 className="text-xl font-bold text-white pr-8 truncate">{selectedItem.query}</h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8 overflow-y-auto">
                  <div className="prose prose-invert prose-lg max-w-none prose-headings:text-orange-300 prose-a:text-amber-400">
                    <ReactMarkdown>{selectedItem.response}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
