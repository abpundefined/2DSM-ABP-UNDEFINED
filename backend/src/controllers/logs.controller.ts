import { Request, Response } from "express";
import { logsService } from "../services/logs.service";

export async function createLog(req: Request, res: Response) {
    try {
        const log = await logsService.createLog(req.body);
        return res.status(201).json(log);
    }
    catch {
        res.status(500).json({error:"Erro ao criar log"})
    }
}