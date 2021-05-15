import { Schema, model, Document } from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');
import IFlujo from '../interfaces/IFlujo';

const flujoSchema = new Schema<IFlujo>({
    nombre: {
        type: String,
        required: [true, 'EL nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son necesarios']
    },
    telefono: {
        type: String,
        required: [true, 'EL telefono es necesario']
    },
    email: {
        type: String,
        required: [true, 'EL email es necesario']
    },
    fecha_nacimiento: {
        type: String,
        required: [true, 'La fecha de nacimiento es necesaria']
    },
    lugar_nacimiento: {
        type: String,
        required: [true, 'El lugar de nacimiento es necesario']
    },
    firma: {
        type: String,
        required: [true, 'la firma de nacimiento es necesario']
    },
    video: {
        type: String,
        required: [true, 'el video de nacimiento es necesario']
    },
    uuid: {
        type: String,
        required: [true, 'el uuid es necesario'],
        unique: true
    }
}, {collection: 'flujos'});


flujoSchema.methods.toJSON = function(){
    const { __v, _id, id, ...object } = this.toObject();
    // object.id = _id;
    return object;
};

// flujoSchema.plugin(uniqueValidator, {message: 'El campo {PATH} ya está registrado'});

export const Flujo = model<IFlujo>('flujos', flujoSchema);
