import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import api from "../api/axios";

export default function QRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanStopped = useRef(false);

  const [result, setResult] = useState("");
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", true);
      videoRef.current.play();
      scanLoop();
    }
    startCamera();
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
          console.log("QR DETECTED:", code.data);
          setScanned(true);
          handleDecode(code.data);
        }
      }
      requestAnimationFrame(loop);
    }

    loop();
  }

  async function handleDecode(data) {
    try {
      console.log("Sending QR to backend:", data);

      const res = await api.post("/passes/scan", {
        token: data,
        gateId: "main_gate"
      });

      console.log("Backend Response:", res.data);

      if (res.data.allowed) {
        setResult(`✔ ${res.data.event.toUpperCase()} SUCCESS`);

        // ✅ HARD STOP SCANNING AFTER FIRST SUCCESS
        scanStopped.current = true;

        const stream = videoRef.current.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      } else {
        setResult("❌ ACCESS DENIED: " + res.data.reason);
      }
    } catch (err) {
      console.error("SCAN ERROR:", err.response?.data || err.message);
      setResult("❌ ERROR SCANNING");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gate QR Scanner</h2>

      <video
        ref={videoRef}
        style={{
          width: "300px",
          border: "2px solid black",
          borderRadius: "6px",
        }}
      ></video>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <h3 style={{ marginTop: "20px" }}>{result}</h3>
    </div>
  );
}
