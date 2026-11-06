import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'लाइट मोड में बदलें' : 'डार्क मोड में बदलें'}
      title={isDark ? 'लाइट मोड (Light Mode)' : 'डार्क मोड (Dark Mode)'}
      className={`inline-flex items-center justify-center p-2 rounded-lg border text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-500 cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-in fade-in duration-200" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 animate-in fade-in duration-200" />
      )}
    </button>
  );
};
