import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { eliminarCarpeta } from '../helpers/eliminarCarpeta';
import {sendError} from '../helpers/sendMessages';
import path from 'path';

export default function validarCampos (req: Request, res: Response, next: NextFunction) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const errors = errores.array().map( error => {
            return error.msg;
        });
        eliminarCarpeta(path.join(__dirname, (req as any).directorio)).then( result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        });
        return sendError(res, 400, ...errors);
    }


    next();
}