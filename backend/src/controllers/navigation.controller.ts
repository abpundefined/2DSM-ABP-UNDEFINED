import { Request, Response } from "express";
import {
  CreateFeedbackData,
  SatisfactionFlag,
} from "../repositories/navigation.repository";
import { navigationService } from "../services/navigation.service";

function isFilledString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSatisfactionFlag(value: unknown): value is SatisfactionFlag {
  return value === "ATENDEU" || value === "NAO_ATENDEU";
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => Number.isInteger(item));
}

export async function getRootNavigation(req: Request, res: Response) {
    try {
        const data = await navigationService.getRoot();
        
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Erro ao buscar navegação"});
    }
}

export async function getChildren(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const data = await navigationService.getChildren(slug);

    if (!data) {
        return res.status(404).json({ error: "Nó não encontrado" });
    }

  res.json(data);
}

export async function createInquiry(req: Request, res: Response) {
    try {
        const { requesterName, requesterEmail, question } = req.body as {
            requesterName?: unknown;
            requesterEmail?: unknown;
            question?: unknown;
        };

        if (
            !isFilledString(requesterName) ||
            !isFilledString(requesterEmail) ||
            !isFilledString(question)
        ) {
            return res.status(400).json({
                error: "requesterName, requesterEmail e question sao obrigatorios",
            });
        }

        const inquiry = await navigationService.createInquiry({
            requesterName: requesterName.trim(),
            requesterEmail: requesterEmail.trim(),
            question: question.trim(),
        });

        return res.status(201).json(inquiry);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao cadastrar pergunta" });
    }
}

export async function createFeedback(req: Request, res: Response) {
    try {
        const { sessionId, navigationFlow, inquiryIds, flag } = req.body as {
            sessionId?: unknown;
            navigationFlow?: unknown;
            inquiryIds?: unknown;
            flag?: unknown;
        };

        if (!isSatisfactionFlag(flag)) {
            return res.status(400).json({
                error: "flag deve ser ATENDEU ou NAO_ATENDEU",
            });
        }

        if (inquiryIds !== undefined && !isNumberArray(inquiryIds)) {
            return res.status(400).json({
                error: "inquiryIds deve ser um array de numeros",
            });
        }

        if (navigationFlow !== undefined && !Array.isArray(navigationFlow)) {
            return res.status(400).json({
                error: "navigationFlow deve ser um array",
            });
        }

        const data: CreateFeedbackData = { flag };

        if (typeof sessionId === "string") {
            data.sessionId = sessionId;
        }

        if (Array.isArray(navigationFlow)) {
            data.navigationFlow = navigationFlow;
        }

        if (inquiryIds !== undefined) {
            data.inquiryIds = inquiryIds;
        }

        const feedback = await navigationService.createFeedback(data);

        return res.status(201).json(feedback);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao cadastrar feedback" });
    }
}
