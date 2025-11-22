import { useState } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialRole = params.get("role") || "student";

const [selectedRole, setSelectedRole] = useState(initialRole);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        role: selectedRole,
      });

      const { token, role } = res.data;

      if (role.toLowerCase() !== selectedRole.toLowerCase()) {
        alert(`Invalid ${selectedRole} credentials ❌`);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (onLogin) onLogin(role);
if (role === "student") navigate("/student");
else if (role === "warden") navigate("/warden");
else if (role === "admin") navigate("/admin");
else if (role === "guard") navigate("/guard");


    } catch (err) {
      const msg = err.response?.data?.error || "Invalid credentials ❌";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.pageContainer}>
      <style>
        {`
        .glass-card {
          backdrop-filter: blur(18px);
          transition: 0.4s ease;
        }

        .glass-card:hover {
          box-shadow: 0 30px 70px rgba(0,0,0,0.6);
        }

        /* INPUT FIX */
        .animated-input {
          background: #111827 !important;
          color: #e5e7eb !important;
          caret-color: #60a5fa;
        }

        .animated-input::placeholder {
          color: #64748b;
        }

        .animated-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.3);
          background: #0f172a !important;
        }

        .login-btn {
          transition: 0.3s ease;
        }

        .login-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(59,130,246,0.6);
        }
      `}
      </style>

      <div style={styles.splitContainer}>

        {/* LEFT PANEL */}
        <div style={styles.leftPanel} className="glass-card">
          <div style={styles.logoSection}>
            <div style={styles.logoCircle}>🎓</div>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to continue</p>
            <p style={styles.roleText}>
              Logging in as <span>{selectedRole}</span>
            </p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            

            <div>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="animated-input"
                style={styles.input}
                required
              />
            </div>

            <div>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="animated-input"
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p style={styles.registerText}>
              Don't have an account?{" "}
              <a href="/register" style={styles.registerLink}>Sign up</a>
            </p>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.rightPanel} className="glass-card">
          <h2 style={styles.decorativeTitle}>Gate Pass Management System</h2>
          <p style={styles.decorativeText}>
            A modern secure solution for controlling and tracking student movement inside hostels.
          </p>

          <div style={styles.featuresList}>
            {[
              "Digital gate passes",
              "Parent approval system",
              "QR verification",
              "Real-time monitoring"
            ].map((feat, i) => (
              <div key={i} style={styles.featureItem}>
                <span style={styles.featureIcon}>✔</span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif"
  },

  splitContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    minHeight: "100vh"
  },

  leftPanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "80px",
    color: "white"
  },

  rightPanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "80px",
    color: "white",
    background: "linear-gradient(135deg, rgba(59,130,246,0.05), rgba(15,23,42,0.95))"
  },

  logoSection: { marginBottom: "30px" },
  logoCircle: { fontSize: "50px" },
  title: { fontSize: "32px", fontWeight: "700" },
  subtitle: { color: "#94a3b8" },
  roleText: { color: "#60a5fa", marginTop: "5px" },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  label: { fontSize: "14px", color: "#cbd5f5" },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #334155",
    outline: "none",
    fontSize: "14px"
  },

  passwordWrapper: { position: "relative" },

  eyeButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer"
  },

  loginButton: {
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    padding: "16px",
    borderRadius: "30px",
    border: "none",
    color: "white",
    fontWeight: "600",
    fontSize: "16px"
  },

  registerText: { textAlign: "center", fontSize: "14px" },
  registerLink: { color: "#60a5fa" },

  decorativeTitle: { fontSize: "28px", marginBottom: "10px" },
  decorativeText: { color: "#94a3b8", marginBottom: "20px" },

  featuresList: { display: "flex", flexDirection: "column", gap: "10px" },
  featureItem: { display: "flex", gap: "10px", color: "#cbd5f5" },
  featureIcon: { color: "#3b82f6" }
};
