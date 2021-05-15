import Express from 'express';

export default class RESTServer {
    private static _instance: RESTServer;

    private _port: number;
    private _app: Express.Application;

    private constructor() {
        this._app = Express();
        this._port = Number(process.env.PORT) || 5000;
    }

    public static get instance() {
        return RESTServer._instance || (RESTServer._instance = new RESTServer());
    }

    public get app() {
        return this._app;
    }

    public get port(): number {
        return this._port;
    }

    public start(callback: Function): void {
        this._app.listen(this._port, callback());
    }
}