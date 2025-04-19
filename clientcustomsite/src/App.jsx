// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import NotFound from './NotFound';
import './App.css'; // Import your CSS file here

export default function App() {
  return (
    <Routes>
<Route path="/:siteUrl" element={<Home />} />

      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} /> {/* default fallback */}
    </Routes>
  );
}
