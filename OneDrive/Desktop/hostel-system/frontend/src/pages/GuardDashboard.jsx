import QRScanner from "./QRScanner";

export default function GuardDashboard() {
  const role = localStorage.getItem("role");

  if (role !== "guard") {
    return <h2 style={{ padding: 20 }}>Access Denied ❌</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Gate Guard Scanner</h1>
      <QRScanner />
    </div>
  );
}
