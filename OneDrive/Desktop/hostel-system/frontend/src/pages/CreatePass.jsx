import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePass() {
  if (localStorage.getItem("role") !== "student") {
    window.location.href = "/";
  }

  const [purpose, setPurpose] = useState("");
  const [destination, setDest] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/passes", {
        purpose,
        destination,
        startTime: start,
        endTime: end
      });

      alert("Pass created!");
      navigate("/student");
    } catch (err) {
      alert("Failed to create pass");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.pageContainer}>
      <style>{`
        .glass {
          backdrop-filter: blur(18px);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .hover-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 25px rgba(59,130,246,0.7);
        }

        .animated-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.25);
        }

        .form-card {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* HEADER */}
      <div style={styles.header} className="glass">
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.avatarCircle}>📝</div>
            <div>
              <h1 style={styles.headerTitle}>Create Gate Pass</h1>
              <p style={styles.headerSubtitle}>Fill in the details for your request</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/student")}
            style={styles.backButton}
            className="hover-btn"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.mainContent}>
        <div style={styles.formCard} className="glass form-card">

          <form onSubmit={submit} style={styles.form}>
            <h2 style={styles.sectionTitle}>Pass Details</h2>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Purpose</label>
              <input
                placeholder="e.g. Medical, Personal work"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                style={styles.input}
                className="animated-input"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Destination</label>
              <input
                placeholder="e.g. Home, Hospital"
                value={destination}
                onChange={(e) => setDest(e.target.value)}
                style={styles.input}
                className="animated-input"
                required
              />
            </div>

            <h2 style={styles.sectionTitle}>Time Schedule</h2>

            <div style={styles.timeGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  style={styles.input}
                  className="animated-input"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>End Time</label>
                <input
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  style={styles.input}
                  className="animated-input"
                  required
                />
              </div>
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => navigate("/student")}
                style={styles.cancelButton}
                className="hover-btn"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="hover-btn"
                style={{
                  ...styles.submitButton,
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Creating..." : "✅ Create Pass"}
              </button>
            </div>
          </form>
        </div>

        {/* TIPS CARD */}
        <div style={styles.tipsCard} className="glass">
          <h3 style={styles.tipsTitle}>Helpful Tips</h3>
          <ul style={styles.tipsList}>
            <li>✔ Be clear with your purpose</li>
            <li>✔ Use correct timings</li>
            <li>✔ Double-check details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "'Poppins', 'Inter', sans-serif",
    color: "white"
  },

  header: { padding: "22px 40px" },
  headerContent: { display: "flex", justifyContent: "space-between", alignItems: "center" },

  headerLeft: { display: "flex", gap: "16px", alignItems: "center" },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26
  },

  headerTitle: {
    fontSize: "26px",
    fontWeight: "700",
    background: "linear-gradient(90deg,#60a5fa,#93c5fd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  headerSubtitle: { color: "#94a3b8" },

  backButton: {
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    color: "white",
    padding: "12px 26px",
    border: "none",
    borderRadius: "40px",
    cursor: "pointer"
  },

  mainContent: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px",
    padding: "40px"
  },

  formCard: {
    borderRadius: "22px",
    padding: "36px"
  },

  form: { display: "flex", flexDirection: "column", gap: "20px" },

  sectionTitle: { fontSize: "20px", marginBottom: "5px" },

  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },

  label: { color: "#cbd5f5", fontWeight: "600" },

  input: {
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(15,23,42,0.8)",
    border: "1px solid #334155",
    color: "white",
    outline: "none"
  },

  timeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },

  actions: {
    display: "flex",
    gap: "16px",
    marginTop: "10px"
  },

  cancelButton: {
    flex: 1,
    background: "transparent",
    border: "1px solid #475569",
    borderRadius: "30px",
    color: "#cbd5f5",
    padding: "14px"
  },

  submitButton: {
    flex: 2,
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    border: "none",
    borderRadius: "30px",
    color: "white",
    padding: "14px",
    fontWeight: "600"
  },

  tipsCard: {
    borderRadius: "22px",
    padding: "30px",
    height: "fit-content"
  },

  tipsTitle: {
    marginBottom: "10px",
    fontSize: "18px"
  },

  tipsList: {
    listStyle: "none",
    padding: 0,
    color: "#cbd5f5"
  }
};
