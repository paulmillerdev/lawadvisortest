import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";
import { Util } from "../../../../util/util";
import { HTTPStatusCode } from "../../../../util/http_code";

type TaskUpdatePayload = {
    token: string,
    task: {
        id: string,
        title: string,
        details: string
    }
}

export class TaskUpdateAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/task/update";

    isPayloadValid(obj: any): obj is TaskUpdatePayload {
        return (
            Util.isMemberValid(obj.token, Util.isString) &&
            Util.isMemberValid(obj.task, Util.isObject) &&
                Util.isMemberValid(obj.task.id, Util.isNumber) &&
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

            const { token, task } = <TaskUpdatePayload> request.body;
            const { id, title, details } = task;
            let userId: string = await DBManager.getTokenUserId(token);

            if (userId) {
                let updateStatus: boolean = await DBManager.updateTask(userId, id, title, details);
                
                if (updateStatus) {
                    response.status(HTTPStatusCode.OK).send({
                        message: 'Update task successfull.'
                    });
                } else {
                    response.status(HTTPStatusCode.BAD_REQUEST).send({
                        message: 'Update task failed.'
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