// apps/web/src/pages/Home.tsx
import { useEffect, useState } from "react";
import { apiGet, apiPost, setToken, getToken, clearToken } from "../api/client";

type User = {
  id: number;
  email: string;
  username: string;
  created_at: string;
};

type TokenResponse = {
  access_token: string;
  token_type?: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<User | null>(null);

  // register fields
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function loadUsers() {
    const data = await apiGet("/users");
    setUsers(data);
  }

  async function loadMe() {
    try {
      const data = await apiGet("/auth/me");
      setMe(data);
    } catch {
      setMe(null);
    }
  }

  useEffect(() => {
    setError(null);
    setStatus(null);

    // on page load: if token exists, try to load /me, then users
    if (getToken()) {
      loadMe()
        .then(() => loadUsers())
        .catch((e) => setError(String(e)));
    } else {
      // optional: still load users if you keep it public
      loadUsers().catch((e) => setError(String(e)));
    }
  }, []);

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    try {
      const user = await apiPost("/auth/register", {
        email: regEmail,
        username: regUsername,
        password: regPassword,
      });
      setStatus(`Registered: ${user.email}. Now log in.`);
      setRegEmail("");
      setRegUsername("");
      setRegPassword("");
      await loadUsers();
    } catch (e) {
      setError(String(e));
    }
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    try {
      const res: TokenResponse = await apiPost("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (!res.access_token) throw new Error("No access_token returned");
      setToken(res.access_token);

      setStatus("Logged in!");
      await loadMe();
      await loadUsers();

      setLoginEmail("");
      setLoginPassword("");
    } catch (e) {
      setError(String(e));
    }
  }

  function onLogout() {
    clearToken();
    setMe(null);
    setStatus("Logged out.");
  }

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h1>Lito</h1>

      <div style={{ marginBottom: 16 }}>
        <b>Auth status:</b>{" "}
        {me ? (
          <>
            Logged in as <b>{me.username}</b> ({me.email}){" "}
            <button onClick={onLogout} style={{ marginLeft: 12 }}>
              Logout
            </button>
          </>
        ) : (
          "Not logged in"
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <h2>Register</h2>
          <form onSubmit={onRegister} style={{ display: "grid", gap: 8 }}>
            <input
              placeholder="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            <input
              placeholder="username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
            />
            <input
              placeholder="password (min 8)"
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            <button type="submit">Register</button>
          </form>
        </div>

        <div>
          <h2>Login</h2>
          <form onSubmit={onLogin} style={{ display: "grid", gap: 8 }}>
            <input
              placeholder="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              placeholder="password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
      {error && <p style={{ marginTop: 12 }}>Error: {error}</p>}

      <h2 style={{ marginTop: 24 }}>Users</h2>
      <button
        onClick={() => loadUsers().catch((e) => setError(String(e)))}
        style={{ marginBottom: 12 }}
      >
        Refresh users
      </button>

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
