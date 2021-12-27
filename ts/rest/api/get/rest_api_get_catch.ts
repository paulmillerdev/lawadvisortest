import { API } from "../../interface/rest_api_interface";
import { Callback } from "../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../adapter/express";

export class GETCatchAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.GET;
    path: string = "*";

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            response.send({
                message: 'Only POST requests are handled by the app.'
            })
        };
    }
}