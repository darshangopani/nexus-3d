import { motion, AnimatePresence } from 'motion/react';
import { X, Github, Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { signInWithGoogle } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onClose();
    }, 1500);
  };

  const handleSocialLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.1)] overflow-hidden pointer-events-auto relative group"
            >
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 z-10" />
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200 pointer-events-none" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                  <p className="text-gray-400 text-sm">Welcome back to Nexus 3D</p>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-3 mb-8">
                  <button
                    onClick={handleSocialLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                  <button
                    onClick={handleSocialLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-[#24292F] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#24292F]/80 transition-colors disabled:opacity-50"
                  >
                    <Github className="w-5 h-5" />
                    Continue with GitHub
                  </button>
                </div>

                <div className="relative flex items-center py-2 mb-6">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or continue with email</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative overflow-hidden group/btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 mt-2 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
                
                <p className="text-center text-gray-500 text-xs mt-6">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
