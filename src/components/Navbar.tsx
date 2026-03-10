import { motion, useScroll } from 'motion/react';
import { Hexagon, LogOut, User, Clock, Info, Key, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ isLoggedIn, onLogin, onLogout }: NavbarProps) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-500">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`max-w-7xl mx-auto backdrop-blur-xl border rounded-2xl px-6 py-4 flex items-center justify-between transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/80 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]' 
            : 'bg-black/20 border-white/5 shadow-2xl'
        }`}
      >
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
            <Hexagon className="w-8 h-8 text-orange-400 relative z-10" />
          </div>
          <span className="text-2xl font-bold tracking-widest text-white">NEXUS<span className="text-orange-400">3D</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300 uppercase tracking-widest">
          {isLoggedIn && (
            <>
              <Link to="/features" className={`hover:text-white transition-colors flex items-center gap-2 ${location.pathname === '/features' ? 'text-orange-400' : ''}`}>
                <Layers className="w-4 h-4" /> Features
              </Link>
              <Link to="/about" className={`hover:text-white transition-colors flex items-center gap-2 ${location.pathname === '/about' ? 'text-orange-400' : ''}`}>
                <Info className="w-4 h-4" /> About
              </Link>
              <Link to="/access" className={`hover:text-white transition-colors flex items-center gap-2 ${location.pathname === '/access' ? 'text-orange-400' : ''}`}>
                <Key className="w-4 h-4" /> Access
              </Link>
              <Link to="/history" className={`hover:text-white transition-colors flex items-center gap-2 ${location.pathname === '/history' ? 'text-orange-400' : ''}`}>
                <Clock className="w-4 h-4" /> History
              </Link>
              <Link to="/profile" className={`hover:text-white transition-colors flex items-center gap-2 ${location.pathname === '/profile' ? 'text-orange-400' : ''}`}>
                <User className="w-4 h-4" /> Profile
              </Link>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-sm font-bold bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-xl hover:bg-white/20 transition-colors uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          ) : (
            <>
              <button 
                onClick={onLogin}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wider px-4 py-2"
              >
                Log In
              </button>
              <button 
                onClick={onLogin}
                className="text-sm font-bold bg-white text-black px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
}
