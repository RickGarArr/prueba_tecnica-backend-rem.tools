import { Router } from 'express';
import { crearFlujo, editarFlujo, eliminarFlujo, finalizarFlujo, getAllFlujos, getFlujo, sendFile } from '../controllers' 
import { fileVerification } from '../middlewares/fileVerification';
import { check, param } from 'express-validator';
import { validarUUID } from '../middlewares/validarUUID';
import validarCampos from '../middlewares/validarCampos';
import { validarToken } from '../middlewares/tokenVerification';
import { fileUploadVerification } from '../middlewares/updateFilesVerification';

const router = Router();

router.get('/crear', crearFlujo);

router.get('/:uuid', [ validarUUID ], getFlujo);

router.get('/', getAllFlujos);

router.get('/:uuid/:filename', [
    validarToken
], sendFile);

router.put('/editar/:uuid', [
    validarUUID,
    validarToken,
    fileUploadVerification
], editarFlujo);

router.delete('/eliminar/:uuid',[
    validarUUID,
    validarToken
], eliminarFlujo);

router.post('/finalizar/:uuid', [
    validarUUID,
    validarToken,
    fileVerification,
    check('nombre', 'El parametro nombre es necesario').trim().notEmpty().escape(),
    check('apellidos', 'El parametro apellidos es necesario').trim().notEmpty().escape(),
    check('fecha_nacimiento', 'El parametro fecha_nacimiento es necesario').trim().isDate(),
    check('lugar_nacimiento', 'El parametro lugar_nacimiento es necesario').trim().notEmpty().escape(),
    check('email', 'El parametro email es necesario').trim().escape().isEmail().normalizeEmail({all_lowercase: true}),
    check('telefono', 'El parametro telefono es necesario').trim().notEmpty().escape(),
    validarCampos
],finalizarFlujo);

export default router;