import fs from 'fs';
import pathJS from 'path';

export function eliminarCarpeta(path: string) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                var curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    eliminarCarpeta(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
            resolve('Carpeta eliminada correctamente');
        } else {
            reject('Carpeta no existe, hable con el administrador');
        }
    })
}

export function eliminarFlujoFolder(flujo_uuid: string) {
    return new Promise((resolve) => {
        const path = pathJS.join(__dirname, '../uploads/flujos', flujo_uuid);
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                var curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    eliminarCarpeta(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
            resolve('Carpeta eliminada correctamente');
        } else {
            resolve('Carpeta no existe, hable con el administrador');
        }
    })
}


export function eliminarFlujoFile(flujo_uuid: string, filename: string) {
    return new Promise((resolve) => {
        const path = pathJS.join(__dirname, '../uploads/flujos', flujo_uuid, filename);
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
            resolve('archivo eliminada correctamente');
        } else {
            resolve('archivo no existe, hable con el administrador');
        }
    })
}