import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CreatePass from "./pages/CreatePass.jsx";
import WardenDashboard from "./pages/WardenDashboard.jsx";
import QRView from "./pages/QRView.jsx";
import QRScanner from "./pages/QRScanner.jsx";
import ParentConfirm from "./pages/ParentConfirm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login onLogin={(r) => setRole(r)} />} />

        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/create-pass" element={<CreatePass />} />

        <Route path="/warden" element={<WardenDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/qr-view" element={<QRView />} />
        <Route path="/scan-qr" element={<QRScanner />} />

        <Route path="/parent-confirm" element={<ParentConfirm />} />
<Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

