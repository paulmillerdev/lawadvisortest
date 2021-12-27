import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";

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
            obj.token !== undefined &&
            obj.task !== undefined &&
                obj.task.id !== undefined &&
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

            const { token, task } = <TaskUpdatePayload> request.body;
            const { id, title, details } = task;
            let userId: string = await DBManager.getTokenUserId(token);

            if (userId) {
                let updateStatus: boolean = await DBManager.updateTask(userId, id, title, details);
                
                if (updateStatus) {
                    response.send({
                        message: 'Update task successfull.'
                    });
                } else {
                    response.send({
                        message: 'Update task failed.'
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