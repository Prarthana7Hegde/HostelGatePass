import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CreatePass from "./pages/CreatePass.jsx";
import WardenDashboard from "./pages/WardenDashboard.jsx";
import QRView from "./pages/QRView.jsx";
import ParentConfirm from "./pages/ParentConfirm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Register from "./pages/Register.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import GuardDashboard from "./pages/GuardDashboard.jsx";   // ✅ ADD THIS

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* ✅ Login Page */}
        <Route path="/login" element={<Login onLogin={(r) => setRole(r)} />} />

        {/* ✅ Dashboards */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/warden" element={<WardenDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/guard" element={<GuardDashboard />} /> {/* ✅ ONLY GUARD CAN SCAN */}

        {/* ✅ Features */}
        <Route path="/create-pass" element={<CreatePass />} />
        <Route path="/qr-view" element={<QRView />} />
        <Route path="/parent-confirm" element={<ParentConfirm />} />

        {/* ✅ REMOVE PUBLIC SCAN ACCESS */}
        {/* ❌ <Route path="/scan-qr" element={<QRScanner />} /> */}

        {/* ✅ Register */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
