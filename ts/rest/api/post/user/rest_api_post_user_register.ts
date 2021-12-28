import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";
import { Util } from "../../../../util/util";
import { HTTPStatusCode } from "../../../../util/http_code";

type RegisterPayload = {
    username: string,
    password: string
}

export class UserRegisterAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/user/register";

    isPayloadValid(obj: any): obj is RegisterPayload {
        return (
            Util.isMemberValid(obj.username, Util.isString) &&
            Util.isMemberValid(obj.password, Util.isString)
        );
    }

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            if (!this.isPayloadValid(request.body)) {
                return response.status(HTTPStatusCode.BAD_REQUEST).send({
                    message: 'Invalid input. Please refer to the documentation.'
                });
            }

            const { username, password } = <RegisterPayload> request.body;
            let status: boolean = await DBManager.addUser(username, password);

            if (status) {
                response.status(HTTPStatusCode.OK).send({
                    message: 'User registration successful.'
                });
            } else {
                response.status(HTTPStatusCode.BAD_REQUEST).send({
                    message: 'User registration failed.'
                });
            }
        };
    }
}