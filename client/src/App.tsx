import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { SnippetPage } from './pages/SnippetPage';

function App() {
  return (
    <div className="flex flex-col h-screen bg-[#1e1e2e] overflow-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/s/:id" element={<SnippetPage />} />
      </Routes>
    </div>
  );
}

export default App;
