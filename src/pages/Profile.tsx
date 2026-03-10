import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#020813] text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-3xl font-bold">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user?.displayName || 'User'}</h1>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-4 text-orange-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-semibold">Account Status</h3>
              </div>
              <p className="text-gray-300">Active - Genius Logic Engine Access Granted</p>
            </div>
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-4 text-orange-400">
                <Calendar className="w-5 h-5" />
                <h3 className="font-semibold">Member Since</h3>
              </div>
              <p className="text-gray-300">{user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recently'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
