import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [rollNo, setRollNo] = useState("");
  const [room, setRoom] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
        rollNo,
        room,
        parentName,
        parentEmail,
        parentPhone
      });

      alert("✅ Registration successful! Please login.");
      window.location.href = "/";
    } catch (err) {
      alert("❌ Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.pageContainer}>
      <style>{`
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.3);
          background: rgba(15,23,42,0.9);
        }

        .card {
          animation: slideUp 0.8s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* 🔥 BUTTON MAGIC */
        .glow-btn {
          position: relative;
          overflow: hidden;
        }

        .glow-btn::before {
          content: "";
          position: absolute;
          inset: -2px;
          background: linear-gradient(120deg,#3b82f6,#9333ea,#06b6d4);
          z-index: -1;
          blur: 20px;
          opacity: 0;
          transition: 0.4s;
        }

        .glow-btn:hover::before {
          opacity: 1;
          filter: blur(18px);
        }

        .glow-btn::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: 0.6s;
        }

        .glow-btn:hover::after {
          left: 100%;
        }

        .glow-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 45px rgba(59,130,246,0.6);
        }

        .glow-btn:active {
          transform: scale(0.96);
        }
      `}</style>

      <div style={styles.registerCard} className="card">
        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.subtitle}>Hostel Gate Pass System</p>

        <form onSubmit={handleRegister} style={styles.form}>

          <input className="input-field" style={styles.input}
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input className="input-field" style={styles.input}
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div style={{ position: "relative" }}>
            <input
              className="input-field"
              style={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <select className="input-field" style={styles.input} value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="warden">Warden</option>
          </select>

          {role === "student" && (
            <>
              <input className="input-field" style={styles.input}
                placeholder="Roll Number"
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                required
              />
              <input className="input-field" style={styles.input}
                placeholder="Room Number"
                value={room}
                onChange={e => setRoom(e.target.value)}
                required
              />
              <input className="input-field" style={styles.input}
                placeholder="Parent Name"
                value={parentName}
                onChange={e => setParentName(e.target.value)}
              />
              <input className="input-field" style={styles.input}
                placeholder="Parent Email"
                value={parentEmail}
                onChange={e => setParentEmail(e.target.value)}
                required
              />
              <input className="input-field" style={styles.input}
                placeholder="Parent Phone"
                value={parentPhone}
                onChange={e => setParentPhone(e.target.value)}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="glow-btn"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "Registering..." : "Create Account 🚀"}
          </button>

        </form>
      </div>
    </div>
  );
}

/* ================= PREMIUM UI ================= */

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif"
  },

  registerCard: {
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "26px",
    padding: "45px",
    width: "440px",
    boxShadow: "0 30px 70px rgba(59,130,246,0.35)",
    border: "1px solid rgba(255,255,255,0.06)"
  },

  title: {
    color: "white",
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center"
  },

  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "25px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    background: "rgba(30,41,59,0.85)",
    border: "1px solid #334155",
    color: "#e2e8f0",
    outline: "none",
    fontSize: "14px",
    transition: "0.3s"
  },

  button: {
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    border: "none",
    padding: "14px",
    borderRadius: "30px",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s"
  },

  eyeBtn: {
    position: "absolute",
    right: "14px",
    top: "14px",
    background: "none",
    border: "none",
    color: "#9ca3af",
    cursor: "pointer"
  }
};
