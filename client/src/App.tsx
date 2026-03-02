import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home, SnippetPage } from './pages';

function App() {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/s/:id" element={<SnippetPage />} />
      </Routes>
    </div>
  );
}

export default App;
