import { Express } from "../adapter/express";
import { API } from "../rest/interface/rest_api_interface";
import { APIRegistry } from "../rest/rest_api_registry";

export class Service {
    port: number;
    express: Express;

    constructor(port: number) {
        this.port = port;
        this.express = new Express();
    }

    init(): void {
        this.express.init();
        this.registerApis();
    }

    start(): void {
        this.init();

        this.express.listen(this.port, () => {
            console.log(`Express running at http://localhost:${this.port}`);
        });
    }

    private registerApis(): void {
        let api: API;

        for(api of APIRegistry.apis) {
            this.express[api.httpMethod](api.path, api.callback);
        }
    }
}