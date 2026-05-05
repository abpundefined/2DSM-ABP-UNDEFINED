import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { OptionButton } from './OptionButton';

type NavigationNode = {
  id: number;
  title: string;
  slug: string;
  answer_summary?: string | null;
  evidence_excerpt?: string | null;
  evidence_source?: string | null;
};

type DisplayOption = NavigationNode | { title: 'Voltar'; slug: '__back' };

type Message = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  html?: boolean;
  evidence_source?: string | null;
};

type NavigationLevel = {
  slug: string | null;
  title: string;
  options: DisplayOption[];
};

const API_PREFIX = import.meta.env.VITE_API_URL ?? '';
const BACK_OPTION: DisplayOption = { title: 'Voltar', slug: '__back' };

function getApiUrl(path: string) {
  return `${API_PREFIX}${path}`;
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', text: 'Para qual curso você deseja atendimento?' }
  ]);

  const [currentOptions, setCurrentOptions] = useState<DisplayOption[]>([]);
  const [history, setHistory] = useState<NavigationLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, currentOptions]);

  async function fetchRoot() {
    try {
      const response = await fetch(getApiUrl('/navigation/root'));
      
      if (!response.ok) throw new Error('Falha ao carregar o menu inicial.');

      const rootOptions = (await response.json()) as NavigationNode[];
      setCurrentLevel({ slug: null, title: 'root', options: rootOptions });
      setCurrentOptions(rootOptions);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          text: 'Não foi possível carregar as opções de atendimento no momento. Tente novamente mais tarde.'
        }
      ]);
    }
  }

  useEffect(() => {
    void (async () => {
      await fetchRoot();
    })();
  }, []);

  const fetchChildren = async (slug: string) => {
    const response = await fetch(getApiUrl(`/navigation/${slug}/children`));
    if (!response.ok) {
      throw new Error('Nó não encontrado');
    }

    return (await response.json()) as {
      parent: NavigationNode;
      children: NavigationNode[];
    };
  };

  const buildOptions = (children: NavigationNode[], canGoBack: boolean) => {
    if (children.length === 0) {
      return [BACK_OPTION];
    }

    return canGoBack ? [...children, BACK_OPTION] : children;
  };

  const getBotText = (node: NavigationNode, children: NavigationNode[]) => {
    if (node.answer_summary) {
      return node.answer_summary;
    }

    if (children.length > 0) {
      return `Entendido! O que você deseja saber sobre ${node.title}?`;
    }

    return `Ainda não temos uma resposta detalhada para "${node.title}".`;
  };

  const handleChoice = async (option: DisplayOption) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: option.title }]);

    if (option.slug === '__back') {
      const previous = history[history.length - 1];
      if (!previous) {
        return;
      }

      setHistory(prev => prev.slice(0, -1));
      setCurrentLevel(previous);
      setCurrentOptions(previous.options);
      return;
    }

    try {
      const data = await fetchChildren(option.slug);
      const nextOptions = buildOptions(data.children, true);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: getBotText(data.parent, data.children),
          html: Boolean(data.parent.answer_summary),
          evidence_source: data.parent.evidence_source
        }
      ]);

      if (currentLevel) {
        setHistory(prev => [...prev, currentLevel]);
      }

      setCurrentLevel({ slug: option.slug, title: option.title, options: nextOptions });
      setCurrentOptions(nextOptions);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Não foi possível carregar a resposta desejada no momento. Por favor, tente outra opção.'
        }
      ]);
    }
  };

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
