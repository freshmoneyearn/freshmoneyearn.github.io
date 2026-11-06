import React, { useState } from 'react';
import {
  Menu,
  X,
  TrendingUp,
  User,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Info,
  FileText,
  HelpCircle,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Search,
  CreditCard,
  Award,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserProfile } from '../types';
import { FmeLogo } from './FmeLogo';
import { LiveAnnouncementBar } from './LiveAnnouncementBar';

export type InfoModalType = 'about' | 'privacy' | 'declaration' | 'guide' | 'govt' | 'disclaimer';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onOpenModal: (type: InfoModalType) => void;
  onOpenPublicCard: (cardId?: string) => void;
  currentView: 'home' | 'dashboard' | 'admin';
  onNavigateHome: () => void;
  onOpenLogoSelector?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onOpenDashboard,
  onOpenAdmin,
  onOpenModal,
  onOpenPublicCard,
  currentView,
  onNavigateHome,
  onOpenLogoSelector,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchId, setQuickSearchId] = useState('');

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchId.trim()) {
      onOpenPublicCard(quickSearchId.trim());
      setQuickSearchId('');
    } else {
      onOpenPublicCard();
    }
  };

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigateHome();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#2874f0] text-white shadow-md transition-colors">
      {/* 🔴 LIVE WEB INFORMATION RUNNING ANNOUNCEMENT TICKER */}
      <LiveAnnouncementBar
        onOpenPlans={() => handleLinkClick('#plans')}
        onOpenPublicCard={() => onOpenPublicCard()}
        onOpenModal={(type) => onOpenModal(type)}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo / Brand Name (Flipkart Style with Premium 3D FME Emblem) */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 group focus:outline-none p-1 text-left cursor-pointer shrink-0 hover:opacity-95 transition-opacity"
          >
            <FmeLogo variant="horizontal" size="md" withGlow={true} />
          </button>

          {/* Flipkart Style Global ID Card Search Bar */}
          <form
            onSubmit={handleQuickSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-2 relative"
          >
            <input
              type="text"
              value={quickSearchId}
              onChange={(e) => setQuickSearchId(e.target.value)}
              placeholder="सत्यापित FME डिजिटल ID सर्च करें (उदा. FME1024)..."
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs font-semibold pl-4 pr-10 py-2.5 rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#ffe11b]"
            />
            <button
              type="submit"
              title="सर्च करें"
              className="absolute right-0 top-0 bottom-0 px-3 bg-[#2874f0] hover:bg-blue-700 text-white rounded-r-sm flex items-center justify-center cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-bold text-white">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-yellow-300 transition-colors cursor-pointer py-1"
            >
              होम
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('#what-is-fme-poster')}
              className="hover:text-yellow-300 transition-colors cursor-pointer py-1 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>FME क्या है?</span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('#plans')}
              className="hover:text-yellow-300 transition-colors cursor-pointer py-1"
            >
              प्लान्स
            </button>
            <button
              type="button"
              onClick={() => onOpenPublicCard()}
              className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-yellow-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>🪪 ID कार्ड</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenModal('govt')}
              className="hover:text-yellow-300 transition-colors cursor-pointer py-1 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Govt रूल्स</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenModal('guide')}
              className="hover:text-yellow-300 transition-colors cursor-pointer py-1 flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>गाइड</span>
            </button>
            {onOpenLogoSelector && (
              <button
                type="button"
                onClick={onOpenLogoSelector}
                className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 hover:bg-yellow-300 font-black transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🎨 लोगो चुनें</span>
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick search on mobile */}
            <button
              type="button"
              onClick={() => onOpenPublicCard()}
              title="ID कार्ड खोजें"
              className="md:hidden p-2 rounded-lg bg-white/15 text-white hover:bg-white/25 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="px-3 py-2 text-xs font-bold rounded-sm bg-purple-700 hover:bg-purple-800 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">एडमिन</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="px-3.5 py-2 text-xs font-bold rounded-sm bg-[#ffe11b] hover:bg-yellow-400 text-slate-900 shadow-sm transition-all cursor-pointer flex items-center gap-2 font-black"
                >
                  <img
                    src={currentUser.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt="User"
                    className="w-5 h-5 rounded-full object-cover border border-slate-900"
                  />
                  <span>डैशबोर्ड</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 sm:px-4 py-2 text-xs font-black rounded-sm bg-white hover:bg-slate-100 text-[#2874f0] shadow-sm transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-3 sm:px-4 py-2 text-xs font-black rounded-sm bg-[#ffe11b] hover:bg-yellow-400 text-slate-950 shadow-md transition-all cursor-pointer flex items-center gap-1 ring-1 ring-yellow-300/80 active:scale-95 animate-pulse"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                  <span>Join Now</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="मेनू खोलें"
              className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-blue-600 bg-[#1d5ec4] text-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in">
          {/* Mobile Search input */}
          <form onSubmit={handleQuickSearchSubmit} className="relative mb-2">
            <input
              type="text"
              value={quickSearchId}
              onChange={(e) => setQuickSearchId(e.target.value)}
              placeholder="सत्यापित FME डिजिटल ID सर्च करें..."
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs font-semibold pl-3 pr-9 py-2 rounded-sm"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3 bg-yellow-400 text-slate-950 font-bold rounded-r-sm text-xs"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateHome();
              }}
              className="p-2.5 rounded-lg text-left bg-white/10 hover:bg-white/20 text-white"
            >
              🏠 होम (Home)
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('#what-is-fme-poster')}
              className="p-2.5 rounded-lg text-left bg-white/10 hover:bg-white/20 text-yellow-300 flex items-center gap-1"
            >
              ✨ FME क्या है?
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('#plans')}
              className="p-2.5 rounded-lg text-left bg-white/10 hover:bg-white/20 text-white"
            >
              💰 ₹100, ₹500, ₹1000
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPublicCard();
              }}
              className="p-2.5 rounded-lg text-left bg-white/15 hover:bg-white/25 text-yellow-200"
            >
              🪪 डिजिटल ID कार्ड
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('govt');
              }}
              className="p-2.5 rounded-lg text-left bg-white/10 hover:bg-white/20 text-emerald-300"
            >
              ⚖️ गवर्नमेंट रूल्स
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('guide');
              }}
              className="p-2.5 rounded-lg text-left bg-white/10 hover:bg-white/20 text-white"
            >
              📖 यूजर गाइड
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('disclaimer');
              }}
              className="p-2.5 rounded-lg text-left bg-white/10 hover:bg-white/20 text-white"
            >
              ⚠️ डिक्लरेशन व अस्वीकरण
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal('privacy');
              }}
              className="p-2.5 rounded-lg text-left bg-white/10 hover:bg-white/20 text-white"
            >
              🔒 गोपनीयता नीति
            </button>
          </div>

          <div className="pt-2 border-t border-blue-500/50 flex flex-col gap-2">
            {onOpenLogoSelector && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogoSelector();
                }}
                className="w-full py-2.5 px-3 rounded-sm text-xs font-black bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-xs mb-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>🎨 लोगो चुनें (FME Logo Studio)</span>
              </button>
            )}

            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full py-3 px-4 rounded-sm text-xs font-black bg-[#ffe11b] text-slate-950 flex items-center justify-center gap-2 shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>यूजर डैशबोर्ड खोलें ({currentUser.userId})</span>
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 px-4 rounded-sm text-xs font-bold bg-purple-700 text-white flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>एडमिन पैनल (पासवर्ड: RAINAKSH)</span>
                  </button>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="py-2.5 px-3 rounded-sm bg-white text-[#2874f0] text-xs font-black text-center shadow-xs"
                >
                  लॉगिन (Login)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="py-2.5 px-3 rounded-sm bg-[#ffe11b] text-slate-950 text-xs font-black text-center shadow-xs"
                >
                  नया रजिस्ट्रेशन
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

