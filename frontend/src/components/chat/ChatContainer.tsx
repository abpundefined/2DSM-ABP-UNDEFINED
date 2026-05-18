// frontend/src/components/chat/ChatContainer.tsx
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { OptionButton } from './OptionButton';

export function ChatContainer() {
  // Consome tudo do hook isolado!
  const { messages, currentOptions, bottomRef, handleChoice } = useChat();

  return (
    <div className="sd-chat-body">
      {messages.map(msg => (
        <MessageBubble key={msg.id} sender={msg.sender} html={msg.html} evidence_source={msg.evidence_source}>
          {msg.text}
        </MessageBubble>
      ))}

      <div className="sd-chip-row">
        {currentOptions.map(opt => (
          <OptionButton key={opt.slug} label={opt.title} onClick={() => handleChoice(opt)} />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}