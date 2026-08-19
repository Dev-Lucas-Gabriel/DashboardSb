export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const WEEKDAY = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function fmtBRL(n) {
  const v = Number(n) || 0;
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function firstDayOfMonth(iso) {
  const [y, m] = iso.split("-").map(Number);
  return `${y}-${String(m).padStart(2, "0")}-01`;
}

export function lastDayOfMonth(iso) {
  const [y, m] = iso.split("-").map(Number);
  const d = new Date(y, m, 0);
  return toISO(d);
}

export function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + n);
  return toISO(dt);
}

export function fmtDatePt(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")} · ${WEEKDAY[dt.getDay()]}`;
}

export function fmtShort(dateStr) {
  const [, m, d] = dateStr.split("-");
  return `${d}/${m}`;
}
