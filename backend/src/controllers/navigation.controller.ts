import { Request, Response } from "express";
import { navigationService } from "../services/navigation.service";

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