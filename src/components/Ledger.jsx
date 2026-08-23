import { Trash2, Receipt } from "lucide-react";
import { fmtBRL, fmtDatePt } from "../utils/format";

export default function Ledger({ entries, periodLabel, onRemove }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <Receipt size={15} style={{ marginRight: 6, verticalAlign: -2 }} />
        Extrato — {periodLabel}
      </div>
      {entries.length === 0 ? (
        <div className="empty-state">Nenhum lançamento neste período.</div>
      ) : (
        <div className="ledger">
          {entries
            .slice()
            .reverse()
            .map((e) => {
              const lucro = e.entrada - e.saida;
              return (
                <div key={e.id} className="ledger-row">
                  <div className="ledger-date">{fmtDatePt(e.date)}</div>
                  <div className="ledger-note">{e.nota || "—"}</div>
                  <div className="ledger-amt" style={{ color: "#3ECF8E" }}>
                    {e.entrada > 0 ? `+${fmtBRL(e.entrada)}` : "—"}
                  </div>
                  <div className="ledger-amt" style={{ color: "#E5584A" }}>
                    {e.saida > 0 ? `−${fmtBRL(e.saida)}` : "—"}
                  </div>
                  <div className="ledger-amt" style={{ color: lucro >= 0 ? "#2F80FF" : "#E5584A", fontWeight: 600 }}>
                    {fmtBRL(lucro)}
                  </div>
                  <button className="del-btn" onClick={() => onRemove(e.id)} aria-label="Excluir lançamento">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}
