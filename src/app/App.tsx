import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import WordPressPage from '@/pages/WordPressPage';
import WordPressPost from '@/pages/WordPressPost';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pages" element={<WordPressPage />} />
          <Route path="/articoli/:slug" element={<WordPressPost />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}