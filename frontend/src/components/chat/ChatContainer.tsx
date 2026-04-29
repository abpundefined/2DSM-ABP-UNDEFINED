import { useState, type ReactNode } from 'react';
import { MessageBubble } from './MessageBubble';
import { OptionButton } from './OptionButton';


type Message = {
    id: number;
    sender: 'bot' | 'user'; // Isso diz ao TS: "Não é qualquer string, são só essas duas"
    text: ReactNode;
}
export function ChatContainer() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'bot', text: flow.inicio.bot }
    ]);

    // Estado para saber quais botões exibir
    const [currentOptions, setCurrentOptions] = useState(flow.inicio.options);

    const handleChoice = (choice: string) => {
        // 1. Adiciona a fala do usuário
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: choice }]);

        // 2. Lógica de Navegação
        setTimeout(() => {
            let nextStep;

            if (choice === "DSM") nextStep = flow.dsm;
            else if (choice === "Não sou aluno") nextStep = flow.nao_aluno;
            else if (choice === "Geoprocessamento") nextStep = flow.geoprocessamento;
            else if (choice === "Meio Ambiente") nextStep = flow.meio_ambiente;
            else if (choice === "Voltar") nextStep = flow.inicio;
            else if (choice === "Atividades complementares") nextStep = flow.atividades_complementares;
            else if (choice === "Datas importantes") nextStep = flow.datas_importantes;
            else if (choice === "Grade Curricular") nextStep = flow.grade_curricular;
            else if (choice === "Estágio") nextStep = flow.estagio;
            else if (choice === "Como ingressar?") nextStep = flow.como_ingressar;
            else if (choice === "Cursos oferecidos") nextStep = flow.cursos_oferecidos;
            else if (choice === "Horários") nextStep = flow.horarios;
            // Adicione os outros "elses" conforme o PDF

            if (nextStep) {
                setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: nextStep.bot }]);
                setCurrentOptions(nextStep.options); // Aqui os botões mudam!
            }
        }, 600);
    };

    return (
        <div className="sd-chat-body">
            {messages.map(msg => (
                <MessageBubble key={msg.id} sender={msg.sender}>{msg.text}</MessageBubble>
            ))}

            <div className="sd-chip-row">
                {currentOptions.map(opt => (
                    <OptionButton key={opt} label={opt} onClick={() => handleChoice(opt)} />
                ))}
            </div>
        </div>
    );
}

const flow = {
    inicio: {
        bot: "Para qual curso você deseja atendimento?",
        options: ["DSM", "Geoprocessamento", "MARH", "Não sou aluno"]
    },
    dsm: {
        bot: "Entendido! O que você deseja saber sobre DSM?",
        options: ["Atividades complementares", "Datas importantes", "Estágio", "Grade Curricular", "Voltar"]
    },
    atividades_complementares: {
        bot: "O curso de Desenvolvimento de Software Multiplataforma (DSM) não possui Atividades Acadêmico-Científico-Culturais (AACC) previstas em sua matriz currícular.",
        options: ["Voltar"]
    },
    datas_importantes: {
        bot: (
      <div>
        <strong>Calendário Acadêmico 2026-1:</strong>
        <ul style={{ paddingLeft: '20px', marginTop: '10px', textAlign: 'left' }}>
          <li><strong>12 a 18/01:</strong> Inscrições para vagas remanescentes e transferências</li>
          <li><strong>12 a 18/01:</strong> Rematrícula de alunos veteranos</li>
          <li><strong>09/02:</strong> Início das Aulas</li>
          <li><strong>19/02:</strong> Prazo para aproveitamento de estudos (Art. 76 – via SIGA)</li>
          <li><strong>19/02:</strong> Prazo para reconhecimento de competências (Art. 80, §1º):</li>
          <li><strong>19/02:</strong> Ajustes de matrícula (veteranos – Art. 26, §4º)</li>
          <li><strong>21/02:</strong> Exame de nivelamento com ajuste de horário (Art. 87, §1º)</li>
          <li><strong>23/02:</strong> Ajustes de matrícula (ingressantes – Art. 25, §2º)</li>
          <li><strong>27/02:</strong> Exame de nivelamento com ajuste de horário (Art. 87, §1º)</li>
          <li><strong>02/03:</strong> Cancelamento por ausência de rematrícula (Art. 28)</li>
          <li><strong>25/03:</strong> Prazo final para desistência de disciplina (Art. 30)</li>
          <li><strong>13/05:</strong> Prazo final para trancamento (exceto ingressantes – Art. 31, §3º)</li>
          <li><strong>27/06:</strong> Término das Aulas</li>
          <li><strong>06 a 08/07:</strong> Término das Aulas</li>
        </ul>
      </div>
    ),
        options: ["Voltar"]
    },
    grade_curricular: {
        bot: "",
        options: ["Voltar"]
    },
    estagio: {
        bot:"",
        options: ["Voltar"]
    },
    como_ingressar: {
        bot: "A",
        options: ["Voltar"]
    },
    cursos_oferecidos: {
        bot: "",
        options: ["Voltar"]
    },
    horarios: {
        bot: "",
        options: ["Voltar"]
    },
    geoprocessamento: {
        bot: "Entendido! O que você deseja saber sobre Geoprocessamento?",
        options: ["Atividades complementares", "Datas importantes", "Grade Curricular", "Voltar"]
    },
    meio_ambiente: {
        bot: "Entendido! O que você deseja saber sobre Meio Ambiente?",
        options: ["Atividades complementares", "Datas importantes", "Grade Curricular", "Voltar"]
    },

    nao_aluno: {
        bot: "Para qual assunto você gostaria de obter informações?",
        options: ["Como ingressar?", "Cursos oferecidos", "Horários", "Voltar"]
    }

};