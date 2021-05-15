import { Request, Response } from "express";
import { v1 } from 'uuid';
import { createJWT } from "../helpers/JWToken";
import { sendError } from "../helpers/sendMessages";
import { Flujo } from "../models/flujo.model";
import { eliminarFlujoFile, eliminarFlujoFolder } from '../helpers/eliminarCarpeta';
import path from 'path';
import fs from 'fs';
import mime from 'mime';

export function crearFlujo(req: Request, res: Response) {
    const uuid = v1();
    const token = createJWT({ uuid });
    res.json({
        uuid,
        token
    });
}

export async function getAllFlujos(req: Request, res: Response) {
    const flujos = await Flujo.find();
    res.json({
        flujos
    });
}

export async function editarFlujo(req: Request, res: Response) {
    const uuid = (req as any).uuid;
    const flujoDB = await Flujo.findOne({ uuid });
    if (flujoDB) {
        const { nombre, apellidos, fecha_nacimiento, lugar_nacimiento, email, telefono } = req.body;
        Object.entries(req.files).forEach(async ([field, [file]]) => {
            if (field === 'video') {
                await eliminarFlujoFile(uuid, flujoDB.video);
                flujoDB.video = (file as Express.Multer.File).filename;
            } else if (field === 'firma') {
                await eliminarFlujoFile(uuid, flujoDB.firma);
                flujoDB.video = (file as Express.Multer.File).filename;
            }
        });
        if (nombre && nombre.trim() != '') {
            flujoDB.nombre = nombre;
        }
        if (apellidos && apellidos.trim() != '') {
            flujoDB.apellidos = apellidos;
        }
        if (fecha_nacimiento && fecha_nacimiento.trim() != '') {
            flujoDB.fecha_nacimeinto = fecha_nacimiento;
        }
        if (lugar_nacimiento && lugar_nacimiento.trim() != '') {
            flujoDB.lugar_nacimiento = lugar_nacimiento;
        }
        if (email && email.trim() != '') {
            flujoDB.email = email;
        }
        if (telefono && telefono.trim() != '') {
            flujoDB.telefono = telefono;
        }
        if (nombre && nombre.trim() != '') {
            flujoDB.nombre = nombre;
        }
        await flujoDB.save();
        res.json({
            msg: 'Registro actualizado correctamente',
            uuid
        });
    } else {
        Object.entries(req.files).forEach(async ([field, [file]]) => {
            await eliminarFlujoFile(uuid, file.filename);
        });
        sendError(res, 400, 'No existe flujo con ese UUID');
    }

}

export async function eliminarFlujo(req: Request, res: Response) {
    const uuid = (req as any).uuid
    try {
        const flujoDB = await Flujo.findOne({ uuid });
        console.log(flujoDB);
        if (!flujoDB) throw new Error('No existe el flujo con uuid:' + uuid);
        eliminarFlujoFolder(uuid).then(result => console.log(result)).catch(error => console.log(error));
        const resultDelete = await Flujo.findByIdAndDelete(flujoDB._id);
        if (resultDelete) {
            res.json({
                msg: 'Flujo eliminado correctamente',
            });
        } else {
            sendError(res, 400, 'No existe flujo con ese UUID');
        }
    } catch (error) {
        sendError(res, 400, error);
    }
}

export async function getFlujo(req: Request, res: Response) {
    const uuid = (req as any).uuid;
    const flujoDB = await Flujo.findOne({ uuid });
    const token = createJWT({ uuid });
    if (flujoDB) {
        res.json({
            flujo: flujoDB,
            token
        });
    } else {
        sendError(res, 400, 'No existe flujo con ese UUID');
    }
}

export async function finalizarFlujo(req: Request, res: Response) {
    const uuid = (req as any).uuid;
    const flujoDB = await Flujo.findOne({ uuid });
    if (!flujoDB) {
        const { nombre, apellidos, fecha_nacimiento, lugar_nacimiento, email, telefono } = req.body;
        const files = {
            video: '',
            firma: ''
        };
        Object.entries(req.files).forEach(([field, [file]]) => {
            if (field === 'video') {
                files.video = (file as Express.Multer.File).filename;
            } else {
                files.firma = (file as Express.Multer.File).filename;
            }
        });

        Flujo.create({
            nombre, apellidos, fecha_nacimiento, lugar_nacimiento,
            email, telefono, video: files.video, firma: files.firma, uuid
        }).then(flujoDB => {
            res.json({
                msg: 'Flujo creado correctamente',
                uuid: flujoDB.uuid
            });
        }).catch(error => {
            Object.entries(req.files).forEach(async ([field, [file]]) => {
                await eliminarFlujoFile(uuid, file.filename);
            });
            sendError(res, 400, error.message);
        });
    } else {
        Object.entries(req.files).forEach(async ([field, [file]]) => {
            await eliminarFlujoFile(uuid, file.filename);
        });
        sendError(res, 400, `El UUID ingresado ya está registrado`);
    }
}

export function sendFile(req: Request, res: Response) {
    const { filename, uuid } = req.params;
    const fileDir = path.join(__dirname, '../uploads/flujos', uuid, filename);
    if (!fs.existsSync(fileDir)) {
        sendError(res, 400, 'El archivo no existe');
    } else {
        const type = mime.lookup(fileDir);
        if (!res.getHeader('content-type')) {
            res.setHeader('Content-Type', type);
        }
        res.sendFile(fileDir);
    }
}