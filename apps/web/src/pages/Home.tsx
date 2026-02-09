import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api/client";

type User = {
  id: number;
  email: string;
  username: string;
  created_at: string;
};

export default function Home() {
  const [health, setHealth] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    setError(null);
    const data = await apiGet("/users"); // because base is /api
    setUsers(data);
  }

  useEffect(() => {
    loadUsers().catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiPost("/users", { email, username });
      setEmail("");
      setUsername("");
      await loadUsers();
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <h1>Lito</h1>

      <h2>Create user</h2>
      <form onSubmit={onCreate} style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      {error && <p style={{ marginTop: 12 }}>Error: {error}</p>}

      <h2 style={{ marginTop: 24 }}>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <b>{u.username}</b> — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
