export default function QRView() {
  const qr = localStorage.getItem("qr_code");

  if (!qr) return <h2>No QR Available</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>QR Code</h2>
      <p>Show this at the gate:</p>

      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qr}`}
        alt="QR Code"
      />
    </div>
  );
}
