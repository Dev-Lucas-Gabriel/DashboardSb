import { useMemo, useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import FilterBar from "./components/FilterBar";
import StatGrid from "./components/StatCard";
import { DailyProfitChart, MonthlyHistoryChart } from "./components/Charts";
import NewEntryForm from "./components/NewEntryForm";
import Ledger from "./components/Ledger";
import Goals from "./components/Goals";
import { useAuth } from "./hooks/useAuth";
import { useEntries } from "./hooks/useEntries";
import { useGoals } from "./hooks/useGoals";
import { MONTH_NAMES, todayISO, firstDayOfMonth, lastDayOfMonth, fmtShort } from "./utils/format";

export default function App() {
  const { user, checking, signIn, signOut } = useAuth();
  const { entries, loading, saveError, addEntry, removeEntry } = useEntries(!!user);
  const {
    goals,
    saveError: goalsSaveError,
    addGoal,
    updateGoal,
    addProgress,
    setProgress,
    removeGoal,
  } = useGoals(!!user);

  const today = todayISO();
  const [rangeStart, setRangeStart] = useState(firstDayOfMonth(today));
  const [rangeEnd, setRangeEnd] = useState(today);

  const safeStart = rangeStart <= rangeEnd ? rangeStart : rangeEnd;
  const safeEnd = rangeStart <= rangeEnd ? rangeEnd : rangeStart;

  const rangeEntries = useMemo(
    () => entries.filter((e) => e.date >= safeStart && e.date <= safeEnd).sort((a, b) => a.date.localeCompare(b.date)),
    [entries, safeStart, safeEnd]
  );

  const totals = useMemo(() => {
    const entrada = rangeEntries.reduce((s, e) => s + e.entrada, 0);
    const saida = rangeEntries.reduce((s, e) => s + e.saida, 0);
    const lucro = entrada - saida;
    const margem = entrada > 0 ? (lucro / entrada) * 100 : 0;
    return { entrada, saida, lucro, margem };
  }, [rangeEntries]);

  const dailyChartData = useMemo(() => {
    const byDay = {};
    rangeEntries.forEach((e) => {
      if (!byDay[e.date]) byDay[e.date] = { date: e.date, entrada: 0, saida: 0 };
      byDay[e.date].entrada += e.entrada;
      byDay[e.date].saida += e.saida;
    });
    return Object.values(byDay)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({ ...d, lucro: d.entrada - d.saida, label: fmtShort(d.date) }));
  }, [rangeEntries]);

  const monthlyHistory = useMemo(() => {
    const byMonth = {};
    entries.forEach((e) => {
      const k = e.date.slice(0, 7);
      if (!byMonth[k]) byMonth[k] = { key: k, entrada: 0, saida: 0 };
      byMonth[k].entrada += e.entrada;
      byMonth[k].saida += e.saida;
    });
    return Object.values(byMonth)
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-6)
      .map((m) => ({ ...m, lucro: m.entrada - m.saida, label: MONTH_NAMES[Number(m.key.slice(5, 7)) - 1].slice(0, 3) }));
  }, [entries]);

  const sameMonth = safeStart.slice(0, 7) === safeEnd.slice(0, 7);
  const periodLabel =
    sameMonth && safeStart.endsWith("-01") && safeEnd === lastDayOfMonth(safeStart)
      ? `${MONTH_NAMES[Number(safeStart.slice(5, 7)) - 1]} ${safeStart.slice(0, 4)}`
      : `${fmtShort(safeStart)}/${safeStart.slice(0, 4)} — ${fmtShort(safeEnd)}/${safeEnd.slice(0, 4)}`;

  if (checking) {
    return (
      <div className="root">
        <div className="loading-screen">
          <div className="spinner" />
          <div className="loading-text">Verificando sua sessão…</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onSignIn={signIn} />;
  }

  if (loading) {
    return (
      <div className="root">
        <div className="loading-screen">
          <div className="spinner" />
          <div className="loading-text">Abrindo o caixa da SBSHOP…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="root">
      <Header userEmail={user.email} onSignOut={signOut} />

      <FilterBar
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        entries={entries}
      />

      {(saveError || goalsSaveError) && (
        <div className="error-banner">Não foi possível salvar automaticamente agora. Tente novamente em instantes.</div>
      )}

      <StatGrid totals={totals} />

      <section className="main-grid">
        <div className="panel">
          <DailyProfitChart data={dailyChartData} periodLabel={periodLabel} />
          <div className="divider" />
          <MonthlyHistoryChart data={monthlyHistory} />
        </div>

        <div className="side-panel">
          <NewEntryForm onAdd={addEntry} />
        </div>
      </section>

      <Goals
        goals={goals}
        entries={entries}
        onAdd={addGoal}
        onUpdate={updateGoal}
        onAddProgress={addProgress}
        onSetProgress={setProgress}
        onRemove={removeGoal}
      />

      <Ledger entries={rangeEntries} periodLabel={periodLabel} onRemove={removeEntry} />
    </div>
  );
}
