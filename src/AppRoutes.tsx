import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import History from './pages/History';
import About from './pages/About';
import Access from './pages/Access';
import Features from './pages/Features';
import LoginModal from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';
import { logout } from './firebase';

export default function AppRoutes() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <Router>
      <div className="relative min-h-screen bg-[#020813] text-white font-sans overflow-hidden">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogin={() => setIsLoginModalOpen(true)} 
          onLogout={handleLogout} 
        />

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
          onLoginSuccess={() => {}} 
        />

        <Routes>
          <Route path="/" element={<Home onLoginClick={() => setIsLoginModalOpen(true)} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/access" element={<Access />} />
          <Route path="/features" element={<Features />} />
        </Routes>
      </div>
    </Router>
  );
}
