import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import api from "../api/axios";

export default function QRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [result, setResult] = useState("");
  const [scanned, setScanned] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const scanStopped = useRef(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        videoRef.current.play();
        setCameraReady(true);
        scanLoop();
      } catch (err) {
        setCameraError(true);
      }
    }

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  function scanLoop() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    function loop() {
      if (scanStopped.current) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code && !scanned) {
          setScanned(true);
          scanStopped.current = true;

          const stream = videoRef.current.srcObject;
          if (stream) stream.getTracks().forEach(track => track.stop());

          handleDecode(code.data);
          return;
        }
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  async function handleDecode(data) {
  try {
    const res = await api.post("/passes/scan", {
      token: data,
      gate_id: "main_gate"   // ✅ IMPORTANT CHANGE: gate_id not gateId
    });

    if (res.data.allowed) {
      setResult(`✅ ${res.data.event.toUpperCase()} SUCCESS`);
    } else {
      setResult("❌ ACCESS DENIED: " + res.data.reason);
    }
  } catch (error) {
    console.error(error);
    setResult("❌ QR INVALID / EXPIRED");
  }
}


  const handleReset = () => {
    setScanned(false);
    setResult("");
    scanStopped.current = false;

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    }).then(stream => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      scanLoop();
      setCameraReady(true);
    });
  };

  if (cameraError) {
    return (
      <div style={styles.pageContainer}>
        <h2 style={{ color: "#fff" }}>Camera access denied</h2>
        <button style={styles.actionBtn} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <style>{`
        .glow-frame {
          position: relative;
          padding: 6px;
          border-radius: 20px;
          background: linear-gradient(120deg,#3b82f6,#60a5fa,#2563eb);
          animation: borderMove 5s linear infinite;
        }

        @keyframes borderMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .result-box {
          animation: fadeIn 0.8s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={styles.header}>
        <h2 style={styles.title}>Gate QR Scanner</h2>
        <button onClick={() => window.location.href = "/warden"} style={styles.backButton}>
          ← Back
        </button>
      </div>

      <div style={styles.mainContent}>

        <div className="glow-frame">
          <div style={styles.videoContainer}>
            <video ref={videoRef} style={styles.video}></video>

            {!cameraReady && (
              <div style={styles.loadingOverlay}>
                <p>Starting camera...</p>
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        {result && (
          <div style={styles.resultBox} className="result-box">
            <h3>{result}</h3>
            <button style={styles.actionBtn} onClick={handleReset}>
              Scan Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}


/* ===================== STYLES ===================== */

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    padding: "30px",
    color: "white"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#e2e8f0"
  },

  backButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    color: "white",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    fontWeight: "600"
  },

  mainContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  videoContainer: {
    width: "320px",
    height: "320px",
    borderRadius: "18px",
    overflow: "hidden",
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  loadingOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#93c5fd"
  },

  resultBox: {
    marginTop: "25px",
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    width: "320px",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  actionBtn: {
    marginTop: "12px",
    padding: "10px 18px",
    background: "linear-gradient(135deg,#60a5fa,#3b82f6)",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600"
  }
};
