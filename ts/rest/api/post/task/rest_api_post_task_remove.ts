import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";
import { Util } from "../../../../util/util";
import { HTTPStatusCode } from "../../../../util/http_code";

type TaskRemovePayload = {
    token: string,
    task: {
        id: string
    }
}

export class TaskRemoveAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/task/remove";

    isPayloadValid(obj: any): obj is TaskRemovePayload {
        return (
            Util.isMemberValid(obj.token, Util.isString) &&
            Util.isMemberValid(obj.task, Util.isObject) &&
                Util.isMemberValid(obj.task.id, Util.isNumber)
        );
    }

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            if (!this.isPayloadValid(request.body)) {
                return response.status(HTTPStatusCode.BAD_REQUEST).send({
                    message: 'Invalid input. Please refer to the documentation.'
                });
            }

            const { token, task } = <TaskRemovePayload> request.body;
            const { id } = task;
            let userId: string = await DBManager.getTokenUserId(token);

            if (userId) {
                let currOrder: number = await DBManager.getTaskOrder(userId, id);
                let removeStatus: boolean = await DBManager.removeTask(userId, id);
                let moveStatus: boolean = await DBManager.moveTasksUp(userId, currOrder);
                
                if (removeStatus && moveStatus) {
                    response.status(HTTPStatusCode.OK).send({
                        message: 'Remove task successfull.'
                    });
                } else {
                    response.status(HTTPStatusCode.BAD_REQUEST).send({
                        message: 'Remove task failed.'
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