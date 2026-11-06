/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NoticeBanner } from './components/NoticeBanner';
import { PosterArticleSlide } from './components/PosterArticleSlide';
import { PlansSection } from './components/PlansSection';
import { IncomeCalculator } from './components/IncomeCalculator';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import {
  AboutModal,
  PrivacyPolicyModal,
  DeclarationModal,
  UserGuideModal,
  GovernmentRulesModal,
  DisclaimerModal,
} from './components/InfoModals';
import { InfoModalType } from './components/Navbar';
import { PublicCardModal } from './components/PublicCardModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { ThankYouModal } from './components/ThankYouModal';
import { PlanType, UserProfile } from './types';
import {
  getCurrentSessionUser,
  setCurrentSessionUser,
  DEFAULT_ADMIN,
  DEMO_USER,
  activateUserPlan,
} from './services/fmeService';
import { validateFirestoreConnection } from './firebase';
import { ToastProvider } from './components/Toast';
import { FmeLogo } from './components/FmeLogo';
import { LogoSelectorModal } from './components/LogoSelectorModal';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('fme_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return getCurrentSessionUser();
  });

  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'admin'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [selectedPlanForAuth, setSelectedPlanForAuth] = useState<PlanType>('500');

  // Digital ID Card Public Search & View Modal
  const [publicCardModalOpen, setPublicCardModalOpen] = useState(false);
  const [publicCardId, setPublicCardId] = useState('');

  // Payment Gateway & Thank You Celebration
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [paymentGatewayPlan, setPaymentGatewayPlan] = useState<PlanType>('500');
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [thankYouData, setThankYouData] = useState<{
    plan: PlanType;
    fmeId: string;
    amount: number;
    txRef: string;
  } | null>(null);

  // Info Modals (About, Privacy, Declaration, User Guide, Govt Rules, Disclaimer)
  const [activeInfoModal, setActiveInfoModal] = useState<InfoModalType | null>(null);
  const [logoModalOpen, setLogoModalOpen] = useState(false);


  // Initialize and check Firestore connection
  useEffect(() => {
    validateFirestoreConnection();
  }, []);

  // Sync dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('fme_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('fme_theme', 'light');
    }
  }, [isDark]);

  // Check URL params for referral code (?ref=FME1024) and Digital Card (?card=FME1024)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      // Prompt registration if not logged in
      if (!currentUser) {
        setSelectedPlanForAuth('500');
        setAuthModalMode('register');
        setAuthModalOpen(true);
      }
    }

    const cardParam = params.get('card');
    if (cardParam) {
      setPublicCardId(cardParam);
      setPublicCardModalOpen(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', planId: PlanType = '500') => {
    setAuthModalMode(mode);
    setSelectedPlanForAuth(planId);
    setAuthModalOpen(true);
  };

  const handleSelectPlan = (planId: PlanType = '500') => {
    setSelectedPlanForAuth(planId);
    setPaymentGatewayPlan(planId);
    setPaymentGatewayOpen(true);
  };

  const handlePaymentSuccess = async (details: {
    plan: PlanType;
    method: 'upi' | 'stripe' | 'qr';
    utrNumber?: string;
    proofDataUrl?: string;
  }) => {
    const planAmounts: Record<PlanType, number> = {
      '100': 100,
      '500': 500,
      '1000': 1000,
    };

    if (currentUser) {
      await activateUserPlan(currentUser.userId, details.plan);
      const updated: UserProfile = {
        ...currentUser,
        plan: details.plan,
        planStatus: 'active',
      };
      setCurrentUser(updated);
      setCurrentSessionUser(updated);

      setThankYouData({
        plan: details.plan,
        fmeId: currentUser.userId,
        amount: planAmounts[details.plan],
        txRef: details.utrNumber || `FME-PAY-${Date.now()}`,
      });
    } else {
      setThankYouData({
        plan: details.plan,
        fmeId: 'FME-REGISTRATION-PENDING',
        amount: planAmounts[details.plan],
        txRef: details.utrNumber || `FME-PAY-${Date.now()}`,
      });
    }

    setPaymentGatewayOpen(false);
    setThankYouOpen(true);
  };


  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentSessionUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentSessionUser(null);
    setCurrentView('home');
  };

  const handleRefreshUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    setCurrentSessionUser(updatedUser);
  };

  const handleScrollToCalculator = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('calculator');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('calculator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative">
        {/* Subtle Platform Official Background Watermark */}
        <FmeLogo variant="watermark" className="fixed inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.045] z-0" />

        {/* Top Navigation with Flipkart Blue styling */}
        <Navbar
          isDark={isDark}
          onToggleTheme={toggleTheme}
          currentUser={currentUser}
          onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
          onOpenDashboard={() => setCurrentView('dashboard')}
          onOpenAdmin={() => setCurrentView('admin')}
          onOpenModal={(type) => setActiveInfoModal(type)}
          onOpenPublicCard={(cardId) => {
            setPublicCardId(cardId || '');
            setPublicCardModalOpen(true);
          }}
          currentView={currentView}
          onNavigateHome={() => setCurrentView('home')}
          onOpenLogoSelector={() => setLogoModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {currentView === 'admin' && currentUser?.role === 'admin' ? (
            <AdminPanel
              currentUser={currentUser}
              onBackToApp={() => setCurrentView('dashboard')}
            />
          ) : currentView === 'dashboard' && currentUser ? (
            <UserDashboard
              user={currentUser}
              onLogout={handleLogout}
              onRefreshUser={handleRefreshUser}
              onOpenAdmin={currentUser.role === 'admin' ? () => setCurrentView('admin') : undefined}
            />
          ) : (
            /* Landing Page View */
            <>
              {/* Hero Section */}
              <Hero
                onOpenJoin={(planId) => handleSelectPlan(planId || '500')}
                onOpenCalculator={handleScrollToCalculator}
              />

              {/* Crucial Notice Banner */}
              <NoticeBanner />

              {/* 📰 VISITOR POSTER & ARTICLE SLIDE SHOWCASE (क्या है FME?) */}
              <PosterArticleSlide
                onStartWithPlan={(planId) => handleSelectPlan(planId)}
              />

              {/* Pricing / Activation Plans: ₹100, ₹500, ₹1000 */}
              <PlansSection
                onSelectPlan={(planId) => handleSelectPlan(planId)}
              />

              {/* 3-Level Interactive Income Calculator */}
              <IncomeCalculator
                onStartWithPlan={(planId) => handleSelectPlan(planId)}
              />

              {/* How It Works & 3-Level System Explanation */}
              <HowItWorks
                onStart={(planId) => handleSelectPlan(planId)}
              />

              {/* FAQ */}
              <FaqSection />

              {/* Contact & Registration Form */}
              <ContactSection initialPlan={selectedPlanForAuth} />
            </>
          )}
        </main>

        {/* Footer */}
        <Footer
          onOpenModal={(type) => setActiveInfoModal(type)}
          onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
        />

        {/* Mobile Sticky Quick Action Bar */}
        {currentView === 'home' && (
          <MobileStickyBar
            onOpenJoin={(planId) => handleSelectPlan(planId || '500')}
          />
        )}

        {/* Unified Auth & Registration Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          initialPlan={selectedPlanForAuth}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Public Digital ID Card Viewer Modal */}
        <PublicCardModal
          isOpen={publicCardModalOpen}
          onClose={() => setPublicCardModalOpen(false)}
          initialUserId={publicCardId}
          onJoinWithSponsor={(spId, plan) => {
            setSelectedPlanForAuth(plan);
            handleOpenAuth('register', plan);
          }}
        />

        {/* Instant Payment Gateway Modal */}
        <PaymentGatewayModal
          isOpen={paymentGatewayOpen}
          onClose={() => setPaymentGatewayOpen(false)}
          selectedPlan={paymentGatewayPlan}
          currentUser={currentUser}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Thank You Celebration Modal */}
        {thankYouData && (
          <ThankYouModal
            isOpen={thankYouOpen}
            onClose={() => setThankYouOpen(false)}
            user={currentUser || { ...DEMO_USER, userId: thankYouData.fmeId, plan: thankYouData.plan }}
            planId={thankYouData.plan}
            utrNumber={thankYouData.txRef}
            onGoToDashboard={() => {
              setThankYouOpen(false);
              if (currentUser) {
                setCurrentView('dashboard');
              } else {
                handleOpenAuth('login', thankYouData.plan);
              }
            }}
            onViewDigitalCard={() => {
              setThankYouOpen(false);
              if (currentUser) {
                setCurrentView('dashboard');
              } else {
                setPublicCardId(thankYouData.fmeId);
                setPublicCardModalOpen(true);
              }
            }}
          />
        )}

        {/* Info Modals */}
        <AboutModal
          isOpen={activeInfoModal === 'about'}
          onClose={() => setActiveInfoModal(null)}
        />
        <PrivacyPolicyModal
          isOpen={activeInfoModal === 'privacy'}
          onClose={() => setActiveInfoModal(null)}
        />
        <DeclarationModal
          isOpen={activeInfoModal === 'declaration'}
          onClose={() => setActiveInfoModal(null)}
        />
        <UserGuideModal
          isOpen={activeInfoModal === 'guide'}
          onClose={() => setActiveInfoModal(null)}
        />
        <GovernmentRulesModal
          isOpen={activeInfoModal === 'govt'}
          onClose={() => setActiveInfoModal(null)}
        />
        <DisclaimerModal
          isOpen={activeInfoModal === 'disclaimer'}
          onClose={() => setActiveInfoModal(null)}
        />

        {/* FME Official Brand Logo Selector Studio */}
        <LogoSelectorModal
          isOpen={logoModalOpen}
          onClose={() => setLogoModalOpen(false)}
        />
      </div>
    </ToastProvider>
  );
}

