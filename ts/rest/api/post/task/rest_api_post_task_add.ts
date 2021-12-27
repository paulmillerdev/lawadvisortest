import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";

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
            obj.token !== undefined &&
            obj.task !== undefined &&
                obj.task.title !== undefined &&
                obj.task.details !== undefined
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

            const { token, task } = <TaskAddPayload> request.body;
            const { title, details } = task;
            let userId: string = await DBManager.getTokenUserId(token);

            if (userId) {
                let maxOrder: number = await DBManager.getMaxTaskOrder(userId);
                let addStatus: boolean = await DBManager.addTask(userId, title, details, maxOrder + 1);
                
                if (addStatus) {
                    response.send({
                        message: 'Add task successfull.'
                    });
                } else {
                    response.send({
                        message: 'Add task failed.'
                    });
                }
            } else {
                response.send({
                    message: 'Invalid access token.'
                });
            }
            
        };
    }
}