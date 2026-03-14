import { motion } from 'motion/react';
import FlashcardCreator from '../components/FlashcardCreator';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Study() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#020813] text-white pt-32 px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
            Academy Lab
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Master complex concepts using AI-driven flashcards and cognitive spaced repetition.
          </p>
        </motion.div>

        <FlashcardCreator />
      </div>
    </div>
  );
}
