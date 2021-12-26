import { API } from "../../interface/rest_api_interface";
import { Callback } from "../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../adapter/express";
import { DatabaseManager } from "../../../db/database_manager";
import { DBResponse, DBResponseCode } from "../../../db/database";

type LoginPayload = {
    username: string,
    password: string
}

export class LoginAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/login";

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            const { username, password } = <LoginPayload> request.body;
            let dbResponse: DBResponse = await DatabaseManager.loginUser(username, password);
            
            if (dbResponse.code == DBResponseCode.OK) {
                let [ user ] = dbResponse.response ? dbResponse.response : [ null ];
                let userId: number = user.user_id;
                const date: number = Date.now();
                
                //dbResponse = await DatabaseManager.registerToken(userId, date);
                response.send({
                    message: 'User login is successful.',
                    token: 'SOME TOKEN'
                });
            } else {
                response.send({
                    message: 'User login failed.',
                    error: dbResponse
                });
            }
        };
    }
}