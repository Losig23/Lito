import { useEffect, useState } from "react";
import { apiGet } from "../api/client";

export default function Home() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    apiGet("/health").then(setHealth).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Lito</h1>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </div>
  );
}
