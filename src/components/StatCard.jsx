import { Wallet, ShoppingCart, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { fmtBRL } from "../utils/format";

function StatCard({ icon, label, value, tone }) {
  const color = tone === "up" ? "var(--up)" : tone === "down" ? "var(--down)" : "var(--text)";
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ color }}>{value}</div>
      </div>
    </div>
  );
}

export default function StatGrid({ totals }) {
  return (
    <section className="stat-grid">
      <StatCard icon={<Wallet size={16} />} label="Entradas do período" value={fmtBRL(totals.entrada)} tone="neutral" />
      <StatCard icon={<ShoppingCart size={16} />} label="Saídas do período" value={fmtBRL(totals.saida)} tone="neutral" />
      <StatCard
        icon={totals.lucro >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        label="Lucro líquido"
        value={fmtBRL(totals.lucro)}
        tone={totals.lucro >= 0 ? "up" : "down"}
      />
      <StatCard icon={<Percent size={16} />} label="Margem" value={`${totals.margem.toFixed(1)}%`} tone={totals.margem >= 0 ? "up" : "down"} />
    </section>
  );
}
