import { useMemo, useState } from "react";
import { Target, Plus, Trash2, PlusCircle } from "lucide-react";
import { fmtBRL, MONTH_NAMES } from "../utils/format";

const TIPO_LABEL = {
  lucro: "Meta de lucro mensal",
  faturamento: "Meta de faturamento",
  gastos: "Limite de gastos",
  personalizada: "Meta personalizada",
};

function monthLabel(mesISO) {
  if (!mesISO) return "";
  const [y, m] = mesISO.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function computeCurrent(goal, entries) {
  if (goal.tipo === "personalizada") return Number(goal.valor_atual) || 0;
  const mesKey = (goal.mes || "").slice(0, 7);
  const doMes = entries.filter((e) => e.date.slice(0, 7) === mesKey);
  if (goal.tipo === "lucro") return doMes.reduce((s, e) => s + e.entrada - e.saida, 0);
  if (goal.tipo === "faturamento") return doMes.reduce((s, e) => s + e.entrada, 0);
  if (goal.tipo === "gastos") return doMes.reduce((s, e) => s + e.saida, 0);
  return 0;
}

function GoalCard({ goal, entries, onAddProgress, onRemove }) {
  const [addValue, setAddValue] = useState("");
  const current = computeCurrent(goal, entries);
  const target = Number(goal.valor_alvo) || 0;
  const isLimite = goal.tipo === "gastos";
  const percent = target > 0 ? (current / target) * 100 : 0;
  const barWidth = Math.min(100, Math.max(0, percent));
  const over = isLimite ? current > target : false;
  const achieved = !isLimite && target > 0 && current >= target;
  const barColor = over ? "var(--down)" : achieved ? "var(--up)" : "var(--gold)";

  function handleAddProgress(e) {
    e.preventDefault();
    const amount = parseFloat(addValue.replace(",", ".")) || 0;
    if (amount === 0) return;
    onAddProgress(goal.id, amount);
    setAddValue("");
  }

  return (
    <div className="goal-card">
      <div className="goal-head">
        <div>
          <div className="goal-title">{goal.titulo || TIPO_LABEL[goal.tipo]}</div>
          <div className="goal-sub">
            {TIPO_LABEL[goal.tipo]}
            {goal.mes ? ` · ${monthLabel(goal.mes)}` : ""}
            {goal.prazo ? ` · até ${goal.prazo.split("-").reverse().join("/")}` : ""}
          </div>
        </div>
        <button className="del-btn" onClick={() => onRemove(goal.id)} aria-label="Excluir meta">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="goal-bar-track">
        <div className="goal-bar-fill" style={{ width: `${barWidth}%`, background: barColor }} />
      </div>

      <div className="goal-values">
        <span style={{ color: barColor, fontWeight: 600 }}>{fmtBRL(current)}</span>
        <span className="goal-target">
          {isLimite ? "limite de " : "meta de "}
          {fmtBRL(target)} · {percent.toFixed(0)}%
        </span>
      </div>

      {over && <div className="goal-warning">Limite ultrapassado.</div>}
      {achieved && <div className="goal-success">Meta atingida!</div>}

      {goal.tipo === "personalizada" && (
        <form onSubmit={handleAddProgress} className="goal-progress-form">
          <input
            type="text"
            inputMode="decimal"
            placeholder="Registrar valor (R$)"
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            className="input"
          />
          <button type="submit" className="goal-add-progress-btn" aria-label="Adicionar progresso">
            <PlusCircle size={16} />
          </button>
        </form>
      )}
    </div>
  );
}

function NewGoalForm({ onAdd, currentMonthISO }) {
  const [tipo, setTipo] = useState("lucro");
  const [titulo, setTitulo] = useState("");
  const [valorAlvo, setValorAlvo] = useState("");
  const [mes, setMes] = useState(currentMonthISO.slice(0, 7));
  const [prazo, setPrazo] = useState("");
  const [error, setError] = useState("");

  const isPersonalizada = tipo === "personalizada";

  function handleSubmit(e) {
    e.preventDefault();
    const valor = parseFloat(valorAlvo.replace(",", ".")) || 0;
    if (valor <= 0) {
      setError("Informe um valor alvo maior que zero.");
      return;
    }
    if (isPersonalizada && !titulo.trim()) {
      setError("Dê um nome para a meta personalizada.");
      return;
    }
    setError("");
    onAdd({
      tipo,
      titulo: isPersonalizada ? titulo : "",
      valor_alvo: valor,
      mes: isPersonalizada ? null : `${mes}-01`,
      prazo: isPersonalizada ? prazo || null : null,
    });
    setTitulo("");
    setValorAlvo("");
    setPrazo("");
  }

  return (
    <form onSubmit={handleSubmit} className="form goal-form">
      <label className="field-label">
        Tipo de meta
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input">
          <option value="lucro">Lucro mensal</option>
          <option value="faturamento">Faturamento mensal</option>
          <option value="gastos">Limite de gastos</option>
          <option value="personalizada">Personalizada</option>
        </select>
      </label>

      {isPersonalizada && (
        <label className="field-label">
          Nome da meta
          <input
            type="text"
            placeholder="ex: Comprar equipamento novo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input"
          />
        </label>
      )}

      <label className="field-label">
        Valor alvo (R$)
        <input
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={valorAlvo}
          onChange={(e) => setValorAlvo(e.target.value)}
          className="input"
        />
      </label>

      {isPersonalizada ? (
        <label className="field-label">
          Prazo (opcional)
          <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className="input" />
        </label>
      ) : (
        <label className="field-label">
          Mês
          <input type="month" value={mes} onChange={(e) => setMes(e.target.value)} className="input" />
        </label>
      )}

      {error && <div className="form-error">{error}</div>}
      <button type="submit" className="add-btn">
        <Plus size={16} /> Adicionar meta
      </button>
    </form>
  );
}

export default function Goals({ goals, entries, onAdd, onAddProgress, onRemove }) {
  const currentMonthISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <section className="panel">
      <div className="panel-title">
        <Target size={15} style={{ marginRight: 6, verticalAlign: -2 }} />
        Metas & objetivos
      </div>

      <div className="goals-layout">
        <div className="goals-list">
          {goals.length === 0 ? (
            <div className="empty-state">Nenhuma meta cadastrada ainda.</div>
          ) : (
            goals.map((g) => (
              <GoalCard key={g.id} goal={g} entries={entries} onAddProgress={onAddProgress} onRemove={onRemove} />
            ))
          )}
        </div>
        <div className="goals-new">
          <NewGoalForm onAdd={onAdd} currentMonthISO={currentMonthISO} />
        </div>
      </div>
    </section>
  );
}
