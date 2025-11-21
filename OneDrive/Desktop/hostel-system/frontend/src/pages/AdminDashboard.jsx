import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const role = localStorage.getItem("role");
  const [stats, setStats] = useState(null);
const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/";
};

  // Role protection
  if (role !== "admin") {
    return <div style={{ padding: 20 }}>Access denied ❌</div>;
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load admin stats", err);
    }
  }

  if (!stats) return <h2>Loading admin data…</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <h3>Total Students: {stats.totalStudents}</h3>
      <h3>Total Passes: {stats.totalPasses}</h3>
      <h3>Pending Passes: {stats.pendingPasses}</h3>

      <h2>Behaviour Flags</h2>

      {stats.flags.length === 0 ? (
        <p>No abnormal behaviour detected ✔</p>
      ) : (
        stats.flags.map((f, i) => (
          <p key={i}>
            ⚠ {f.student} — {f.count} passes (unusual behaviour)
          </p>
        ))
      )}
      <button onClick={handleLogout} style={{ background: "red", color: "white", padding: "8px" }}>
  Logout
</button>

    </div>
    
  );
}
