import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [passes, setPasses] = useState([]);
const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/";
};

  useEffect(() => {
    loadPasses();
  }, []);

  async function loadPasses() {
    const res = await api.get("/passes/student");
    setPasses(res.data.passes);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Dashboard</h2>
<button onClick={() => window.location.href = "/create-pass"}>
  Create New Pass
</button>

<button onClick={handleLogout} style={{ background: "red", color: "white", padding: "8px" }}>
  Logout
</button>


      <h3>Your Passes</h3>
      {passes.map((p) => (
        <p key={p.id}>
    Pass #{p.id} 
| Parent: {p.parent_confirmed === 1 ? "Approved" : p.parent_confirmed === -1 ? "Rejected" : "Pending"} 
| Warden: {p.warden_status}

        </p>
      ))}
    </div>
  );
}
