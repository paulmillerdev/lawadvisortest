import express from 'express';
import { HTTPStatusCode } from "../util/http_code";

export enum ExpressMethod {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete'
}

export type ExpressRequest = {
    headers: object;
    body: object;
}

export type ExpressResponse = {
    status: Function;
    send: Function;
    sendStatus: Function;
}

export type ExpressError = {
    status: number;
}

export class Express {
    private express: any;
    private app: any;

    constructor() {
        this.express = express;
        this.app = this.express();
    }

    init(): void {
        this.app.use(this.express.json());
        this.app.use((err: ExpressError, req: ExpressRequest, res: ExpressResponse, next: Function) => {
            if (err instanceof SyntaxError && err.status === HTTPStatusCode.BAD_REQUEST && 'body' in err) {
                console.error(err);
                return res.status(HTTPStatusCode.BAD_REQUEST).send({
                    message: "Bad request."
                });
            }
        
            next();
        });
    }

    get(path: string, callback: Function): void {
        this.app.get(path, callback);
    }

    post(path: string, callback: Function): void {
        this.app.post(path, callback);
    }

    delete(path: string, callback: Function): void {
        this.app.delete(path, callback);
    }

    listen(port: number, callback: Function): void {
        this.app.listen(port, callback);
    }
}