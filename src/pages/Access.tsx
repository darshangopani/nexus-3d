import { motion } from 'motion/react';
import { Key, Shield, Lock } from 'lucide-react';

export default function Access() {
  return (
    <div className="min-h-screen bg-[#020813] text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
            Request Access
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the waitlist for the Genius Logic Engine.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Key className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <form className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Institution / Company</label>
                <input 
                  type="text" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Where do you work/study?"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-3 rounded-xl mt-4 hover:from-orange-500 hover:to-amber-500 transition-all">
                Join Waitlist
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
