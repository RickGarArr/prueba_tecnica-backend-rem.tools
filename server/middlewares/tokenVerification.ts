import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../helpers/JWToken";
import { sendError } from "../helpers/sendMessages";

export function validarToken(req: Request, res: Response, next: NextFunction) {
    const x_token = req.header('x-token');
    if (!x_token) return sendError(res, 400, 'No hay x-token en los headers de la peticion');
    verifyJWT(x_token, (err: any, decoded: Object) => {
        if (err) return sendError(res, 400, err.message);
        (req as any).decoded = decoded;
        next();
    });
}