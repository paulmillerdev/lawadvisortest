import express from 'express';

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
    send: Function;
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