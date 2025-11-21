import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function ParentConfirm() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Please wait while confirmation is processed...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Invalid confirmation link ❌");
      return;
    }

    // Call backend parent confirmation API
    api.get(`/passes/parent-confirm?token=${token}`)
      .then(res => {
        setMessage(res.data);
      })
      .catch(err => {
        setMessage("Invalid or expired confirmation link ❌");
      });

  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Parent Confirmation Page</h2>
      <p>{message}</p>
    </div>
  );
}
