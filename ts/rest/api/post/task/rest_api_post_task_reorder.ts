import { API } from "../../../interface/rest_api_interface";
import { Callback } from "../../../interface/rest_api_callback_interface";
import { ExpressMethod, ExpressRequest, ExpressResponse } from "../../../../adapter/express";
import { DBManager } from "../../../../db/database_manager";
import { Util } from "../../../../util/util";
import { HTTPStatusCode } from "../../../../util/http_code";

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
            Util.isMemberValid(obj.token, Util.isString) &&
            Util.isMemberValid(obj.task, Util.isObject) &&
                Util.isMemberValid(obj.task.id, Util.isNumber) &&
                Util.isMemberValid(obj.task.order, Util.isNumber)
        );
    }

    getCallback(): Callback {
        return async (request: ExpressRequest, response: ExpressResponse) => {
            if (!this.isPayloadValid(request.body)) {
                return response.status(HTTPStatusCode.BAD_REQUEST).send({
                    message: 'Invalid input. Please refer to the documentation.'
                });
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
                        response.status(HTTPStatusCode.OK).send({
                            message: 'Reorder task successfull.'
                        });
                    } else {
                        response.status(HTTPStatusCode.BAD_REQUEST).send({
                            message: 'Reorder task failed.'
                        });
                    }
                }
            } else {
                response.status(HTTPStatusCode.UNAUTHORIZED).send({
                    message: 'Invalid access token.'
                });
            }
            
        };
    }
}