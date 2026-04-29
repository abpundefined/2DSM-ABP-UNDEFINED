import { type ReactNode } from 'react';

// O children permite que você coloque texto ou HTML dentro do balão
export function MessageBubble({ children, sender }: { children: ReactNode, sender: 'bot' | 'user' }) {
  return (
    <div className={`sd-message-row ${sender === 'user' ? 'user-row' : ''}`}>
      {/* Aqui você pode incluir o BubbleAvatar depois */}
      <div className={`sd-bubble ${sender === 'user' ? 'sd-bubble-user' : 'sd-bubble-bot'}`}>
        {children}
      </div>
    </div>
  );
}