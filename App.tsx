import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BackToTopButton from './components/BackToTopButton';
import ParticlesBackground from './components/ParticlesBackground';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const InternshipsPage = lazy(() => import('./pages/InternshipsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));

// This new AppContent component uses the router hooks, and is rendered *inside* the BrowserRouter.
const AppContent: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  // useLocation is now called in a valid context.
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-body transition-colors duration-500`}>
      <ParticlesBackground theme={theme} />
      <Header toggleTheme={toggleTheme} currentTheme={theme} isHomePage={isHomePage} />
      <main>
        <Suspense fallback={<div className="py-24 text-center text-gray-600 dark:text-gray-300">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/internships" element={<InternshipsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

// The main App component now simply provides the Router context.
const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
