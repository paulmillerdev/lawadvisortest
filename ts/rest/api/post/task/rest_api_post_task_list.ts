import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";
import { Util } from "../../../../util/util";
import { HTTPStatusCode } from "../../../../util/http_code";

type TaskListPayload = {
    token: string
}

export class TaskListAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/task/list";

    isPayloadValid(obj: any): obj is TaskListPayload {
        return (
            Util.isMemberValid(obj.token, Util.isString)
        );
    }

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            if (!this.isPayloadValid(request.body)) {
                return response.status(HTTPStatusCode.BAD_REQUEST).send({
                    message: 'Invalid input. Please refer to the documentation.'
                });
            }

            const { token } = <TaskListPayload> request.body;
            let userId: string = await DBManager.getTokenUserId(token);

            if (userId) {
                let allTasks: object[] = await DBManager.getTaskList(userId);
                let taskList: object[] = allTasks.map((task: any) => {
                    return {
                        id: task.task_id,
                        title: task.task_title,
                        details: task.task_details,
                        order: task.task_order
                    };
                });
                response.status(HTTPStatusCode.OK).send({
                    task : taskList
                });
            } else {
                response.status(HTTPStatusCode.UNAUTHORIZED).send({
                    message: 'Invalid access token.'
                });
            }
            
        };
    }
}