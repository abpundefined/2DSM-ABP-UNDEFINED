import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-fatec">
          <strong>Fatec</strong>
          <span>Jacareí</span>
        </div>

        <div className="logo-cps">
          CPS
        </div>
      </div>

      <div className="header-right">
        <input
          type="text"
          placeholder="O que deseja localizar?"
        />
        <button>🔍</button>
      </div>
    </header>
  );
}