import { useEffect, useState } from "react";
import api from "../api/axios";

export default function WardenDashboard() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  async function loadPending() {
    try {
      setLoading(true);
      const res = await api.get("/passes/pending");
      setPasses(res.data.passes);
    } catch {
      alert("Could not load pending passes.");
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    try {
      await api.post(`/passes/warden/${id}`, { action: "approve" });
      alert("Pass approved!");
      loadPending();
    } catch {
      alert("Approval failed");
    }
  }

  async function reject(id) {
    setProcessingId(id);
    try {
      await api.post(`/passes/warden/${id}`, { action: "reject" });
      alert("Pass rejected!");
      loadPending();
    } catch {
      alert("Reject failed");
    } finally {
      setProcessingId(null);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div style={styles.page}>
      <style>{`
        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(59,130,246,0.15);
        }
        button:hover:not(:disabled){
          transform: translateY(-2px);
        }
      `}</style>

      {/* HEADER */}
{/* HEADER */}
<div style={styles.header}>
  <div style={styles.headerLeft}>
    <div style={styles.avatar}>🛡️</div>
    <div>
      <h1 style={styles.title}>Warden Dashboard</h1>
      <p style={styles.subtitle}>Manage student gate pass approvals</p>
    </div>
  </div>

  <button onClick={handleLogout} style={styles.logoutBtn}>
    Logout
  </button>
</div>



      {/* MAIN */}
      <div style={styles.container}>

        {/* PENDING BOX */}
        <div style={styles.pendingBox}>
          <span style={styles.pendingText}>Pending Requests</span>
          <span style={styles.pendingCount}>{passes.length}</span>
        </div>

        {loading ? (
          <p style={styles.loadingText}>Loading passes...</p>
        ) : passes.length === 0 ? (
          <div style={styles.empty}>✅ No pending requests</div>
        ) : (
          <div style={styles.grid}>
            {passes.map(p => (
              <div key={p.id} style={styles.card} className="card">
                <h3 style={styles.cardTitle}>Pass #{p.id}</h3>
                <p><strong>Student ID:</strong> {p.student_id}</p>
                {p.purpose && <p><strong>Purpose:</strong> {p.purpose}</p>}
                {p.destination && <p><strong>Destination:</strong> {p.destination}</p>}

                <div style={styles.actions}>
                  <button
                    style={styles.approve}
                    onClick={() => approve(p.id)}
                    disabled={processingId === p.id}
                  >
                    ✔ Approve
                  </button>
                  <button
                    style={styles.reject}
                    onClick={() => reject(p.id)}
                    disabled={processingId === p.id}
                  >
                    ✖ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #111827, #1e293b)",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    color: "#f1f5f9"
  },

  header: {
    padding: "25px 60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px"
  },

  avatar: {
    width: "54px",
    height: "54px",
    background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  },

  title: {
    fontSize: "28px",
    fontWeight: 700
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "14px"
  },

  logoutBtn: {
    background: "linear-gradient(135deg,#f87171,#ef4444)",
    border: "none",
    color: "white",
    padding: "10px 22px",
    borderRadius: "30px",
    cursor: "pointer",
    fontWeight: 600
  },

  container: {
    padding: "40px 60px"
  },

  pendingBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(96,165,250,0.1)",
    padding: "16px 24px",
    borderRadius: "16px",
    marginBottom: "25px",
    border: "1px solid rgba(96,165,250,0.3)"
  },

  pendingText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#93c5fd"
  },

  pendingCount: {
    background: "#3b82f6",
    padding: "6px 16px",
    borderRadius: "20px",
    fontWeight: "700"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "25px"
  },

  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "24px",
    transition: "0.3s"
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    fontWeight: "600"
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "18px"
  },

  approve: {
    flex: 1,
    background: "linear-gradient(135deg,#86efac,#4ade80)",
    border: "none",
    padding: "12px",
    borderRadius: "30px",
    color: "#064e3b",
    fontWeight: "600",
    cursor: "pointer"
  },

  reject: {
    flex: 1,
    background: "linear-gradient(135deg,#fca5a5,#f87171)",
    border: "none",
    padding: "12px",
    borderRadius: "30px",
    color: "#7f1d1d",
    fontWeight: "600",
    cursor: "pointer"
  },

  loadingText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#94a3b8"
  },

  empty: {
    textAlign: "center",
    background: "rgba(255,255,255,0.03)",
    padding: "40px",
    borderRadius: "20px"
  }
};
