import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    loadPasses();
    const interval = setInterval(loadPasses, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadPasses() {
    try {
      const res = await api.get("/passes/student");
      const passesData = res.data.passes;
      setPasses(passesData);

      const approved = passesData.filter(p => p.warden_status === "approved").length;
      const pending = passesData.filter(p => p.warden_status === "pending").length;
      const rejected = passesData.filter(p => p.warden_status === "rejected").length;

      setStats({
        total: passesData.length,
        approved,
        pending,
        rejected
      });
    } catch (err) {
      console.error("Failed to load passes", err);
    } finally {
      setLoading(false);
    }
  }

  const getParentStatus = (confirmed) => {
    if (confirmed === 1) return { text: "Approved", color: "#22c55e" };
    if (confirmed === -1) return { text: "Rejected", color: "#ef4444" };
    return { text: "Pending", color: "#facc15" };
  };

  const getWardenStatus = (status) => {
    if (status === "approved") return { text: "Approved", color: "#22c55e" };
    if (status === "rejected") return { text: "Rejected", color: "#ef4444" };
    return { text: "Pending", color: "#facc15" };
  };

  return (
    <div style={styles.pageContainer}>
      <style>{`
        .glass {
          backdrop-filter: blur(14px);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 25px rgba(59,130,246,0.8);
        }

        .pass-glow {
          position: relative;
          overflow: hidden;
        }

        .pass-glow::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: 16px;
          background: linear-gradient(120deg, #3b82f6, #60a5fa, #22c55e);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          animation: glow 4s linear infinite;
        }

        @keyframes glow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .stat-card {
          transition: 0.4s ease;
        }

        .stat-card:hover {
          transform: translateY(-6px) scale(1.03);
        }
      `}</style>

      {/* HEADER */}
      <div style={styles.header} className="glass">
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.avatarCircle}>🎓</div>
            <div>
              <h1 style={styles.headerTitle}>Student Dashboard</h1>
              <p style={styles.headerSubtitle}>Manage your gate passes</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton} className="btn-hover">
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* STATS */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg,#2563eb,#1e3a8a)" }} className="glass stat-card">
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Total Passes</div>
          </div>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg,#16a34a,#065f46)" }} className="glass stat-card">
            <div style={styles.statValue}>{stats.approved}</div>
            <div style={styles.statLabel}>Approved</div>
          </div>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg,#f59e0b,#92400e)" }} className="glass stat-card">
            <div style={styles.statValue}>{stats.pending}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>
          <div style={{ ...styles.statCard, background: "linear-gradient(135deg,#ef4444,#7f1d1d)" }} className="glass stat-card">
            <div style={styles.statValue}>{stats.rejected}</div>
            <div style={styles.statLabel}>Rejected</div>
          </div>
        </div>

        <button
          onClick={() => navigate("/create-pass")}
          style={styles.createButton}
          className="btn-hover"
        >
          ➕ Create New Pass
        </button>

        <div style={styles.passesSection} className="glass">
          <h2 style={styles.sectionTitle}>Your Gate Passes</h2>

          {loading ? (
            <p style={{ color: "#94a3b8" }}>Loading...</p>
          ) : (
            <div style={styles.passesList}>
              {passes.map((p) => {
              const parentStatus = getParentStatus(p.parent_confirmed);
const wardenStatus = getWardenStatus(p.warden_status);


                return (
                  <div key={p.id} style={styles.passCard} className="pass-glow glass">
                    <h3>Pass #{p.id}</h3>
                    <p>Purpose: {p.purpose}</p>
                    <p>Destination: {p.destination}</p>

                    <p>
  Parent Status: 
  <span style={{ color: parentStatus.color, fontWeight: "600" }}>
    {" "}{parentStatus.text}
  </span>
</p>

<p>
  Warden Status: 
  <span style={{ color: wardenStatus.color, fontWeight: "600" }}>
    {" "}{wardenStatus.text}
  </span>
</p>



                    {p.warden_status === "approved" && p.parent_confirmed === 1 && p.qr_token && (
                      <div style={styles.approvedBanner}>
                        <strong>✅ QR Generated</strong>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${p.qr_token}`}
                          alt="QR"
                          style={{ margin: "10px 0" }}
                        />
                        <a
                          href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${p.qr_token}`}
                          download={`GatePass_${p.id}.png`}
                          style={styles.downloadBtn}
                        >
                          ⬇ Download QR
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "'Poppins', Segoe UI, sans-serif"
  },

  header: { padding: "25px 40px" },
  headerContent: { display: "flex", justifyContent: "space-between", alignItems: "center" },

  headerLeft: { display: "flex", gap: "15px", alignItems: "center" },
  avatarCircle: {
    width: 55,
    height: 55,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24
  },

  headerTitle: { fontSize: 26, fontWeight: "700" },
  headerSubtitle: { fontSize: 14, color: "#94a3b8" },

  logoutButton: {
    background: "linear-gradient(135deg,#ef4444,#b91c1c)",
    border: "none",
    color: "white",
    padding: "12px 20px",
    borderRadius: "28px",
    cursor: "pointer"
  },

  mainContent: { padding: "40px" },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 20
  },

  statCard: {
    padding: 25,
    borderRadius: 18,
    textAlign: "center"
  },

  statValue: { fontSize: 34, fontWeight: "800" },
  statLabel: { fontSize: 15, opacity: 0.9 },

  createButton: {
    margin: "30px 0",
    padding: "16px 32px",
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    borderRadius: "40px",
    border: "none",
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer"
  },

  passesSection: { padding: 25, borderRadius: 18 },
  sectionTitle: { marginBottom: 20, fontSize: 22 },

  passesList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: 20
  },

  passCard: { padding: 20, borderRadius: 16 },

  approvedBanner: {
    marginTop: 10,
    background: "rgba(16,185,129,0.15)",
    padding: 12,
    borderRadius: 10,
    textAlign: "center"
  },

  downloadBtn: {
    display: "block",
    marginTop: 10,
    background: "#10b981",
    padding: "10px 16px",
    borderRadius: 8,
    color: "white",
    textDecoration: "none",
    fontWeight: "600"
  }
};
