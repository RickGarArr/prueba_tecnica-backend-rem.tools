import { config } from 'dotenv';
config();
import RESTServer from './server_classes/RESTServer';
import DBConnection from './server_classes/DBConnection';
import { json, urlencoded } from 'express';
import cors from 'cors';

const server = RESTServer.instance;

server.app.use(json());
server.app.use(urlencoded({extended: true}));
server.app.use(cors({origin: true, credentials: true}));

import routes from './routes'

server.app.use('/flujos', routes);

DBConnection.dbConection();

server.start(() => {
    console.log('servidor escuchando en ', server.port);
});