import { Store, LogOut } from "lucide-react";

export default function Header({ userEmail, onSignOut }) {
  return (
    <header className="header">
      <div className="brand-row">
        <div className="brand-mark">
          <Store size={20} color="#0A0A0C" strokeWidth={2.4} />
        </div>
        <div>
          <div className="brand-name">DASHBOARD</div>
          <div className="brand-sub">Controle de caixa — entradas, saídas e lucro</div>
        </div>
      </div>
      <div className="user-row">
        <span className="user-email">{userEmail}</span>
        <button className="preset-btn" onClick={onSignOut}>
          <LogOut size={13} style={{ marginRight: 5, verticalAlign: -2 }} />
          Sair
        </button>
      </div>
    </header>
  );
}
