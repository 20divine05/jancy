import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DownloadPage from './pages/DownloadPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
        <div>
          <Navbar />
          <main className="pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/download/:id" element={<DownloadPage />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
