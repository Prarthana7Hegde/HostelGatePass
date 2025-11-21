import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role
      });

      alert("Registration successful ✅ Now login.");
      window.location.href = "/";
    } catch (err) {
      alert("Registration failed");
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Sign Up</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        /><br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br /><br />

        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="warden">Warden</option>
        </select><br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
