import React from 'react';
import { TrendingUp, Mail, ArrowUp, ShieldCheck, FileText, Info, BookOpen } from 'lucide-react';
import { CONTACT_EMAIL } from '../data/plans';

import { InfoModalType } from './Navbar';
import { FmeLogo } from './FmeLogo';

interface FooterProps {
  onOpenModal?: (type: InfoModalType) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal, onOpenAuth }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-10 pb-24 sm:pb-12 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <FmeLogo variant="horizontal" size="sm" />

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm">
            <a href="#home" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              होम (Home)
            </a>
            <a href="#plans" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              प्लान्स (₹100, ₹500, ₹1000)
            </a>
            {onOpenModal && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenModal('govt')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  ⚖️ गवर्नमेंट रूल्स
                </button>
                <button
                  type="button"
                  onClick={() => onOpenModal('guide')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  यूजर गाइड व प्रोसेस
                </button>
                <button
                  type="button"
                  onClick={() => onOpenModal('about')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About
                </button>
                <button
                  type="button"
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => onOpenModal('declaration')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  डिक्लरेशन
                </button>
                <button
                  type="button"
                  onClick={() => onOpenModal('disclaimer')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  अस्वीकरण
                </button>
              </>
            )}
            <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              FAQ
            </a>
            {onOpenAuth && (
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                यूज़र लॉगिन
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="पेज के ऊपर जाएं"
            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            <span>ऊपर जाएं</span>
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>सपोर्ट ईमेल:</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-slate-700 dark:text-slate-300 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </div>

          <p>
            © {new Date().getFullYear()} FRESH MONEY EARN (FME) FAST INCOME SERVICE. सर्वाधिकार सुरक्षित।
          </p>
        </div>
      </div>
    </footer>
  );
};
