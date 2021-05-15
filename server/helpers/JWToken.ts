import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export function createJWT(payload: Object): string {
    return jwt.sign(payload, `${process.env.SECRET}`, {expiresIn: '5m'});
}

export function verifyJWT(token: string, callback: Function) {
    jwt.verify(token, (process.env.SECRET as string), (err, decoded) => {
            if(err) {
                if(err.message.includes('malformed')) {
                    callback(new Error('El Token no tiene formato valido'));
                } else if(err.message.includes('signature')) {
                    callback(new Error('El Token no tiene tiene firma valida'));
                } else if(err.message.includes('expired')) {
                    callback(new Error('El Token ha expirado'));
                }
            } else {
                callback(null, decoded);
            }
    });
}