import { Response } from "express";

export function sendError(res: Response, status: number, ...errores: string[]) {
    res.status(status).json({
        errores
    });
}
