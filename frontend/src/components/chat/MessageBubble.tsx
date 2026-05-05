import { type ReactNode } from 'react';

export function MessageBubble({ children, sender, html, evidence_source }: { children: ReactNode; sender: 'bot' | 'user'; html?: boolean; evidence_source?: string | null }) {
  const getFileName = (path: string) => {
    console.log(path)
    return path.split('/').pop() || 'Arquivo';
  };

  return (
    <div className={`sd-message-row ${sender === 'user' ? 'user-row' : ''}`}>
      <div className={`sd-bubble ${sender === 'user' ? 'sd-bubble-user' : 'sd-bubble-bot'}`}>
        {html && typeof children === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: children }} />
        ) : (
          children
        )}
        {evidence_source && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <a
              href={evidence_source}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#0066cc',
                textDecoration: 'none',
                fontSize: '0.95em',
                padding: '8px 12px',
                backgroundColor: 'rgba(0, 102, 204, 0.05)',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.05)';
              }}
            >
              <span>📄</span>
              {getFileName(evidence_source)}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}