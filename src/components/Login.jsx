import { useState } from "react";
import { Store, LogIn } from "lucide-react";

export default function Login({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await onSignIn(email, password);
    setSubmitting(false);
    if (error) {
      setError("E-mail ou senha incorretos.");
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="brand-mark" style={{ margin: "0 auto 14px" }}>
          <Store size={22} color="#0A0A0C" strokeWidth={2.4} />
        </div>
        <div className="brand-name" style={{ textAlign: "center" }}>SBSHOP</div>
        <div className="brand-sub" style={{ textAlign: "center", marginBottom: 24 }}>
          Entre com sua conta da equipe
        </div>
        <form onSubmit={handleSubmit} className="form">
          <label className="field-label">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              autoComplete="email"
              required
            />
          </label>
          <label className="field-label">
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoComplete="current-password"
              required
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="add-btn" disabled={submitting}>
            <LogIn size={16} /> {submitting ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <div className="login-hint">
          Não tem conta ainda? Peça para quem administra o painel criar seu acesso no Supabase.
        </div>
      </div>
    </div>
  );
}
