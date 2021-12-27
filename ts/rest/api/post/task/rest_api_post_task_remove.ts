import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";

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
            obj.token !== undefined &&
            obj.task !== undefined &&
                obj.task.id !== undefined
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

            const { token, task } = <TaskRemovePayload> request.body;
            const { id } = task;
            let userId: string = await DBManager.getTokenUserId(token);

            if (userId) {
                let currOrder: number = await DBManager.getTaskOrder(userId, id);
                let removeStatus: boolean = await DBManager.removeTask(userId, id);
                let moveStatus: boolean = await DBManager.moveTasksUp(userId, currOrder);
                
                if (removeStatus && moveStatus) {
                    response.send({
                        message: 'Remove task successfull.'
                    });
                } else {
                    response.send({
                        message: 'Remove task failed.'
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