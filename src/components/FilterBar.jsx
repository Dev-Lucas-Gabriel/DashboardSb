import { Calendar } from "lucide-react";
import { todayISO, firstDayOfMonth, lastDayOfMonth, addDays, toISO } from "../utils/format";

export default function FilterBar({ rangeStart, rangeEnd, setRangeStart, setRangeEnd, entries }) {
  const today = todayISO();

  function applyPreset(preset) {
    if (preset === "month") {
      setRangeStart(firstDayOfMonth(today));
      setRangeEnd(today);
    } else if (preset === "7d") {
      setRangeStart(addDays(today, -6));
      setRangeEnd(today);
    } else if (preset === "30d") {
      setRangeStart(addDays(today, -29));
      setRangeEnd(today);
    } else if (preset === "all") {
      if (entries.length > 0) {
        const dates = entries.map((e) => e.date).sort();
        setRangeStart(dates[0]);
        setRangeEnd(dates[dates.length - 1]);
      }
    }
  }

  function shiftRangeByMonth(delta) {
    const [y, m] = rangeStart.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const newStart = toISO(d);
    setRangeStart(firstDayOfMonth(newStart));
    setRangeEnd(lastDayOfMonth(newStart));
  }

  return (
    <section className="filter-bar">
      <div className="filter-left">
        <Calendar size={15} color="var(--text-dim)" />
        <input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} className="date-input" />
        <span className="filter-until">até</span>
        <input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} className="date-input" />
      </div>
      <div className="preset-row">
        <button className="preset-btn" onClick={() => shiftRangeByMonth(-1)}>← mês</button>
        <button className="preset-btn" onClick={() => applyPreset("month")}>Este mês</button>
        <button className="preset-btn" onClick={() => applyPreset("7d")}>7 dias</button>
        <button className="preset-btn" onClick={() => applyPreset("30d")}>30 dias</button>
        <button className="preset-btn" onClick={() => applyPreset("all")}>Tudo</button>
        <button className="preset-btn" onClick={() => shiftRangeByMonth(1)}>mês →</button>
      </div>
    </section>
  );
}
