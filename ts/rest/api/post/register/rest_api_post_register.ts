import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";

export class Register implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/register";
    callback: Callback = (request: ExpressRequest, response: ExpressResponse) => {
        const headers = request.headers;
        const body = request.body;

        response.send(`request received!\nheaders:${headers}\nbody:${body}`);
    };
}