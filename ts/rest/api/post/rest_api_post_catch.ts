import { API } from "../../interface/rest_api_interface";
import { Callback } from "../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../adapter/express";

export class CatchAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "*";

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            response.send({
                message: 'Invalid API request.'
            })
        };
    }
}