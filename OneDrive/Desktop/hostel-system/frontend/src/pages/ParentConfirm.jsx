import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ParentConfirm() {
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    const action = params.get("action");

    window.location.href = 
      `http://localhost:4000/api/passes/parent-confirm?token=${token}&action=${action}`;
  }, []);

  return <h2>Please wait... Processing approval...</h2>;
}
