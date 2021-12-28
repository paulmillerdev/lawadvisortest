import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";
import { Util } from "../../../../util/util";
import { HTTPStatusCode } from "../../../../util/http_code";

type TaskAddPayload = {
    token: string,
    task: {
        title: string,
        details: string
    }
}

export class TaskAddAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/task/add";

    isPayloadValid(obj: any): obj is TaskAddPayload {
        return (
            Util.isMemberValid(obj.token, Util.isString) &&
            Util.isMemberValid(obj.task, Util.isObject) &&
                Util.isMemberValid(obj.task.title, Util.isString) &&
                Util.isMemberValid(obj.task.details, Util.isString)
        );
    }

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            if (!this.isPayloadValid(request.body)) {
                return response.status(HTTPStatusCode.BAD_REQUEST).send({
                    message: 'Invalid input. Please refer to the documentation.'
                });
            }

            const { token, task } = <TaskAddPayload> request.body;
            const { title, details } = task;
            let userId: string = await DBManager.getTokenUserId(token);

            if (userId) {
                let maxOrder: number = await DBManager.getMaxTaskOrder(userId);
                let addStatus: boolean = await DBManager.addTask(userId, title, details, maxOrder + 1);
                
                if (addStatus) {
                    response.status(HTTPStatusCode.OK).send({
                        message: 'Add task successfull.'
                    });
                } else {
                    response.status(HTTPStatusCode.BAD_REQUEST).send({
                        message: 'Add task failed.'
                    });
                }
            } else {
                response.status(HTTPStatusCode.UNAUTHORIZED).send({
                    message: 'Invalid access token.'
                });
            }
            
        };
    }
}