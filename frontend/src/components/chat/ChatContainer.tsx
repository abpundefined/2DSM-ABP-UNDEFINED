// frontend/src/components/chat/ChatContainer.tsx
import { useChat } from "../../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { OptionButton } from "./OptionButton";

// IMPORTAÇÃO DA LOGO: Garante que o Vite carregue a imagem corretamente


export function ChatContainer() {
  const { messages, currentOptions, bottomRef, handleChoice } = useChat();

  return (
    <div className="sd-chat-body-wrapper">
      {/* RESTAURAÇÃO: HTML do Header do Chat integrado ao layout original */}
      <header className="sd-chat-header">
        <div className="sd-chat-header-text">
          <h1>Secretaria Digital - Fatec Jacareí</h1>
          <p>Atendimento público para alunos e interessados</p>
        </div>
      </header>

      {/* Corpo do chat com as mensagens */}
      <div className="sd-chat-body">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            sender={msg.sender}
            html={msg.html}
            evidence_source={msg.evidence_source}
          >
            {msg.text}
          </MessageBubble>
        ))}

        <div className="sd-chip-row">
          {currentOptions.map((opt) => (
            <OptionButton
              key={opt.slug}
              label={opt.title}
              onClick={() => handleChoice(opt)}
            />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
