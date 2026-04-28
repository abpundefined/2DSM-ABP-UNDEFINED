import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

type QuickOption = {
  label: string;
  variant?: "default" | "danger";
};

const courseOptions: QuickOption[] = [{ label: "Não sou aluno", variant: "danger" }];

const infoOptions: QuickOption[] = [
  { label: "A Fatec possui cursos técnicos?" },
  { label: "Como ingressar na Fatec?" },
  { label: "Cursos oferecidos" },
  { label: "Horários das aulas" },
];

const footerOptions: QuickOption[] = [
  { label: "Datas importantes" },
  { label: "Estágio" },
  { label: "Dispensa" },
  { label: "Como ingressar?" },
];

function BubbleAvatar({ type }: { type: "bot" | "user" }) {
  if (type === "bot") {
    return (
      <div className="sd-avatar sd-avatar-bot" aria-hidden="true">
        <div className="sd-bot-icon" />
      </div>
    );
  }

  return (
    <div className="sd-avatar sd-avatar-user" aria-hidden="true">
      <div className="sd-user-icon">
        <span />
      </div>
    </div>
  );
}

function MessageBubble({
  children,
  width = "normal",
}: {
  children: ReactNode;
  width?: "normal" | "wide";
}) {
  return <div className={`sd-bubble ${width === "wide" ? "sd-bubble-wide" : ""}`}>{children}</div>;
}

function OptionChip({ label, variant = "default" }: QuickOption) {
  return <button className={`sd-chip ${variant === "danger" ? "sd-chip-danger" : ""}`}>{label}</button>;
}

export function App() {
  return (
    <div className="sd-page">
      <header className="sd-topbar">
        <div className="sd-brand">
          <div className="sd-logo-card">
            <img src=".\src\assets\fatec_jacarei-removebg-preview.png" alt="" />
          </div>
        </div>
        <div className="sd-searchbar">
          <input type="text" placeholder="O que deseja localizar?" />
          <button aria-label="Buscar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.42 1.4-1.4-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9Z" />
            </svg>
          </button>
        </div>
      </header>
    <div className='divider'></div>
      <main className="sd-shell">
        <section className="sd-chat-card">
          <div className="sd-chat-header">
            <BubbleAvatar type="bot" />
            <div>
              <h1>Secretaria Digital - Fatec Jacareí</h1>
              <p>Atendimento público para alunos e interessados</p>
            </div>
          </div>

          <div className="sd-chat-body">
            <div className="sd-message-row">
              <BubbleAvatar type="user" />
              <MessageBubble width="wide">
                <strong>Bem-vindo ao autoatendimento da Secretaria Acadêmica da Fatec Jacareí.</strong>
                <span>Para qual curso você deseja atendimento?</span>
              </MessageBubble>
            </div>

            <div className="sd-chip-row sd-chip-row-right">
              {courseOptions.map((item) => (
                <OptionChip key={item.label} {...item} />
              ))}
            </div>

            <div className="sd-message-row">
              <BubbleAvatar type="user" />
              <MessageBubble>
                <strong>Para qual assunto você gostaria de obter informações?</strong>
              </MessageBubble>
            </div>

            <div className="sd-chip-row">
              {infoOptions.map((item) => (
                <OptionChip key={item.label} {...item} />
              ))}
            </div>
          </div>

          <div className="sd-chat-footer">
            <div className="sd-chip-row">
              {footerOptions.map((item) => (
                <OptionChip key={item.label} {...item} />
              ))}
            </div>

            <form className="sd-input-row">
              <input type="text" placeholder="Digite sua dúvida ou escolha uma opção acima..." />
              <button type="submit">Enviar</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
