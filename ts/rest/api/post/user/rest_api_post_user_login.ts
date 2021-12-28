import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";
import { Util } from "../../../../util/util";
import { HTTPStatusCode } from "../../../../util/http_code";

type LoginPayload = {
    username: string,
    password: string
}

export class UserLoginAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/user/login";

    isPayloadValid(obj: any): obj is LoginPayload {
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

            const { username, password } = <LoginPayload> request.body;
            let userId = await DBManager.loginUser(username, password);
            let token: string = userId !== "" ? await this.getToken(userId) : "";

            if (userId !== "" && token !== "") {
                response.status(HTTPStatusCode.OK).send({
                    token
                });
            } else {
                response.status(HTTPStatusCode.UNAUTHORIZED).send({
                    message: 'User login failed. One or both of the credentials provided was invalid.'
                });
            }
        };
    }

    async getToken(userId: string): Promise<string> {
        let timestamp = Date.now();
        let status: boolean = await DBManager.registerAccessToken(userId, timestamp);
        let token: string = status ? await DBManager.getAccessToken(userId, timestamp) : "";
        
        if (status && token !== "") {
            console.info(`Successfully registered and retrieved access token: ${token}`);
        } else {
            console.error(`Failed to register and/or retrieve access token for userId: ${userId}`);
        }

        return token;
    }
}