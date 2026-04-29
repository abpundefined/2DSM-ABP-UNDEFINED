import { useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { OptionButton } from './OptionButton';

type Message = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
};

export function ChatContainer() {
  // Estado que guarda o histórico que o usuário está vendo
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', text: 'Bem-vindo! Para qual curso você deseja atendimento?' }
  ]);

  const handleChoice = (choice: string) => {
    // 1. Adiciona o que o usuário clicou
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: choice }]);

    // 2. Simula resposta do bot (Depois isso virá do seu PDF/Banco de Dados) [cite: 18, 19]
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: `Entendido! Você escolheu ${choice}.` }]);
    }, 600);
  };

  return (
    <div className="sd-chat-body">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} sender={msg.sender}>
          {msg.text}
        </MessageBubble>
      ))}

      {/* Opções dinâmicas que aparecem no final */}
      <div className="sd-chip-row">
        <OptionButton label="DSM" onClick={() => handleChoice('DSM')} />
        <OptionButton label="Geoprocessamento" onClick={() => handleChoice('Geoprocessamento')} />
      </div>
    </div>
  );
}