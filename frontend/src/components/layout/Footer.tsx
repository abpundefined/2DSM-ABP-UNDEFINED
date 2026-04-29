import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Fatec Jacareí - Centro Paula Souza
      </p>
    </footer>
  );
}