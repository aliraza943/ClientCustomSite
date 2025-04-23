// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Services from './Services';
import NotFound from './NotFound';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/:siteUrl">
        <Route index element={<Home />} /> {/* Matches /:siteUrl */}
        <Route path="meetourteam" element={<Services />} /> {/* Matches /:siteUrl/services */}
      </Route>
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
