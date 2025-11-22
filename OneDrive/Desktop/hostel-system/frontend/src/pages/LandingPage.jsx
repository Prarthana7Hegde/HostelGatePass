import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = 300;

    let particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() - 0.5,
      vy: Math.random() - 0.5
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#60a5fa";
        ctx.fill();

        particles.forEach(p2 => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(96,165,250,0.15)";
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>

      <div style={styles.heroWrapper}>
        <h1 style={styles.title}>
          Hostel Gate Pass Management System
        </h1>

        <p style={styles.subtitle}>
          A smart, secure and paperless solution for managing student movement
        </p>
<div style={styles.buttonGroup}>
  <button style={styles.blueBtn} onClick={() => navigate("/login?role=student")}>
    🎓 Login as Student
  </button>

  <button style={styles.blueBtn} onClick={() => navigate("/login?role=warden")}>
    🛡️ Login as Warden
  </button>

  <button style={styles.blueBtn} onClick={() => navigate("/login?role=guard")}>
    👮 Login as Guard
  </button>
</div>

      </div>

      {/* GLOWING FAQ SECTION */}
      <div style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>

        <div className="faq-glow">
          <strong>How does a student get a gate pass?</strong>
          <p>Student applies → Parent approves → Warden approves → QR generated.</p>
        </div>

        <div className="faq-glow">
          <strong>Is QR reusable?</strong>
          <p>No. Each QR is valid for limited scans only.</p>
        </div>

        <div className="faq-glow">
          <strong>Can warden track movements?</strong>
          <p>Yes, every scan is securely stored in the system.</p>
        </div>
      </div>

      <style>
        {`
        .faq-glow {
          position: relative;
          padding: 14px 18px;
          margin: 10px auto;
          max-width: 750px;
          border-radius: 14px;
          background: rgba(15,23,42,0.6);
          color: #cbd5f5;
          text-align: left;
          overflow: hidden;
        }

        .faq-glow::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: 14px;
          background: linear-gradient(120deg, #3b82f6, #60a5fa, #22c55e);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          animation: glowMove 4s linear infinite;
        }

        @keyframes glowMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .faq-glow strong {
          font-size: 14px;
          color: #e0e7ff;
        }

        .faq-glow p {
          font-size: 13px;
          margin-top: 6px;
          color: #94a3b8;
        }
        `}
      </style>

      <div style={styles.footer}>
        © 2025 Hostel Management System | All Rights Reserved
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    fontFamily: "Segoe UI, Arial, sans-serif"
  },

  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "300px",
    zIndex: 0
  },

  heroWrapper: {
    textAlign: "center",
    padding: "120px 20px 40px",
    position: "relative",
    zIndex: 2
  },

  title: {
    fontSize: "46px",
    fontWeight: "800"
  },

  subtitle: {
    fontSize: "18px",
    opacity: 0.85,
    marginBottom: "40px"
  },

  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },

  blueBtn: {
    padding: "15px 34px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    border: "none",
    borderRadius: "40px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  },

  faqSection: {
    marginTop: "-40px",
    padding: "10px 20px 25px",
    textAlign: "center"
  },

  faqTitle: {
    fontSize: "20px",
    marginBottom: "14px",
    color: "#c7d2fe"
  },

  footer: {
    background: "#020617",
    textAlign: "center",
    padding: "20px",
    fontSize: "14px"
  }
};
