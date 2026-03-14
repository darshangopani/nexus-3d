import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Send, Loader2, Sparkles, User as UserIcon, MessageSquare, Copy, Check } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';

interface PodMessage {
  id: string;
  user_id: string;
  user_name: string;
  query: string;
  response: string;
  created_at: string;
}

export default function StudyPod() {
  const { podId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<PodMessage[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!podId) return;

    // 1. Initial Fetch
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('pod_messages')
        .select('*')
        .eq('pod_id', podId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
      setIsLoading(false);
    };

    fetchMessages();

    // 2. Realtime Subscription
    const channel = supabase
      .channel(`pod-${podId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'pod_messages',
        filter: `pod_id=eq.${podId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as PodMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [podId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Pod Banner */}
      <div className="backdrop-blur-xl bg-orange-500/10 border border-orange-500/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Academic Study Pod</h2>
            <p className="text-orange-200/60 font-mono text-sm uppercase tracking-widest mt-1">Room: {podId?.slice(0, 8)}...</p>
          </div>
        </div>

        <button 
          onClick={copyLink}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Link Copied!' : 'Invite Collaborators'}
        </button>
      </div>

      {/* Live Feed */}
      <div className="space-y-6 min-h-[400px]">
        {messages.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <MessageSquare className="w-12 h-12 text-gray-700 mb-4" />
            <p className="text-gray-500 font-medium">No activity in this pod yet. Start a search to sync with peers!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest px-4">
                <UserIcon className="w-3 h-3" /> {msg.user_name} {msg.user_id === user?.id && '(You)'}
              </div>
              
              <div className={`max-w-[90%] p-6 rounded-3xl border ${
                msg.user_id === user?.id 
                  ? 'bg-orange-500/10 border-orange-500/30' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <div className="mb-4 pb-4 border-bottom border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter block mb-1">Query</span>
                  <p className="text-lg font-medium text-white">{msg.query}</p>
                </div>
                
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-orange-400">
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter block mb-2">Genius Logic Response</span>
                  <ReactMarkdown>{msg.response}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Floating Action Hint */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2">
        <Link to="/dashboard" className="px-8 py-4 bg-white text-black rounded-full font-bold shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5" />
          Join Discussion from Search
        </Link>
      </div>
    </div>
  );
}
