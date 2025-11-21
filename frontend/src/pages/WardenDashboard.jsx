
import { useEffect, useState } from "react";
import api from "../api/axios";


export default function WardenDashboard() {
  const [passes, setPasses] = useState([]);
const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/";
};

  async function loadPending() {
    try {
      const res = await api.get("/passes/pending");
      setPasses(res.data.passes);
    } catch (err) {
      console.error(err);
    }
  }
async function approve(id) {
  const res = await api.post(`/passes/warden/${id}`, { action: "approve" });
  const qr = res.data.qr;

  alert("Pass approved! QR Generated");

  // Save QR temporarily
  localStorage.setItem("qr_code", qr);

  // Redirect to QR page
  window.location.href = "/qr-view";
}

  async function reject(id) {
    await api.post(`/passes/warden/${id}`, { action: "reject" });
    alert("Pass rejected!");
    loadPending();
  }

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Warden Dashboard</h2>
      <h3>Pending Pass Requests</h3>
<button onClick={handleLogout} style={{ background: "red", color: "white", padding: "8px" }}>
  Logout
</button>
      <ul>
        {passes.map((p) => (
          <li key={p.id}>
            Pass #{p.id} - Student ID: {p.student_id}
            <br />
            <button onClick={() => approve(p.id)}>Approve</button>
            <button onClick={() => reject(p.id)}>Reject</button>
          
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
