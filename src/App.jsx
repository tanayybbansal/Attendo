// ===================================
// APP - ROUTING
// Routes: Login → Signup → Dashboard → Analytics → Timetable
// ===================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import Dashboard from "./components/dashboard";
import AnalyticsPage from "./components/analytics";
import TimetablePage from "./components/timetable";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
      </Routes>
    </BrowserRouter>
  );
}
