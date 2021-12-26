import { API } from "../../interface/rest_api_interface";
import { Callback } from "../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../adapter/express";
import { DatabaseManager } from "../../../db/database_manager";
import { DBResponse, DBResponseCode } from "../../../db/database";

type RegisterPayload = {
    username: string,
    password: string
}

export class RegisterAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/register";

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            const { username, password } = <RegisterPayload> request.body;
            let dbResponse: DBResponse = await DatabaseManager.registerUser(username, password);

            if (dbResponse.code == DBResponseCode.OK) {
                response.send({
                    message: 'User registration is successful.'
                });
            } else {
                response.send({
                    message: 'User registration failed.',
                    error: dbResponse
                });
            }
        };
    }
}