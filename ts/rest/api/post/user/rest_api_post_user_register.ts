import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";

type RegisterPayload = {
    username: string,
    password: string
}

export class UserRegisterAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/user/register";

    isPayloadValid(obj: any): obj is RegisterPayload {
        return (
            obj.username !== undefined &&
            obj.password !== undefined
        );
    }

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            if (!this.isPayloadValid(request.body)) {
                response.send({
                    message: 'Invalid input. Please refer to the documentation.'
                });
                return;
            }

            const { username, password } = <RegisterPayload> request.body;
            let status: boolean = await DBManager.addUser(username, password);

            if (status) {
                response.send({
                    message: 'User registration successful.'
                });
            } else {
                response.send({
                    message: 'User registration failed.'
                });
            }
        };
    }
}