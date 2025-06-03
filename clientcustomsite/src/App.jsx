import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Services from './Services';
import NotFound from './NotFound';
import ServiceDetails from './serviceDetails';
import Bookings from './Bookings';
import LoginPage from './LoginPage';
import LoginConfirmed from "./LoginConfirmed"
import Payment from "./Payments" // ✅ Import login page
import './App.css';

export default function App() {
  return (
    <Routes>
      {/* Global Routes */}
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/loginConfirmed" element={<LoginConfirmed />} />
       <Route path="/Payments" element={<Payment />} />
 {/* ✅ Login Route */}
      <Route path="*" element={<NotFound />} />

      {/* Dynamic Site Routes */}
      <Route path="/:siteUrl">
        <Route index element={<Home />} /> {/* /:siteUrl */}
        <Route path="meetourteam" element={<Services />} />
        <Route path="Services" element={<ServiceDetails />} />
        <Route path="Bookings" element={<Bookings />} />
      </Route>
    </Routes>
  );
}
