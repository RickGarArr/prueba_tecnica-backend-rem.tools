import { NextFunction, Request, Response } from "express";
import { sendError } from "../helpers/sendMessages";
import multer, { FileFilterCallback, MulterError } from 'multer';
import path from 'path';
import fs from 'fs';
import { generarNombreUnico } from "../helpers/generarNombreUnico";
import { eliminarCarpeta } from "../helpers/eliminarCarpeta";

export function fileUploadVerification(req: Request, res: Response, next: NextFunction) { 
    (req as any).directorio = path.join('../uploads/flujos', (req as any).uuid);
    
    // crear el metodo para esperar los archivos que vienen en la peticion
    const upload = multer({ fileFilter, storage }).fields([
        { name: 'firma', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]);
    
    // ejecutar el middleware upload
    upload(req, res, async (err: any) => {
        if (err instanceof Error) {
            // si el los middlewares dileUpload o storage arrojan un error
            // se crea el directorio a borrar
            const dir = path.join(__dirname, (req as any).directorio);
            if (fs.existsSync(dir)) {
                // se elimina el directorio creado si existen error
                eliminarCarpeta(dir).then(result => {
                    console.log(result);
                }).catch(error => {
                    console.log(error);
                });
            }

            if (err instanceof MulterError) {
                return sendError(res, 400, `error en la peticion campo ${err.field} no se esperaba`, 'campos para arcivos [video] [firma]');
            }
            return sendError(res, 500, err.message);
        }
        next();
    });

}

const fileFilter = function (req: any, file: Express.Multer.File, cb: FileFilterCallback) {
    const ext = file.originalname.split('.')[file.originalname.split('.').length - 1].toLocaleLowerCase();
    let extValidas;
    if (file.fieldname === 'video') {
        extValidas = ['webm', 'mkv', 'mp4'];
    } else {
        extValidas = ['png', 'jpg', 'jpeg'];
    }
    !extValidas.includes(ext) ? cb(new Error(`Error, tipo de archivo no valido, parametro {${file.fieldname}}`)) : cb(null, true);
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const directorio = path.join(__dirname, (req as any).directorio);;
        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio, { recursive: true });
        }
        cb(null, directorio);
    },
    filename: (req, file, callback) => {
        let nombreUnico;
        if (file.fieldname === 'video') {
            nombreUnico = `video_${generarNombreUnico(file.originalname)}`;
        } else {
            nombreUnico = `firma_${generarNombreUnico(file.originalname)}`;
        }
        callback(null, nombreUnico);
    }
});
