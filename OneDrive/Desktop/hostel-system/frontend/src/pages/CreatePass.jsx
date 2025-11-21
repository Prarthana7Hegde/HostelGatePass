import { useState } from "react";
import api from "../api/axios";   // <--- YOU FORGOT THIS
import { useNavigate } from "react-router-dom";

export default function CreatePass() {
  const [purpose, setPurpose] = useState("");
  const [destination, setDest] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const navigate = useNavigate();


  async function submit(e) {
    e.preventDefault();

    await api.post("/passes", {
      purpose,
      destination,
      startTime: start,
      endTime: end
    });

    alert("Pass created!");
    navigate("/student");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Pass</h2>
      <form onSubmit={submit}>
        <input placeholder="Purpose" onChange={(e) => setPurpose(e.target.value)} /><br /><br />
        <input placeholder="Destination" onChange={(e) => setDest(e.target.value)} /><br /><br />
        <input type="datetime-local" onChange={(e) => setStart(e.target.value)} /><br /><br />
        <input type="datetime-local" onChange={(e) => setEnd(e.target.value)} /><br /><br />
        <button>Create</button>
      </form>
    </div>
  );
}
