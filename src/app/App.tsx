import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import WordPressPage from '@/pages/WordPressPage';
import WordPressPost from '@/pages/WordPressPost';
import CategoryArchivePage from '@/pages/CategoryArchivePage';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pages" element={<WordPressPage />} />
          <Route path="/sezione/:slug" element={<CategoryArchivePage />} />
          <Route path="/articoli/:slug" element={<WordPressPost />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}