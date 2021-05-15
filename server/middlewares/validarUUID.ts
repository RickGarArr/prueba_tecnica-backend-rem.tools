import { NextFunction, Request, Response } from "express";
import { validate } from "uuid";
import { sendError } from "../helpers/sendMessages";
import path from 'path';

export function validarUUID(req: Request, res: Response, next: NextFunction) {
    const { uuid } = req.params;
    if (!uuid) return sendError(res, 400, 'El parametro /:uuid es necesario');
    if (!validate(uuid)) return sendError(res, 400, 'El parametro /:uuid no es valido');
    (req as any).uuid = uuid;
    (req as any).directorio = path.join('../uploads/flujos', (req as any).uuid);
    next();
}