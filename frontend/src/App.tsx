import './App.css';
import './Header.css';
import './Footer.css';
import { ChatContainer } from './components/chat/ChatContainer';

/**
 * Componente Principal (App)
 * Responsável por estruturar o layout global da página (Topbar e Shell).
 */
export function App() {
  return (
    <div className="sd-page">
      {/* 1. TOPBAR: Mantemos a identidade visual da Fatec Jacareí [cite: 5, 42] */}
      <header className="sd-topbar">
        <div className="sd-brand">
          <div className="sd-logo-card">
            {/* Certifique-se de que o caminho da imagem está correto no seu projeto */}
            <img src="/src/assets/fatec_jacarei-removebg-preview.png" alt="Logo Fatec Jacareí" />
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

      {/* 2. MAIN SHELL: Onde o conteúdo principal reside */}
      <main className="sd-shell">
        <section className="sd-chat-card">
          
          {/* Cabeçalho do Chat: Título e Descrição conforme o Desafio [cite: 182, 184] */}
          <div className="sd-chat-header">
            {/* O Avatar pode ser um componente separado ou apenas CSS */}
            <div className="sd-avatar sd-avatar-bot">
              <div className="sd-bot-icon" />
            </div>
            <div>
              <h1>Secretaria Digital - Fatec Jacareí</h1>
              <p>Atendimento público para alunos e interessados</p>
            </div>
          </div>

          {/* 3. CHAT CONTAINER: Aqui é onde a mágica funcional acontece! 
              Toda a lógica de mensagens e botões agora vive aqui dentro. */}
          <ChatContainer />

        </section>
      </main>
    </div>
  );
}

export default App;