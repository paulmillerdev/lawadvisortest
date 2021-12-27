import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";

type TaskReorderPayload = {
    token: string,
    task: {
        id: string,
        order: string
    }
}

export class TaskReorderAPI implements API {
    httpMethod: ExpressMethod = ExpressMethod.POST;
    path: string = "/task/reorder";

    isPayloadValid(obj: any): obj is TaskReorderPayload {
        return (
            obj.token !== undefined &&
            obj.task !== undefined &&
                obj.task.id !== undefined &&
                obj.task.order !== undefined
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

            const { token, task } = <TaskReorderPayload> request.body;
            const { id, order } = task;
            let userId: string = await DBManager.getTokenUserId(token);

            if (userId) {
                let currOrder: number = await DBManager.getTaskOrder(userId, id);
                let newOrder: number = Number(order);
                let moveStatus: boolean = false;

                if (currOrder == newOrder) {
                    response.send({
                        message: 'No change in order.'
                    });
                } else {
                    if (newOrder > currOrder) {
                        let maxOrder: number = await DBManager.getMaxTaskOrder(userId);
                        if (newOrder > maxOrder) {
                            newOrder = maxOrder;
                        }
                        moveStatus = await DBManager.moveTasksUp(userId, currOrder, newOrder);
                    } else {
                        if (newOrder < 1) {
                            newOrder = 1;
                        }
                        moveStatus = await DBManager.moveTasksDown(userId, currOrder, newOrder);
                    }

                    let updateStatus = await DBManager.updateTaskOrder(userId, id, newOrder);

                    if (updateStatus && moveStatus) {
                        response.send({
                            message: 'Reorder task successfull.'
                        });
                    } else {
                        response.send({
                            message: 'Reorder task failed.'
                        });
                    }
                }
            } else {
                response.send({
                    message: 'Invalid access token.'
                });
            }
            
        };
    }
}