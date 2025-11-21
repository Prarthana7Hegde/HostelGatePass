import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });

    const role = res.data.user.role;

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", role);

    onLogin(role);

    if (role === "student") window.location.href = "/student";
    if (role === "warden") window.location.href = "/warden";
    if (role === "admin") window.location.href = "/admin";

  } catch (err) {
    alert("Invalid login");
  }
}


  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        {/* ✅ Ensure this is submit */}
        <button type="submit">Login</button>
        <p>
  Don't have an account? 
  <a href="/register"> Sign up</a>
</p>

      </form>
    </div>
  );
}
