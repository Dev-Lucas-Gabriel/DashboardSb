import { useState } from "react";
import { Plus } from "lucide-react";
import { todayISO } from "../utils/format";

export default function NewEntryForm({ onAdd }) {
  const [form, setForm] = useState({ date: todayISO(), entrada: "", saida: "", nota: "" });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const entrada = parseFloat(form.entrada.replace(",", ".")) || 0;
    const saida = parseFloat(form.saida.replace(",", ".")) || 0;
    if (!form.date) {
      setError("Escolha uma data.");
      return;
    }
    if (entrada === 0 && saida === 0) {
      setError("Informe ao menos um valor de entrada ou saída.");
      return;
    }
    setError("");
    onAdd({ date: form.date, entrada, saida, nota: form.nota });
    setForm({ date: form.date, entrada: "", saida: "", nota: "" });
  }

  return (
    <div className="panel">
      <div className="panel-title">Novo lançamento</div>
      <form onSubmit={handleSubmit} className="form">
        <label className="field-label">
          Data
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input"
          />
        </label>
        <label className="field-label">
          Entrada (R$)
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={form.entrada}
            onChange={(e) => setForm({ ...form, entrada: e.target.value })}
            className="input"
          />
        </label>
        <label className="field-label">
          Saída (R$)
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={form.saida}
            onChange={(e) => setForm({ ...form, saida: e.target.value })}
            className="input"
          />
        </label>
        <label className="field-label">
          Nota (opcional)
          <input
            type="text"
            placeholder="ex: venda balcão, aluguel, fornecedor…"
            value={form.nota}
            onChange={(e) => setForm({ ...form, nota: e.target.value })}
            className="input"
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="add-btn">
          <Plus size={16} /> Adicionar lançamento
        </button>
      </form>
    </div>
  );
}
