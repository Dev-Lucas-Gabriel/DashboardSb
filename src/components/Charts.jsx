import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";
import { fmtBRL } from "../utils/format";

function EmptyChart({ text }) {
  return <div className="empty-state">{text}</div>;
}

const axisTick = { fill: "#8A96AB", fontSize: 11, fontFamily: "IBM Plex Mono, monospace" };
const tooltipStyle = {
  contentStyle: { background: "#0E1420", border: "1px solid #1B2536", borderRadius: 8, fontFamily: "IBM Plex Mono, monospace", fontSize: 12 },
  labelStyle: { color: "#F3F6FB" },
};

export function DailyProfitChart({ data, periodLabel }) {
  return (
    <>
      <div className="panel-title">Lucro por dia — {periodLabel}</div>
      {data.length === 0 ? (
        <EmptyChart text="Sem lançamentos neste período." />
      ) : (
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#1B2536" vertical={false} />
              <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: "#1B2536" }} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => `R$${v}`} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                {...tooltipStyle}
                formatter={(v, name) => [fmtBRL(v), name === "lucro" ? "Lucro" : name]}
              />
              <Bar dataKey="lucro" radius={[3, 3, 0, 0]} maxBarSize={22}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.lucro >= 0 ? "#3ECF8E" : "#E5584A"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

export function MonthlyHistoryChart({ data }) {
  return (
    <>
      <div className="panel-title">Últimos meses</div>
      {data.length === 0 ? (
        <EmptyChart text="Ainda sem histórico de meses." />
      ) : (
        <div style={{ width: "100%", height: 150 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#1B2536" vertical={false} />
              <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: "#1B2536" }} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => `R$${v}`} />
              <Tooltip {...tooltipStyle} formatter={(v, name) => [fmtBRL(v), name === "lucro" ? "Lucro" : name]} />
              <Line type="monotone" dataKey="lucro" stroke="#2F80FF" strokeWidth={2.5} dot={{ fill: "#2F80FF", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
